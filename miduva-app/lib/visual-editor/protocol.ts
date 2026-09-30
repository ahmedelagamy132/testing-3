import type { PageContent } from './types'

// postMessage protocol between the editor (parent window) and the preview iframe.
// Pages mark editable elements with plain data attributes:
//   data-edit-section="<section id>"   wraps each section ("@settings" for page-wide content)
//   data-edit-path="title" / "items.2.question"   marks the field an element shows
//   data-edit-scope="nav"               prefixes paths inside "@settings"

export const SETTINGS_SECTION = '@settings'

export const MSG = {
  ready: 've:ready',
  content: 've:content',
  reveal: 've:reveal',
  select: 've:select',
} as const

export type ElementTarget = {
  sectionId: string
  scope?: string
  path?: string
  text: string
  directText: string
  ariaLabel: string
  alt: string
  href: string
  src: string
}

export type ToPreview =
  | { type: typeof MSG.content; content: PageContent; labels: Record<string, string> }
  | { type: typeof MSG.reveal; sectionId: string }

export type FromPreview =
  | { type: typeof MSG.ready }
  | { type: typeof MSG.select; target: ElementTarget }
