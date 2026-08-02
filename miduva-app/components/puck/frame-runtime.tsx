"use client"

import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useReducer,
  useRef,
  useState,
} from "react"
import type { ReactNode, RefObject } from "react"
import { useMotionValue } from "motion/react"
import type { MotionValue } from "motion/react"

export type FrameRuntime = {
  document: Document
  window: Window & typeof globalThis
  isIframe: boolean
}

export type FrameScrollRange = {
  start: readonly [targetRatio: number, viewportRatio: number]
  end: readonly [targetRatio: number, viewportRatio: number]
}

export const STICKY_SCROLL_RANGE: FrameScrollRange = {
  start: [0, 0],
  end: [1, 1],
}

export const VIEWPORT_SCROLL_RANGE: FrameScrollRange = {
  start: [0, 1],
  end: [1, 0],
}

const FrameRuntimeContext = createContext<FrameRuntime | null>(null)

export function FrameRuntimeProvider({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [runtime, setRuntime] = useState<FrameRuntime | null>(null)

  useLayoutEffect(() => {
    const frameDocument = rootRef.current?.ownerDocument
    const frameWindow = frameDocument?.defaultView
    if (!frameDocument || !frameWindow) return

    setRuntime({
      document: frameDocument,
      window: frameWindow,
      isIframe: frameWindow !== window,
    })
  }, [])

  return (
    <FrameRuntimeContext.Provider value={runtime}>
      <div ref={rootRef} className={className}>
        {children}
      </div>
    </FrameRuntimeContext.Provider>
  )
}

export function useFrameRuntime() {
  return useContext(FrameRuntimeContext)
}

export function FrameThemeSync({ theme }: { theme: "dark" | "light" }) {
  const runtime = useFrameRuntime()

  useLayoutEffect(() => {
    if (!runtime) return
    const root = runtime.document.documentElement
    root.classList.toggle("dark", theme === "dark")
  }, [runtime, theme])

  return null
}

export function useFrameIsDark(defaultValue = true) {
  const runtime = useFrameRuntime()
  const [isDark, setIsDark] = useState(defaultValue)

  useLayoutEffect(() => {
    if (!runtime) return
    const root = runtime.document.documentElement
    const sync = () => setIsDark(root.classList.contains("dark"))
    const observer = new runtime.window.MutationObserver(sync)
    sync()
    observer.observe(root, { attributes: true, attributeFilter: ["class"] })
    return () => observer.disconnect()
  }, [runtime])

  return isDark
}

export function useFrameMediaQuery(query: string, defaultValue = false) {
  const runtime = useFrameRuntime()
  const [, refresh] = useReducer((value) => value + 1, 0)
  const matches = runtime?.window.matchMedia(query).matches ?? defaultValue

  useEffect(() => {
    if (!runtime) return
    const media = runtime.window.matchMedia(query)
    const onChange = () => refresh()
    media.addEventListener("change", onChange)
    return () => media.removeEventListener("change", onChange)
  }, [query, runtime])

  return matches
}

export function useFrameInView<T extends Element>(
  ref: RefObject<T | null>,
  {
    amount = "some",
    initial = false,
    margin = "0px",
    once = false,
  }: {
    amount?: "some" | "all" | number
    initial?: boolean
    margin?: string
    once?: boolean
  } = {},
) {
  const runtime = useFrameRuntime()
  const [isInView, setIsInView] = useState(initial)
  const hasEntered = useRef(initial)

  useEffect(() => {
    const element = ref.current
    if (!runtime || !element || (once && hasEntered.current)) return

    const threshold = typeof amount === "number" ? amount : amount === "all" ? 1 : 0
    const observer = new runtime.window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          hasEntered.current = true
          setIsInView(true)
          if (once) observer.disconnect()
        } else if (!once) {
          setIsInView(false)
        }
      },
      { rootMargin: margin, threshold },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [amount, margin, once, ref, runtime])

  return isInView
}

function clampProgress(value: number) {
  return Math.min(1, Math.max(0, value))
}

export function bindFrameScrollProgress(
  runtime: FrameRuntime,
  element: HTMLElement,
  range: FrameScrollRange,
  onProgress: (progress: number) => void,
) {
  const frameWindow = runtime.window
  let animationFrame = 0

  const update = () => {
    animationFrame = 0
    const rect = element.getBoundingClientRect()
    const elementTop = rect.top + frameWindow.scrollY
    const elementHeight = element.offsetHeight
    const viewportHeight = frameWindow.innerHeight
    const start = elementTop + elementHeight * range.start[0] - viewportHeight * range.start[1]
    const end = elementTop + elementHeight * range.end[0] - viewportHeight * range.end[1]
    const distance = end - start
    onProgress(clampProgress(distance === 0 ? 1 : (frameWindow.scrollY - start) / distance))
  }

  const schedule = () => {
    if (!animationFrame) animationFrame = frameWindow.requestAnimationFrame(update)
  }

  const resizeObserver = new runtime.window.ResizeObserver(schedule)
  resizeObserver.observe(element)
  frameWindow.addEventListener("scroll", schedule, { passive: true })
  frameWindow.addEventListener("resize", schedule)
  update()

  return () => {
    resizeObserver.disconnect()
    frameWindow.removeEventListener("scroll", schedule)
    frameWindow.removeEventListener("resize", schedule)
    if (animationFrame) frameWindow.cancelAnimationFrame(animationFrame)
  }
}

export function useFrameScrollProgress<T extends HTMLElement>(
  ref: RefObject<T | null>,
  range: FrameScrollRange,
): MotionValue<number> {
  const runtime = useFrameRuntime()
  const progress = useMotionValue(0)

  useLayoutEffect(() => {
    const element = ref.current
    if (!runtime || !element) return
    return bindFrameScrollProgress(runtime, element, range, (value) => progress.set(value))
  }, [progress, range, ref, runtime])

  return progress
}
