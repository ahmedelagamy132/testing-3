"use client"

import { useMemo } from "react"
import { createRestBackend, defineEditor, VisualEditor, type PageContent } from "@/lib/visual-editor"
import { contentFromDocument, documentFromContent, type LandingContent } from "@/lib/site-editor/content"
import { MIDUVA_SECTIONS, SETTINGS_SCHEMA } from "@/lib/site-editor/schema"
import type { LandingPagePuckData } from "@/lib/puck/types"

// Miduva's integration of the reusable visual editor: which sections exist,
// where the preview lives, and how content maps onto the existing page API.
const config = defineEditor({
  title: "Landing page",
  logo: { src: "/assets/miduva-logo-white.png", alt: "Miduva", width: 96 },
  sections: MIDUVA_SECTIONS,
  settings: { label: "Site settings", description: "Logo, menu, search & sharing", fields: SETTINGS_SCHEMA },
  previewUrl: "/admin/preview",
  liveUrl: "/",
  links: [{ label: "Leads", href: "/admin/leads" }],
})

export function SiteEditor({ draft, published, version }: { draft: LandingContent; published: LandingContent; version: number }) {
  const backend = useMemo(() => createRestBackend({
    pageUrl: "/api/puck/page",
    historyUrl: "/api/puck/revisions",
    mediaUrl: "/api/puck/media",
    signOutUrl: "/api/puck/auth/logout",
    signInUrl: "/admin/login",
    initialVersion: version,
    serialize: (content) => documentFromContent(content as LandingContent),
    deserialize: (data) => contentFromDocument(data as LandingPagePuckData),
  }), [version])

  return <VisualEditor config={config} backend={backend} initialContent={draft as PageContent} publishedContent={published as PageContent} />
}
