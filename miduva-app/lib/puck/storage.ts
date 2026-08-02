import 'server-only'

import { createClient, type Client } from '@libsql/client'
import { mkdir, readdir, stat } from 'node:fs/promises'
import path from 'node:path'
import { getDefaultLandingPageData } from './defaults'
import type { LandingPagePuckData, PuckMedia, PuckPageDocument, PuckRevision } from './types'

const PAGE_SLUG = 'landing-page'
const databaseUrl = process.env.MIDUVA_DATABASE_URI ?? process.env.DATABASE_URI ?? 'file:./miduva.db'
export const puckMediaDirectory = process.env.PUCK_MEDIA_DIR ?? (process.env.NODE_ENV === 'production' ? '/data/puck-media' : path.join(/*turbopackIgnore: true*/ process.cwd(), '.puck-media'))

let client: Client | null = null
let schemaReady: Promise<Client> | null = null

export class PuckVersionConflictError extends Error {
  constructor() {
    super('This draft changed in another tab. Reload before saving again.')
  }
}

function getClient() {
  if (!client) client = createClient({ url: databaseUrl })
  return client
}

async function getDatabase() {
  if (!schemaReady) {
    schemaReady = (async () => {
      const db = getClient()
      await db.execute(`
        CREATE TABLE IF NOT EXISTS puck_pages (
          slug TEXT PRIMARY KEY NOT NULL,
          draft_json TEXT NOT NULL,
          published_json TEXT NOT NULL,
          version INTEGER NOT NULL DEFAULT 0,
          draft_updated_at TEXT,
          published_at TEXT
        )
      `)
      await db.execute(`
        CREATE TABLE IF NOT EXISTS puck_revisions (
          id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
          slug TEXT NOT NULL,
          data_json TEXT NOT NULL,
          created_at TEXT NOT NULL
        )
      `)
      await db.execute(`CREATE INDEX IF NOT EXISTS puck_revisions_slug_idx ON puck_revisions(slug, id DESC)`)
      await db.execute(`
        CREATE TABLE IF NOT EXISTS puck_media (
          id TEXT PRIMARY KEY NOT NULL,
          file_name TEXT NOT NULL,
          original_name TEXT NOT NULL,
          mime_type TEXT NOT NULL,
          width INTEGER NOT NULL,
          height INTEGER NOT NULL,
          size INTEGER NOT NULL,
          created_at TEXT NOT NULL
        )
      `)
      await mkdir(puckMediaDirectory, { recursive: true })
      return db
    })()
  }
  return schemaReady
}

function parseData(value: unknown): LandingPagePuckData {
  return JSON.parse(String(value)) as LandingPagePuckData
}

export async function getPageDocument(): Promise<PuckPageDocument> {
  const db = await getDatabase()
  const result = await db.execute({ sql: 'SELECT * FROM puck_pages WHERE slug = ?', args: [PAGE_SLUG] })
  const row = result.rows[0]
  if (!row) {
    const defaults = getDefaultLandingPageData()
    return { draft: defaults, published: structuredClone(defaults), version: 0, draftUpdatedAt: null, publishedAt: null }
  }
  return {
    draft: parseData(row.draft_json),
    published: parseData(row.published_json),
    version: Number(row.version),
    draftUpdatedAt: row.draft_updated_at ? String(row.draft_updated_at) : null,
    publishedAt: row.published_at ? String(row.published_at) : null,
  }
}

export async function getPublishedLandingPageData() {
  return (await getPageDocument()).published
}

export async function saveDraft(data: LandingPagePuckData, expectedVersion: number): Promise<PuckPageDocument> {
  const db = await getDatabase()
  const transaction = await db.transaction('write')
  const now = new Date().toISOString()
  try {
    const current = await transaction.execute({ sql: 'SELECT version FROM puck_pages WHERE slug = ?', args: [PAGE_SLUG] })
    const row = current.rows[0]
    if (!row) {
      if (expectedVersion !== 0) throw new PuckVersionConflictError()
      const defaults = getDefaultLandingPageData()
      await transaction.execute({
        sql: 'INSERT INTO puck_pages (slug, draft_json, published_json, version, draft_updated_at) VALUES (?, ?, ?, 1, ?)',
        args: [PAGE_SLUG, JSON.stringify(data), JSON.stringify(defaults), now],
      })
    } else {
      if (Number(row.version) !== expectedVersion) throw new PuckVersionConflictError()
      const result = await transaction.execute({
        sql: 'UPDATE puck_pages SET draft_json = ?, version = version + 1, draft_updated_at = ? WHERE slug = ? AND version = ?',
        args: [JSON.stringify(data), now, PAGE_SLUG, expectedVersion],
      })
      if (result.rowsAffected !== 1) throw new PuckVersionConflictError()
    }
    await transaction.commit()
  } finally {
    transaction.close()
  }
  return getPageDocument()
}

