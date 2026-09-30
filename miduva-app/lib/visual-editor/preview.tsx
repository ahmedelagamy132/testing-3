"use client"

import { useEffect, useRef, useState } from "react"
import type { ReactNode } from "react"
import type { PageContent } from "./types"
import { MSG, SETTINGS_SECTION, type ElementTarget, type FromPreview, type ToPreview } from "./protocol"

const PREVIEW_CSS = `
html[data-ve-editing] [data-edit-section] { cursor: pointer; }
html[data-ve-editing] [data-edit-path]:hover { outline: 1px dashed rgba(43,200,183,.9) !important; outline-offset: 3px; }
html[data-ve-editing] [data-edit-active] { outline: 2px solid #2bc8b7 !important; outline-offset: 4px; }
html[data-ve-editing] .ve-section-flash { animation: ve-section-flash 1.8s ease-out; }
@keyframes ve-section-flash { 0%, 25% { box-shadow: inset 0 0 0 3px rgba(43,200,183,.7); } 100% { box-shadow: inset 0 0 0 3px rgba(43,200,183,0); } }
.ve-hover-badge { position: fixed; z-index: 2147483647; pointer-events: none; padding: 5px 9px; border-radius: 6px; background: #071226; color: #fff;
  font: 600 12px/1 system-ui, sans-serif; box-shadow: 0 4px 14px rgba(0,0,0,.25); }
.ve-hover-badge[hidden] { display: none; }
.ve-hover-badge b { color: #56d6c8; font-weight: 600; }
`

const clean = (value: string | null | undefined) => value?.replace(/\s+/g, " ").trim() ?? ""

function directText(element: Element) {
  return Array.from(element.childNodes).filter((node) => node.nodeType === Node.TEXT_NODE).map((node) => node.textContent).join(" ")
}

