// Public types for the visual editor. Nothing here is specific to one site.

/** One block on the page, e.g. a hero or an FAQ. `props` is whatever your section component renders. */
export type Section<Props = Record<string, unknown>> = {
  id: string
  type: string
  hidden?: boolean
  props: Props
}

/** The whole editable page: page-wide settings plus an ordered list of sections. */
export type PageContent = {
  settings: Record<string, unknown>
  sections: Section[]
}

export type Option = { label: string; value: string | number }

/** Form fields. Keys are property names inside the section's `props` (or settings). */
export type Field =
  | { kind: 'text'; key: string; label: string; help?: string; placeholder?: string }
  | { kind: 'textarea'; key: string; label: string; help?: string; placeholder?: string }
  | { kind: 'number'; key: string; label: string; help?: string; min?: number; max?: number }
  | { kind: 'toggle'; key: string; label: string; help?: string }
  | { kind: 'select'; key: string; label: string; help?: string; options: Option[] }
  | { kind: 'image'; key: string; label: string; help?: string }
  | { kind: 'link'; key: string; label: string; help?: string }
  | { kind: 'strings'; key: string; label: string; help?: string }
  | { kind: 'numbers'; key: string; label: string; help?: string; min?: number; max?: number }
  /** Fields grouped under a heading. With `key`, they edit a nested object; without, they edit the parent. */
  | { kind: 'group'; key?: string; label: string; fields: Field[] }
  /** A repeatable list of items (cards, FAQs, logos…). */
  | {
      kind: 'list'
      key: string
      label: string
      help?: string
      /** Singular noun shown on buttons: "Add question". */
      itemLabel: string
      fields: Field[]
      /** Title shown on each collapsed item. Defaults to the first text field. */
      summary?: (item: Record<string, unknown>, index: number) => string
      newItem?: () => Record<string, unknown>
      /** When set, new items get an `id` like `faq-lz3k9`. */
      idPrefix?: string
      min?: number
      max?: number
    }

export type SectionDefinition = {
  label: string
  description?: string
  fields: Field[]
  /** Props for a freshly added section. Without it, admins cannot add this section type. */
  defaults?: () => Record<string, unknown>
  /** Allow the section only once per page. */
  single?: boolean
  /** Prevent admins from deleting it (they can still hide it). */
  required?: boolean
}

export type EditorConfig = {
  /** Shown in the top bar and panel heading. */
  title?: string
  /** Logo shown in the top bar. */
  logo?: { src: string; alt: string; width?: number }
  sections: Record<string, SectionDefinition>
  settings?: { label?: string; description?: string; fields: Field[] }
  /** URL of the preview route that renders <EditablePreview>. */
  previewUrl: string
  /** Link for the "open live site" button. */
  liveUrl?: string
  /** Extra admin pages linked from the top bar, e.g. a leads inbox. */
  links?: { label: string; href: string }[]
  /** Preview widths. Defaults to desktop 1440 / tablet 820 / mobile 390. */
  devices?: { id: string; label: string; width: number; icon?: 'desktop' | 'tablet' | 'mobile' }[]
}

export type HistoryEntry = { id: string | number; createdAt: string; content: PageContent }
export type MediaItem = { url: string; name: string }

/** How the editor talks to your server. Only `saveDraft` and `publish` are required. */
export type EditorBackend = {
  saveDraft: (content: PageContent) => Promise<void>
  publish: (content: PageContent) => Promise<void>
  listHistory?: () => Promise<HistoryEntry[]>
  listMedia?: () => Promise<MediaItem[]>
  uploadMedia?: (file: File) => Promise<MediaItem>
  signOut?: () => Promise<void>
}

/** Thrown by a backend when another tab saved first. The editor asks the admin to reload. */
export class EditorConflictError extends Error {
  constructor(message = 'This page was changed somewhere else. Reload to continue.') {
    super(message)
  }
}
