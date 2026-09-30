import type { EditorBackend, HistoryEntry, MediaItem, PageContent } from './types'
import { EditorConflictError } from './types'

export type RestBackendOptions = {
  /** PUT saves the draft, POST publishes. Body: `{ data, version }`. Response: `{ version }`. 409 = conflict. */
  pageUrl: string
  /** Version of the draft the editor opened with (optimistic locking). Use 0 if your server doesn't track it. */
  initialVersion?: number
  /** GET → `[{ id, createdAt, data }]`. */
  historyUrl?: string
  /** GET → `{ media: [{ url, name }] }`, POST multipart `file` → `{ media: { url, name } }`. */
  mediaUrl?: string
  /** POSTed on sign-out, then the browser goes to `signInUrl`. */
  signOutUrl?: string
  signInUrl?: string
  /** Convert between the editor's content and what your server stores. Identity by default. */
  serialize?: (content: PageContent) => unknown
  deserialize?: (data: unknown) => PageContent
}

type RawMedia = { url: string; name?: string; originalName?: string }
const toMedia = (item: RawMedia): MediaItem => ({ url: item.url, name: item.name ?? item.originalName ?? item.url.split('/').pop() ?? item.url })

async function readJson<T>(response: Response): Promise<T> {
  const body = (await response.json().catch(() => ({}))) as T & { error?: string }
  if (response.status === 409) throw new EditorConflictError(body.error)
  if (!response.ok) throw new Error(body.error || `Request failed (${response.status})`)
  return body
}

/** A ready-made backend for a JSON API. Write your own `EditorBackend` if your server looks different. */
export function createRestBackend(options: RestBackendOptions): EditorBackend {
  let version = options.initialVersion ?? 0
  const serialize = options.serialize ?? ((content: PageContent) => content)
  const deserialize = options.deserialize ?? ((data: unknown) => data as PageContent)

  const send = async (method: 'PUT' | 'POST', content: PageContent) => {
    const result = await readJson<{ version?: number }>(await fetch(options.pageUrl, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: serialize(content), version }),
    }))
    if (typeof result.version === 'number') version = result.version
  }

  const backend: EditorBackend = {
    saveDraft: (content) => send('PUT', content),
    publish: (content) => send('POST', content),
  }

  if (options.historyUrl) {
    const url = options.historyUrl
    backend.listHistory = async () => {
      const rows = await readJson<{ id: string | number; createdAt: string; data: unknown }[]>(await fetch(url, { cache: 'no-store' }))
      return rows.map((row): HistoryEntry => ({ id: row.id, createdAt: row.createdAt, content: deserialize(row.data) }))
    }
  }

  if (options.mediaUrl) {
    const url = options.mediaUrl
    backend.listMedia = async () => (await readJson<{ media: RawMedia[] }>(await fetch(url, { cache: 'no-store' }))).media.map(toMedia)
    backend.uploadMedia = async (file) => {
      const form = new FormData()
      form.set('file', file)
      return toMedia((await readJson<{ media: RawMedia }>(await fetch(url, { method: 'POST', body: form }))).media)
    }
  }

  if (options.signOutUrl) {
    const url = options.signOutUrl
    backend.signOut = async () => {
      await fetch(url, { method: 'POST' })
      window.location.assign(options.signInUrl ?? '/')
    }
  }

  return backend
}