function backgroundSource(element: Element) {
  return getComputedStyle(element).backgroundImage.match(/^url\(["']?(.*?)["']?\)$/)?.[1] ?? ""
}

// Animated pages often stack transparent layers over the real content, so pick the
// deepest visible element under the pointer instead of trusting event.target.
function visibleTargetAt(section: HTMLElement, x: number, y: number) {
  let best: HTMLElement = section
  let bestDepth = -1
  let bestArea = Infinity
  for (const element of [section, ...Array.from(section.querySelectorAll<HTMLElement>("*"))]) {
    const rect = element.getBoundingClientRect()
    if (rect.width < 1 || rect.height < 1 || x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) continue
    const style = getComputedStyle(element)
    if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) === 0) continue
    const meaningful = clean(directText(element)) || clean(element.getAttribute("aria-label")) || element.tagName === "IMG" || backgroundSource(element) || element.matches("a, button, input, textarea, select")
    if (!meaningful) continue
    let depth = 0
    for (let node: HTMLElement | null = element; node && node !== section; node = node.parentElement) depth += 1
    const area = rect.width * rect.height
    if (depth > bestDepth || (depth === bestDepth && area < bestArea)) {
      best = element
      bestDepth = depth
      bestArea = area
    }
  }
  return best
}

function sectionAt(x: number, y: number) {
  return document.elementsFromPoint(x, y).map((element) => element.closest<HTMLElement>("[data-edit-section]")).find(Boolean) ?? null
}

/**
 * Wrap your page in the preview route. The editor streams draft content into it,
 * and clicks on elements marked with data-edit-* attributes open the matching field.
 */
export function EditablePreview({ initialContent, children }: { initialContent: PageContent; children: (content: PageContent) => ReactNode }) {
  const [content, setContent] = useState(initialContent)
  const badgeRef = useRef<HTMLDivElement>(null)
  const labelsRef = useRef<Record<string, string>>({})
  const contentRef = useRef(content)
  useEffect(() => {
    contentRef.current = content
  }, [content])

  useEffect(() => {
    const root = document.documentElement
    root.setAttribute("data-ve-editing", "true")
    const post = (message: FromPreview) => window.parent.postMessage(message, window.location.origin)

    const onMessage = (event: MessageEvent<ToPreview>) => {
      if (event.origin !== window.location.origin || event.source !== window.parent) return
      const message = event.data
      if (message?.type === MSG.content) {
        labelsRef.current = message.labels
        setContent(message.content)
      }
      if (message?.type === MSG.reveal) {
        const section = document.querySelector<HTMLElement>(`[data-edit-section="${CSS.escape(message.sectionId)}"]`)
        if (!section) return
        section.scrollIntoView({ behavior: "smooth", block: "start" })
        section.classList.remove("ve-section-flash")
        void section.offsetWidth
        section.classList.add("ve-section-flash")
      }
    }

    const onClick = (event: MouseEvent) => {
      // Links and buttons that navigate would take the admin away from the editor.
      if ((event.target as Element | null)?.closest?.("a[href]")) {
        event.preventDefault()
        event.stopPropagation()
      }
      const section = sectionAt(event.clientX, event.clientY)
      const sectionId = section?.dataset.editSection
      if (!section || !sectionId) return
      const visible = visibleTargetAt(section, event.clientX, event.clientY)
      const marked = visible.closest<HTMLElement>("[data-edit-path]")
      const element = marked && section.contains(marked) ? marked : visible
      document.querySelectorAll("[data-edit-active]").forEach((node) => node.removeAttribute("data-edit-active"))
      element.setAttribute("data-edit-active", "true")
      const link = element.closest("a")
      const image = element.closest("img")
      const target: ElementTarget = {
        sectionId,
        scope: element.closest<HTMLElement>("[data-edit-scope]")?.dataset.editScope ?? section.dataset.editScope,
        path: element.dataset.editPath,
        text: clean(element.innerText || element.textContent),
        directText: clean(directText(element)),
        ariaLabel: clean(element.getAttribute("aria-label") || element.closest("a, button")?.getAttribute("aria-label")),
        alt: clean(image?.alt),
        href: link?.href ?? "",
        src: image?.currentSrc || image?.src || backgroundSource(element),
      }
      post({ type: MSG.select, target })
    }

    const onSubmit = (event: SubmitEvent) => {
      event.preventDefault()
      event.stopPropagation()
    }

    // The hover badge is updated directly so mouse movement never re-renders the page.
    const setBadge = (next: { x: number; y: number; label: string } | null) => {
      const badge = badgeRef.current
      if (!badge) return
      badge.hidden = !next
      if (!next) return
      badge.style.left = `${next.x}px`
      badge.style.top = `${next.y}px`
      badge.lastChild!.textContent = ` ${next.label} — click to edit`
    }

    let frame = 0
    const onMove = (event: MouseEvent) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const section = sectionAt(event.clientX, event.clientY)
        const id = section?.dataset.editSection
        if (!section || !id) return setBadge(null)
        const type = id === SETTINGS_SECTION ? SETTINGS_SECTION : contentRef.current.sections.find((entry) => entry.id === id)?.type
        const label = type ? labelsRef.current[type] : undefined
        if (!label) return setBadge(null)
        const rect = section.getBoundingClientRect()
        setBadge({ x: Math.max(8, rect.left + 8), y: Math.max(8, rect.top + 8), label })
      })
    }
    const onLeave = () => setBadge(null)

    window.addEventListener("message", onMessage)
    document.addEventListener("click", onClick, true)
    document.addEventListener("submit", onSubmit, true)
    document.addEventListener("mousemove", onMove, { passive: true })
    document.documentElement.addEventListener("mouseleave", onLeave)
    post({ type: MSG.ready })
    return () => {
      cancelAnimationFrame(frame)
      root.removeAttribute("data-ve-editing")
      window.removeEventListener("message", onMessage)
      document.removeEventListener("click", onClick, true)
      document.removeEventListener("submit", onSubmit, true)
      document.removeEventListener("mousemove", onMove)
      document.documentElement.removeEventListener("mouseleave", onLeave)
    }
  }, [])

  return (
    <>
      <style>{PREVIEW_CSS}</style>
      {children(content)}
      <div ref={badgeRef} className="ve-hover-badge" hidden><b>✎</b><span /></div>
    </>
  )
}