export async function publishPage(data: LandingPagePuckData, expectedVersion: number): Promise<PuckPageDocument> {
  const db = await getDatabase()
  const transaction = await db.transaction('write')
  const now = new Date().toISOString()
  try {
    const current = await transaction.execute({ sql: 'SELECT version, published_json FROM puck_pages WHERE slug = ?', args: [PAGE_SLUG] })
    const row = current.rows[0]
    if (!row) {
      if (expectedVersion !== 0) throw new PuckVersionConflictError()
      await transaction.execute({
        sql: 'INSERT INTO puck_revisions (slug, data_json, created_at) VALUES (?, ?, ?)',
        args: [PAGE_SLUG, JSON.stringify(getDefaultLandingPageData()), now],
      })
      await transaction.execute({
        sql: 'INSERT INTO puck_pages (slug, draft_json, published_json, version, draft_updated_at, published_at) VALUES (?, ?, ?, 1, ?, ?)',
        args: [PAGE_SLUG, JSON.stringify(data), JSON.stringify(data), now, now],
      })
    } else {
      if (Number(row.version) !== expectedVersion) throw new PuckVersionConflictError()
      await transaction.execute({
        sql: 'INSERT INTO puck_revisions (slug, data_json, created_at) VALUES (?, ?, ?)',
        args: [PAGE_SLUG, String(row.published_json), now],
      })
      const result = await transaction.execute({
        sql: 'UPDATE puck_pages SET draft_json = ?, published_json = ?, version = version + 1, draft_updated_at = ?, published_at = ? WHERE slug = ? AND version = ?',
        args: [JSON.stringify(data), JSON.stringify(data), now, now, PAGE_SLUG, expectedVersion],
      })
      if (result.rowsAffected !== 1) throw new PuckVersionConflictError()
    }
    await transaction.execute({
      sql: 'DELETE FROM puck_revisions WHERE slug = ? AND id NOT IN (SELECT id FROM puck_revisions WHERE slug = ? ORDER BY id DESC LIMIT 20)',
      args: [PAGE_SLUG, PAGE_SLUG],
    })
    await transaction.commit()
  } finally {
    transaction.close()
  }
  return getPageDocument()
}

export async function listRevisions(): Promise<PuckRevision[]> {
  const db = await getDatabase()
  const result = await db.execute({ sql: 'SELECT id, data_json, created_at FROM puck_revisions WHERE slug = ? ORDER BY id DESC LIMIT 20', args: [PAGE_SLUG] })
  return result.rows.map((row) => ({ id: Number(row.id), createdAt: String(row.created_at), data: parseData(row.data_json) }))
}

export async function restoreRevisionToDraft(id: number, expectedVersion: number) {
  const db = await getDatabase()
  const result = await db.execute({ sql: 'SELECT data_json FROM puck_revisions WHERE slug = ? AND id = ?', args: [PAGE_SLUG, id] })
  const row = result.rows[0]
  if (!row) throw new Error('Revision not found')
  return saveDraft(parseData(row.data_json), expectedVersion)
}

export async function addMedia(media: Omit<PuckMedia, 'url' | 'source'> & { fileName: string }) {
  const db = await getDatabase()
  await db.execute({
    sql: 'INSERT INTO puck_media (id, file_name, original_name, mime_type, width, height, size, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    args: [media.id, media.fileName, media.originalName, media.mimeType, media.width, media.height, media.size, media.createdAt],
  })
  return { ...media, url: `/media/${media.id}`, source: 'upload' as const }
}

export async function getMediaFile(id: string) {
  const db = await getDatabase()
  const result = await db.execute({ sql: 'SELECT * FROM puck_media WHERE id = ?', args: [id] })
  const row = result.rows[0]
  if (!row) return null
  return {
    filePath: path.join(/*turbopackIgnore: true*/ puckMediaDirectory, String(row.file_name)),
    mimeType: String(row.mime_type),
    originalName: String(row.original_name),
  }
}

async function listStaticMedia(): Promise<PuckMedia[]> {
  const publicDirectory = path.join(/*turbopackIgnore: true*/ process.cwd(), 'public')
  const entries = await readdir(publicDirectory, { recursive: true })
  const allowed = /\.(?:jpe?g|png|webp)$/i
  const items: PuckMedia[] = []
  for (const entry of entries) {
    if (!allowed.test(entry)) continue
    const absolutePath = path.join(/*turbopackIgnore: true*/ publicDirectory, entry)
    const relativePath = entry.split(path.sep).join('/')
    const fileStat = await stat(absolutePath)
    if (!fileStat.isFile()) continue
    items.push({
      id: `static:${relativePath}`,
      url: `/${relativePath}`,
      originalName: path.basename(entry),
      mimeType: entry.toLowerCase().endsWith('.png') ? 'image/png' : entry.toLowerCase().endsWith('.webp') ? 'image/webp' : 'image/jpeg',
      width: 0,
      height: 0,
      size: fileStat.size,
      createdAt: fileStat.mtime.toISOString(),
      source: 'static',
    })
  }
  return items.sort((a, b) => a.url.localeCompare(b.url))
}

export async function listMedia(): Promise<PuckMedia[]> {
  const db = await getDatabase()
  const result = await db.execute('SELECT * FROM puck_media ORDER BY created_at DESC')
  const uploaded: PuckMedia[] = result.rows.map((row) => ({
    id: String(row.id),
    url: `/media/${String(row.id)}`,
    originalName: String(row.original_name),
    mimeType: String(row.mime_type),
    width: Number(row.width),
    height: Number(row.height),
    size: Number(row.size),
    createdAt: String(row.created_at),
    source: 'upload',
  }))
  return [...uploaded, ...(await listStaticMedia())]
}
