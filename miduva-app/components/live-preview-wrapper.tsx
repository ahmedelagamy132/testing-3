"use client"

import { useEffect } from "react"
import { useLivePreview } from "@payloadcms/live-preview-react"
import { AppWrapper } from "@/components/app-wrapper"
import { transformLandingPage } from "@/payload/utils/transform-landing-page"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RawDoc = Record<string, any>

interface Props {
  initialDoc: RawDoc | null
  serverURL: string
}

export function LivePreviewWrapper({ initialDoc, serverURL }: Props) {
  const { data } = useLivePreview<RawDoc>({
    initialData: initialDoc ?? {},
    serverURL,
    depth: 1,
  })

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      const payload = event.data
      if (!payload || payload.type !== "miduva:focus-section") return
      const anchor = payload.anchor as string | undefined
      if (!anchor) return

      const target = document.getElementById(`anchor-${anchor}`)
      if (!target) return

      target.scrollIntoView({ behavior: "smooth", block: "start" })

      // Brief highlight glow so the editor sees which section they're focused on.
      target.classList.remove("preview-section-focus")
      // Force reflow to restart the animation if the user clicks the same tab again.
      void target.offsetWidth
      target.classList.add("preview-section-focus")
      window.setTimeout(() => target.classList.remove("preview-section-focus"), 2400)
    }

    window.addEventListener("message", handler)
    return () => window.removeEventListener("message", handler)
  }, [])

  return <AppWrapper data={transformLandingPage(data)} />
}
