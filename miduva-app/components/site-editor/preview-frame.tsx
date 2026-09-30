"use client"

import { EditablePreview } from "@/lib/visual-editor"
import { LandingPage } from "@/components/puck/landing-page"
import type { LandingContent } from "@/lib/site-editor/content"

export function PreviewFrame({ initialContent }: { initialContent: LandingContent }) {
  return (
    <EditablePreview initialContent={initialContent}>
      {(content) => {
        const page = content as LandingContent
        return <LandingPage key={page.settings.defaultTheme ?? "dark"} content={page} />
      }}
    </EditablePreview>
  )
}
