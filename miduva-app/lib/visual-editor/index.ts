// Visual editor — a drop-in, framework-agnostic page editor for React apps.
// See README.md in this folder for the three-step setup.

import type { EditorConfig, Field, Option } from './types'

export { VisualEditor, type VisualEditorProps } from './editor'
export { EditablePreview } from './preview'
export { createRestBackend, type RestBackendOptions } from './rest-backend'
export { SETTINGS_SECTION } from './protocol'
export { EditorConflictError } from './types'
export type { EditorBackend, EditorConfig, Field, HistoryEntry, MediaItem, PageContent, Section, SectionDefinition } from './types'

/** Identity helper that gives you type checking and autocomplete for your config. */
export const defineEditor = (config: EditorConfig) => config

type Extra<K extends Field['kind']> = Omit<Extract<Field, { kind: K }>, 'kind' | 'key' | 'label'>

/** Short-hands for building field lists: `field.text('title', 'Title')`. */
export const field = {
  text: (key: string, label: string, extra: Extra<'text'> = {}): Field => ({ kind: 'text', key, label, ...extra }),
  textarea: (key: string, label: string, extra: Extra<'textarea'> = {}): Field => ({ kind: 'textarea', key, label, ...extra }),
  number: (key: string, label: string, extra: Extra<'number'> = {}): Field => ({ kind: 'number', key, label, ...extra }),
  toggle: (key: string, label: string, extra: Extra<'toggle'> = {}): Field => ({ kind: 'toggle', key, label, ...extra }),
  select: (key: string, label: string, options: (Option | string)[], extra: Omit<Extra<'select'>, 'options'> = {}): Field => ({
    kind: 'select', key, label, ...extra,
    options: options.map((option) => (typeof option === 'string' ? { label: option[0].toUpperCase() + option.slice(1), value: option } : option)),
  }),
  image: (key: string, label: string, extra: Extra<'image'> = {}): Field => ({ kind: 'image', key, label, ...extra }),
  link: (key: string, label: string, extra: Extra<'link'> = {}): Field => ({ kind: 'link', key, label, ...extra }),
  strings: (key: string, label: string, extra: Extra<'strings'> = {}): Field => ({ kind: 'strings', key, label, ...extra }),
  numbers: (key: string, label: string, extra: Extra<'numbers'> = {}): Field => ({ kind: 'numbers', key, label, ...extra }),
  group: (label: string, fields: Field[], key?: string): Field => ({ kind: 'group', key, label, fields }),
  list: (key: string, label: string, itemLabel: string, fields: Field[], extra: Omit<Extra<'list'>, 'itemLabel' | 'fields'> = {}): Field => ({
    kind: 'list', key, label, itemLabel, fields, ...extra,
  }),
}
