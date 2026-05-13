"use client"

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

  return <AppWrapper data={transformLandingPage(data)} />
}
