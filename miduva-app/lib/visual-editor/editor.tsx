"use client"
/* eslint-disable @next/next/no-img-element -- The editor must not depend on a framework's image component. */

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import type { EditorBackend, EditorConfig, HistoryEntry, PageContent, SectionDefinition } from "./types"
import { EditorConflictError } from "./types"
import { FieldList, type FieldContext } from "./fields"
import { Icon, type IconName } from "./icons"
import { MediaBackendContext } from "./media-input"
import { MSG, SETTINGS_SECTION, type FromPreview, type ToPreview } from "./protocol"
import { pathKey, resolveTargetPath, setAt, type PathPart } from "./paths"

type SaveState = "idle" | "saving" | "publishing" | "error"
type View = { kind: "sections" } | { kind: "settings" } | { kind: "section"; id: string } | { kind: "add" }

const DEFAULT_DEVICES: NonNullable<EditorConfig["devices"]> = [
  { id: "desktop", label: "Desktop", width: 1440, icon: "desktop" },
  { id: "tablet", label: "Tablet", width: 820, icon: "tablet" },
  { id: "mobile", label: "Mobile", width: 390, icon: "mobile" },
]
const HISTORY_LIMIT = 100
const AUTOSAVE_MS = 900
const same = (left: unknown, right: unknown) => JSON.stringify(left) === JSON.stringify(right)
const newSectionId = (type: string) => `${type}-${Date.now().toString(36)}`

function usePreviewSize(canvasRef: React.RefObject<HTMLDivElement | null>, deviceWidth: number, smallest: number) {
  const [size, setSize] = useState({ width: 0, height: 0 })
  useLayoutEffect(() => {
    const element = canvasRef.current
    if (!element) return
    const observer = new ResizeObserver(([entry]) => setSize({ width: entry.contentRect.width, height: entry.contentRect.height }))
    observer.observe(element)
    return () => observer.disconnect()
  }, [canvasRef])
  // On a phone the canvas can only sensibly show the narrowest layout.
  const phone = size.width > 0 && size.width < 600
  const width = phone ? Math.max(smallest, Math.round(size.width)) : deviceWidth
  const scale = size.width ? Math.min(1, size.width / width) : 1
  return { width, scale, height: size.height ? size.height / scale : 800, framed: !phone && width < 1200 }
}

export type VisualEditorProps = {
  config: EditorConfig
  backend: EditorBackend
  /** The current draft. */
  initialContent: PageContent
  /** What is live right now — used to show "not published yet". Defaults to the draft. */
  publishedContent?: PageContent
}

