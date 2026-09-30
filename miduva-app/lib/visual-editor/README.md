# Visual editor

A drop-in page editor for React apps. Admins get a form panel next to a live preview of the
**real** page; clicking anything in the preview opens the field that controls it. Drafts
autosave, nothing goes live until **Publish**, and every publish is kept in history.

The folder depends only on React. Copy `lib/visual-editor/` into any React app
(Next.js, Vite, Remix…) and wire it up in three steps.

## 1. Describe your sections

A page is `{ settings, sections: [{ id, type, hidden?, props }] }`. For each section type,
list the fields admins may change. Keys match the props your component already takes.

```ts
import { defineEditor, field } from './visual-editor'

export const editorConfig = defineEditor({
  title: 'Home page',
  previewUrl: '/admin/preview',
  liveUrl: '/',
  sections: {
    Hero: {
      label: 'Hero',
      description: 'First screen',
      required: true,
      fields: [
        field.text('title', 'Headline'),
        field.textarea('subtitle', 'Intro text'),
        field.link('cta', 'Button'),
        field.image('image', 'Picture'),
      ],
    },
    Faq: {
      label: 'FAQ',
      defaults: () => ({ title: 'Questions', items: [] }), // makes it addable from "Add a section"
      fields: [
        field.text('title', 'Heading'),
        field.list('items', 'Questions', 'question', [
          field.text('question', 'Question'),
          field.textarea('answer', 'Answer'),
        ], { idPrefix: 'faq', max: 20 }),
      ],
    },
  },
  settings: { fields: [field.group('Search & sharing', [field.text('title', 'Page title')], 'seo')] },
})
```

Field kinds: `text`, `textarea`, `number`, `toggle`, `select`, `image`, `link` (`{ label, href }`),
`strings` (list of lines), `numbers`, `group` (nested object or visual grouping) and `list`
(repeatable items with add, delete and reorder; `min === max` fixes the count).

## 2. Mark up your page (optional, but it enables click-to-edit)

Render the page from the content, and add data attributes:

```tsx
export function Page({ content }: { content: PageContent }) {
  return content.sections.filter((s) => !s.hidden).map((s) => (
    <div key={s.id} data-edit-section={s.id}>{renderSection(s)}</div>
  ))
}

// Inside a section component:
<h1 data-edit-path="title">{props.title}</h1>
<p data-edit-path={`items.${i}.answer`}>{item.answer}</p>
```

Elements without `data-edit-path` still work: the editor matches their visible text or image
against the section's values. Page-wide content (like a nav) uses
`data-edit-section="@settings" data-edit-scope="nav"`, and paths are then read inside `settings.nav`.

## 3. Add two admin routes

**Preview route** (`previewUrl`). It renders your real page, fed with live drafts:

```tsx
'use client'
import { EditablePreview } from './visual-editor'
export default function Preview({ draft }) {
  return <EditablePreview initialContent={draft}>{(content) => <Page content={content} />}</EditablePreview>
}
```

**Editor route**. The config holds functions, so render the editor from a client component:

```tsx
'use client'
import './visual-editor/visual-editor.css'
import { VisualEditor, createRestBackend } from './visual-editor'

export function Admin({ draft, published, version }) {
  const backend = useMemo(() => createRestBackend({ pageUrl: '/api/page', initialVersion: version, mediaUrl: '/api/media' }), [version])
  return <VisualEditor config={editorConfig} backend={backend} initialContent={draft} publishedContent={published} />
}
```

Protect both routes with your app's admin auth.

### Backend

`createRestBackend` expects:

| Call | Request | Response |
| --- | --- | --- |
| save draft | `PUT pageUrl` `{ data, version }` | `{ version }`, or `409` if another tab saved first |
| publish | `POST pageUrl` `{ data, version }` | `{ version }` |
| history (optional) | `GET historyUrl` | `[{ id, createdAt, data }]` |
| media (optional) | `GET mediaUrl` / `POST` multipart `file` | `{ media: [{ url, name }] }` / `{ media: { url, name } }` |

If your storage uses a different shape, pass `serialize` and `deserialize`. If your API is
different altogether, implement `EditorBackend` yourself: only `saveDraft` and `publish` are required.

### Theming

Override the `--ve-*` CSS variables on `.ve-shell, .ve-modal` (font, colours, accent).

## Reference integration

Miduva's own setup lives in `lib/site-editor/schema.ts` (sections), `components/site-editor/`
(editor and preview wrappers) and `app/(puck)/admin/` (routes).