export function VisualEditor({ config, backend, initialContent, publishedContent }: VisualEditorProps) {
  const devices = config.devices ?? DEFAULT_DEVICES
  const [content, setContent] = useState(initialContent)
  const [published, setPublished] = useState(publishedContent ?? initialContent)
  const [view, setView] = useState<View>({ kind: "sections" })
  const [deviceId, setDeviceId] = useState(devices[0].id)
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [focus, setFocus] = useState<{ key: string; nonce: number } | null>(null)
  const [saveState, setSaveState] = useState<SaveState>("idle")
  const [error, setError] = useState("")
  const [pendingSave, setPendingSave] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [entries, setEntries] = useState<HistoryEntry[] | null>(null)
  const [mobilePane, setMobilePane] = useState<"edit" | "preview">("edit")
  const [undoStack, setUndoStack] = useState<{ past: PageContent[]; future: PageContent[] }>({ past: [], future: [] })

  const iframeRef = useRef<HTMLIFrameElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef(content)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const queueRef = useRef<Promise<void>>(Promise.resolve())
  const conflictRef = useRef(false)
  const lastPush = useRef(0)

  const device = devices.find((entry) => entry.id === deviceId) ?? devices[0]
  const preview = usePreviewSize(canvasRef, device.width, Math.min(...devices.map((entry) => entry.width)))
  const hasUnpublished = useMemo(() => !same(content, published), [content, published])
  const labels = useMemo(() => {
    const map: Record<string, string> = { [SETTINGS_SECTION]: config.settings?.label ?? "Site settings" }
    for (const [type, definition] of Object.entries(config.sections)) map[type] = definition.label
    return map
  }, [config])

  // ── Preview ───────────────────────────────────────────────────
  const postToPreview = useCallback((message: ToPreview) => {
    iframeRef.current?.contentWindow?.postMessage(message, window.location.origin)
  }, [])

  useEffect(() => {
    contentRef.current = content
    postToPreview({ type: MSG.content, content, labels })
  }, [content, labels, postToPreview])

  // ── Saving ────────────────────────────────────────────────────
  const run = useCallback(async (action: () => Promise<void>) => {
    if (conflictRef.current) throw new EditorConflictError()
    try {
      await action()
    } catch (reason) {
      if (reason instanceof EditorConflictError) conflictRef.current = true
      throw reason
    }
  }, [])

  const saveDraft = useCallback(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = null
    const snapshot = contentRef.current
    queueRef.current = queueRef.current
      .catch(() => undefined)
      .then(async () => {
        setSaveState("saving")
        await run(() => backend.saveDraft(snapshot))
        setError("")
        setSaveState("idle")
        if (contentRef.current === snapshot) setPendingSave(false)
      })
      .catch((reason: Error) => {
        setSaveState("error")
        setError(reason.message || "Could not save")
      })
    return queueRef.current
  }, [backend, run])

  const apply = useCallback((next: PageContent, options: { coalesce?: boolean; record?: boolean } = {}) => {
    const previous = contentRef.current
    if (next === previous) return
    if (options.record !== false) {
      const now = Date.now()
      const startNewStep = !options.coalesce || now - lastPush.current > 700
      setUndoStack((current) => startNewStep
        ? { past: [...current.past.slice(-HISTORY_LIMIT + 1), previous], future: [] }
        : current.future.length ? { ...current, future: [] } : current)
      lastPush.current = now
    }
    contentRef.current = next
    setContent(next)
    setPendingSave(true)
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => void saveDraft(), AUTOSAVE_MS)
  }, [saveDraft])

  function undo() {
    const previous = undoStack.past.at(-1)
    if (!previous) return
    setUndoStack({ past: undoStack.past.slice(0, -1), future: [contentRef.current, ...undoStack.future] })
    lastPush.current = 0
    apply(previous, { record: false })
  }

  function redo() {
    const next = undoStack.future[0]
    if (!next) return
    setUndoStack({ past: [...undoStack.past, contentRef.current], future: undoStack.future.slice(1) })
    lastPush.current = 0
    apply(next, { record: false })
  }

  async function publish() {
    if (saveTimer.current) clearTimeout(saveTimer.current)
    await queueRef.current.catch(() => undefined)
    const snapshot = contentRef.current
    setSaveState("publishing")
    try {
      await run(() => backend.publish(snapshot))
      setPublished(snapshot)
      setError("")
      setSaveState("idle")
      if (contentRef.current === snapshot) setPendingSave(false)
      setEntries(null)
    } catch (reason) {
      setSaveState("error")
      setError(reason instanceof Error ? reason.message : "Publishing failed")
    }
  }

  function discard() {
    if (window.confirm("Throw away every change that isn’t published yet?")) apply(structuredClone(published))
  }

  async function openHistory() {
    if (!backend.listHistory) return
    setHistoryOpen(true)
    try {
      setEntries(await backend.listHistory())
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not load history")
      setEntries([])
    }
  }

  // ── Navigation & editing ──────────────────────────────────────
  const toggle = useCallback((key: string) => {
    setExpanded((current) => {
      const next = new Set(current)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }, [])

  const openSection = useCallback((id: string) => {
    setView({ kind: "section", id })
    setExpanded(new Set())
    postToPreview({ type: MSG.reveal, sectionId: id })
  }, [postToPreview])

  const focusPath = useCallback((path: PathPart[]) => {
    setExpanded((current) => {
      const next = new Set(current)
      path.forEach((part, index) => typeof part === "number" && next.add(pathKey(path.slice(0, index + 1))))
      return next
    })
    setFocus({ key: pathKey(path), nonce: Date.now() })
  }, [])

  const activeIndex = view.kind === "section" ? content.sections.findIndex((section) => section.id === view.id) : -1
  const activeSection = activeIndex >= 0 ? content.sections[activeIndex] : undefined
  const activeDefinition = activeSection ? config.sections[activeSection.type] : undefined

  const sectionCtx: FieldContext = useMemo(() => ({
    expanded,
    toggle,
    onChange: (path, value) => activeIndex >= 0 && apply(setAt(contentRef.current, ["sections", activeIndex, "props", ...path], value), { coalesce: true }),
  }), [activeIndex, apply, expanded, toggle])

  const settingsCtx: FieldContext = useMemo(() => ({
    expanded,
    toggle,
    onChange: (path, value) => apply(setAt(contentRef.current, ["settings", ...path], value), { coalesce: true }),
  }), [apply, expanded, toggle])

  function moveSection(index: number, direction: -1 | 1) {
    const sections = [...content.sections]
    ;[sections[index], sections[index + direction]] = [sections[index + direction], sections[index]]
    apply({ ...content, sections })
  }

  function toggleHidden(index: number) {
    apply(setAt(content, ["sections", index, "hidden"], content.sections[index].hidden ? undefined : true))
  }

  function removeSection(index: number) {
    const section = content.sections[index]
    if (!window.confirm(`Remove the “${config.sections[section.type]?.label ?? section.type}” section? You can undo this.`)) return
    apply({ ...content, sections: content.sections.filter((_, i) => i !== index) })
    setView({ kind: "sections" })
  }

  function addSection(type: string, definition: SectionDefinition) {
    const id = newSectionId(type)
    apply({ ...content, sections: [...content.sections, { id, type, props: definition.defaults!() }] })
    setView({ kind: "section", id })
    setExpanded(new Set())
    // Give the preview a moment to render the new section before scrolling to it.
    setTimeout(() => postToPreview({ type: MSG.reveal, sectionId: id }), 150)
  }

  const addable = Object.entries(config.sections).filter(([type, definition]) =>
    definition.defaults && !(definition.single && content.sections.some((section) => section.type === type)))

  // Scroll the requested field into view once it has rendered.
  useEffect(() => {
    if (!focus) return
    const frame = requestAnimationFrame(() => {
      const parts = focus.key.split(".")
      let element: HTMLElement | null = null
      for (let length = parts.length; length > 0 && !element; length -= 1) {
        element = document.querySelector<HTMLElement>(`.ve-panel [data-path="${CSS.escape(parts.slice(0, length).join("."))}"]`)
      }
      if (!element) return
      element.scrollIntoView({ behavior: "smooth", block: "center" })
      element.classList.remove("is-flash")
      void element.offsetWidth
      element.classList.add("is-flash")
      const input = element.matches("input, textarea, select") ? element : element.querySelector<HTMLElement>("input, textarea, select")
      input?.focus({ preventScroll: true })
    })
    return () => cancelAnimationFrame(frame)
  }, [focus, view])

  // Messages from the preview.
  useEffect(() => {
    const onMessage = (event: MessageEvent<FromPreview>) => {
      if (event.origin !== window.location.origin || event.source !== iframeRef.current?.contentWindow) return
      const message = event.data
      if (message?.type === MSG.ready) {
        postToPreview({ type: MSG.content, content: contentRef.current, labels })
        return
      }
      if (message?.type !== MSG.select) return
      const { target } = message
      const current = contentRef.current
      setMobilePane("edit")
      if (target.sectionId === SETTINGS_SECTION) {
        if (!config.settings) return
        setView({ kind: "settings" })
        focusPath(resolveTargetPath(current.settings, target, target.scope ? [target.scope] : []))
        return
      }
      const section = current.sections.find((entry) => entry.id === target.sectionId)
      if (!section) return
      setView({ kind: "section", id: section.id })
      setExpanded(new Set())
      focusPath(resolveTargetPath(section.props, target))
    }
    window.addEventListener("message", onMessage)
    return () => window.removeEventListener("message", onMessage)
  }, [config.settings, focusPath, labels, postToPreview])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey)) return
      const key = event.key.toLowerCase()
      if (key === "z" && !event.shiftKey) { event.preventDefault(); undo() }
      else if ((key === "z" && event.shiftKey) || key === "y") { event.preventDefault(); redo() }
      else if (key === "s") { event.preventDefault(); void saveDraft() }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  })

  useEffect(() => {
    if (!pendingSave) return
    const onBeforeUnload = (event: BeforeUnloadEvent) => event.preventDefault()
    window.addEventListener("beforeunload", onBeforeUnload)
    return () => window.removeEventListener("beforeunload", onBeforeUnload)
  }, [pendingSave])

  useEffect(() => () => {
    if (saveTimer.current) clearTimeout(saveTimer.current)
  }, [])

  // ── Render ────────────────────────────────────────────────────
  const status = saveState === "error"
    ? { tone: "error", text: error }
    : saveState === "publishing"
      ? { tone: "busy", text: "Publishing…" }
      : saveState === "saving" || pendingSave
        ? { tone: "busy", text: "Saving…" }
        : hasUnpublished
          ? { tone: "draft", text: "Saved · not published yet" }
          : { tone: "live", text: "Everything is published" }

  const backToList = <button type="button" className="ve-back" onClick={() => setView({ kind: "sections" })}><Icon name="back" /> All sections</button>

  return (
    <MediaBackendContext.Provider value={backend}>
      <div className={`ve-shell is-${mobilePane}`}>
        <header className="ve-topbar">
          <div className="ve-topbar__brand">
            {config.logo ? <img src={config.logo.src} alt={config.logo.alt} width={config.logo.width ?? 96} /> : <strong>{config.title ?? "Editor"}</strong>}
            <span className={`ve-status is-${status.tone}`} role="status"><i />{status.text}</span>
          </div>

          <div className="ve-devices" role="group" aria-label="Preview size">
            {devices.map((entry) => (
              <button key={entry.id} type="button" aria-pressed={entry.id === device.id} title={`${entry.label} (${entry.width}px)`} onClick={() => { setDeviceId(entry.id); setMobilePane("preview") }}>
                <Icon name={(entry.icon ?? "desktop") as IconName} /><span>{entry.label}</span>
              </button>
            ))}
          </div>

          <div className="ve-topbar__actions">
            <button type="button" className="ve-icon-button is-dark" aria-label="Undo" title="Undo (Ctrl+Z)" disabled={!undoStack.past.length} onClick={undo}><Icon name="undo" /></button>
            <button type="button" className="ve-icon-button is-dark" aria-label="Redo" title="Redo (Ctrl+Shift+Z)" disabled={!undoStack.future.length} onClick={redo}><Icon name="redo" /></button>
            {backend.listHistory ? <button type="button" className="ve-icon-button is-dark" aria-label="Earlier versions" title="Earlier versions" onClick={() => void openHistory()}><Icon name="history" /></button> : null}
            {config.liveUrl ? <a className="ve-icon-button is-dark" href={config.liveUrl} target="_blank" rel="noreferrer" aria-label="Open live site" title="Open live site"><Icon name="external" /></a> : null}
            {backend.signOut ? <button type="button" className="ve-icon-button is-dark" aria-label="Sign out" title="Sign out" onClick={() => void backend.signOut!()}><Icon name="logout" /></button> : null}
            {hasUnpublished ? <button type="button" className="ve-button is-ghost" onClick={discard}>Discard</button> : null}
            <button type="button" className="ve-button is-publish" disabled={!hasUnpublished || saveState === "publishing"} onClick={() => void publish()}>
              {saveState === "publishing" ? "Publishing…" : "Publish"}
            </button>
          </div>
        </header>

        <div className="ve-mobile-tabs" role="tablist">
          <button type="button" role="tab" aria-selected={mobilePane === "edit"} onClick={() => setMobilePane("edit")}>Edit</button>
          <button type="button" role="tab" aria-selected={mobilePane === "preview"} onClick={() => setMobilePane("preview")}>Preview</button>
        </div>

        <div className="ve-body">
          <aside className="ve-panel" aria-label="Editor">
            {view.kind === "sections" ? (
              <div className="ve-panel__inner">
                <div className="ve-panel__intro">
                  <h1>{config.title ?? "Page"}</h1>
                  <p><Icon name="pointer" /> Click anything in the preview to change it, or choose a section below.</p>
                </div>
                {config.settings ? (
                  <button type="button" className="ve-settings-link" onClick={() => setView({ kind: "settings" })}>
                    <Icon name="settings" />
                    <span><strong>{config.settings.label ?? "Site settings"}</strong>{config.settings.description ? <small>{config.settings.description}</small> : null}</span>
                    <Icon name="chevron" />
                  </button>
                ) : null}
                <h2 className="ve-panel__heading">Sections</h2>
                <ol className="ve-sections">
                  {content.sections.map((section, index) => {
                    const definition = config.sections[section.type]
                    const label = definition?.label ?? section.type
                    return (
                      <li key={section.id} className={section.hidden ? "is-hidden" : ""}>
                        <button type="button" className="ve-sections__open" onClick={() => openSection(section.id)}>
                          <span className="ve-sections__num">{String(index + 1).padStart(2, "0")}</span>
                          <span><strong>{label}</strong><small>{section.hidden ? "Hidden from visitors" : definition?.description}</small></span>
                        </button>
                        <div className="ve-sections__actions">
                          <button type="button" className="ve-icon-button" aria-label={section.hidden ? `Show ${label}` : `Hide ${label}`} title={section.hidden ? "Show to visitors" : "Hide from visitors"} onClick={() => toggleHidden(index)}>
                            <Icon name={section.hidden ? "eyeOff" : "eye"} />
                          </button>
                          <button type="button" className="ve-icon-button" aria-label={`Move ${label} up`} disabled={index === 0} onClick={() => moveSection(index, -1)}><Icon name="up" /></button>
                          <button type="button" className="ve-icon-button" aria-label={`Move ${label} down`} disabled={index === content.sections.length - 1} onClick={() => moveSection(index, 1)}><Icon name="down" /></button>
                        </div>
                      </li>
                    )
                  })}
                </ol>
                {addable.length ? <button type="button" className="ve-add is-large" onClick={() => setView({ kind: "add" })}><Icon name="plus" /> Add a section</button> : null}
              </div>
            ) : view.kind === "add" ? (
              <div className="ve-panel__inner">
                {backToList}
                <div className="ve-panel__intro"><h1>Add a section</h1><p>It’s added at the end of the page. Move it with the arrows afterwards.</p></div>
                <div className="ve-library">
                  {addable.map(([type, definition]) => (
                    <button type="button" key={type} onClick={() => addSection(type, definition)}>
                      <strong>{definition.label}</strong>
                      {definition.description ? <small>{definition.description}</small> : null}
                    </button>
                  ))}
                </div>
              </div>
            ) : view.kind === "settings" && config.settings ? (
              <div className="ve-panel__inner">
                {backToList}
                <div className="ve-panel__intro"><h1>{config.settings.label ?? "Site settings"}</h1><p>{config.settings.description ?? "Applies to the whole page."}</p></div>
                <FieldList fields={config.settings.fields} value={content.settings} path={[]} ctx={settingsCtx} />
              </div>
            ) : activeSection && activeDefinition ? (
              <div className="ve-panel__inner">
                {backToList}
                <div className="ve-panel__intro">
                  <h1>{activeDefinition.label}</h1>
                  {activeDefinition.description ? <p>{activeDefinition.description}</p> : null}
                </div>
                {activeSection.hidden ? (
                  <div className="ve-notice">Visitors can’t see this section. <button type="button" onClick={() => toggleHidden(activeIndex)}>Show it</button></div>
                ) : null}
                <FieldList fields={activeDefinition.fields} value={activeSection.props} path={[]} ctx={sectionCtx} />
                <div className="ve-section-footer">
                  <button type="button" className="ve-button" onClick={() => toggleHidden(activeIndex)}>
                    <Icon name={activeSection.hidden ? "eye" : "eyeOff"} /> {activeSection.hidden ? "Show section" : "Hide section"}
                  </button>
                  {!activeDefinition.required ? (
                    <button type="button" className="ve-button is-danger" onClick={() => removeSection(activeIndex)}><Icon name="trash" /> Remove section</button>
                  ) : null}
                </div>
              </div>
            ) : (
              <div className="ve-panel__inner">{backToList}<p className="ve-muted">This section can’t be edited here.</p></div>
            )}
          </aside>

          <main className="ve-canvas" ref={canvasRef}>
            <div className={`ve-frame${preview.framed ? " is-framed" : ""}`} style={{ width: preview.width, height: preview.height, transform: `scale(${preview.scale})` }}>
              <iframe ref={iframeRef} src={config.previewUrl} title="Live preview" />
            </div>
          </main>
        </div>

        {historyOpen ? (
          <div className="ve-modal" role="dialog" aria-modal="true" aria-label="Earlier versions" onMouseDown={(event) => event.target === event.currentTarget && setHistoryOpen(false)}>
            <div className="ve-modal__card is-narrow">
              <header>
                <strong>Earlier versions</strong>
                <button type="button" className="ve-icon-button" aria-label="Close" onClick={() => setHistoryOpen(false)}><Icon name="close" /></button>
              </header>
              <p className="ve-muted">Every publish keeps the version it replaced. Loading one puts it in the editor — visitors only see it after you publish.</p>
              {!entries ? <p className="ve-muted">Loading…</p> : null}
              {entries && !entries.length ? <p className="ve-muted">Nothing published yet.</p> : null}
              <ul className="ve-history">
                {entries?.map((entry) => (
                  <li key={entry.id}>
                    <time dateTime={entry.createdAt}>{new Date(entry.createdAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}</time>
                    <button type="button" className="ve-button" onClick={() => {
                      if (!window.confirm("Load this version into the editor?")) return
                      apply(entry.content)
                      setHistoryOpen(false)
                    }}>Load</button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}
      </div>
    </MediaBackendContext.Provider>
  )
}
