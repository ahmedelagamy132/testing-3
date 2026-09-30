import { createClient, type Client } from '@libsql/client'

const databaseUrl =
  process.env.MIDUVA_DATABASE_URI ??
  process.env.DATABASE_URI ??
  'file:./miduva.db'

let client: Client | null = null
let schemaReady: Promise<Client> | null = null

function getClient() {
  if (!client) {
    client = createClient({ url: databaseUrl })
  }
  return client
}

async function getDatabase() {
  if (!schemaReady) {
    schemaReady = (async () => {
      const db = getClient()

      await db.execute(`
        CREATE TABLE IF NOT EXISTS subscribers (
          id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
          email TEXT NOT NULL,
          source TEXT NOT NULL DEFAULT 'coming-soon',
          user_agent TEXT,
          updated_at TEXT NOT NULL,
          created_at TEXT NOT NULL
        )
      `)
      await db.execute(`
        CREATE UNIQUE INDEX IF NOT EXISTS subscribers_email_idx
        ON subscribers(email)
      `)
      await db.execute(`
        CREATE TABLE IF NOT EXISTS contact_submissions (
          id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          company TEXT,
          service TEXT NOT NULL,
          message TEXT NOT NULL,
          source TEXT NOT NULL DEFAULT 'contact-form',
          user_agent TEXT,
          updated_at TEXT NOT NULL,
          created_at TEXT NOT NULL
        )
      `)
      await db.execute(`
        CREATE INDEX IF NOT EXISTS contact_submissions_email_idx
        ON contact_submissions(email)
      `)

      // Lead-management columns, added in place so existing rows are kept.
      const columns = new Set(
        (await db.execute('PRAGMA table_info(contact_submissions)')).rows.map((row) => String(row.name)),
      )
      const added: [string, string][] = [
        ['phone', 'TEXT'],
        ['website', 'TEXT'],
        ['budget', 'TEXT'],
        ['form_type', "TEXT NOT NULL DEFAULT 'contact'"],
        ['page', 'TEXT'],
        ['status', "TEXT NOT NULL DEFAULT 'new'"],
        ['notes', "TEXT NOT NULL DEFAULT ''"],
      ]
      for (const [name, type] of added) {
        if (!columns.has(name)) await db.execute(`ALTER TABLE contact_submissions ADD COLUMN ${name} ${type}`)
      }
      await db.execute(`
        CREATE INDEX IF NOT EXISTS contact_submissions_created_idx
        ON contact_submissions(created_at)
      `)

      return db
    })()
  }

  return schemaReady
}

export async function addSubscriber({
  email,
  userAgent,
}: {
  email: string
  userAgent?: string
}) {
  const db = await getDatabase()
  const now = new Date().toISOString()

  const result = await db.execute({
    sql: `
      INSERT OR IGNORE INTO subscribers
        (email, source, user_agent, updated_at, created_at)
      VALUES (?, 'coming-soon', ?, ?, ?)
    `,
    args: [email, userAgent ?? null, now, now],
  })

  return result.rowsAffected > 0
}

export type LeadFormType = 'contact' | 'rfp' | 'talk'
export const LEAD_STATUSES = ['new', 'contacted', 'qualified', 'won', 'lost'] as const
export type LeadStatus = (typeof LEAD_STATUSES)[number]

export function isLeadStatus(value: unknown): value is LeadStatus {
  return typeof value === 'string' && (LEAD_STATUSES as readonly string[]).includes(value)
}

export async function addContactSubmission({
  name,
  email,
  company,
  service,
  message,
  phone,
  website,
  budget,
  formType = 'contact',
  page,
  userAgent,
}: {
  name: string
  email: string
  company: string
  service: string
  message: string
  phone?: string
  website?: string
  budget?: string
  formType?: LeadFormType
  page?: string
  userAgent?: string
}) {
  const db = await getDatabase()
  const now = new Date().toISOString()

  await db.execute({
    sql: `
      INSERT INTO contact_submissions
        (name, email, company, service, message, source, phone, website, budget, form_type, page, user_agent, updated_at, created_at)
      VALUES (?, ?, ?, ?, ?, 'contact-form', ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    args: [
      name, email, company || null, service, message,
      phone || null, website || null, budget || null, formType, page || null,
      userAgent ?? null, now, now,
    ],
  })
}

/* ─── Admin: lead management ─── */

export type Lead = {
  id: number
  name: string
  email: string
  company: string | null
  service: string
  message: string
  phone: string | null
  website: string | null
  budget: string | null
  formType: LeadFormType
  page: string | null
  status: LeadStatus
  notes: string
  createdAt: string
  updatedAt: string
}

function toLead(row: Record<string, unknown>): Lead {
  const text = (value: unknown) => (value === null || value === undefined ? null : String(value))
  const formType = String(row.form_type)
  const status = String(row.status)
  return {
    id: Number(row.id),
    name: String(row.name),
    email: String(row.email),
    company: text(row.company),
    service: String(row.service ?? ''),
    message: String(row.message ?? ''),
    phone: text(row.phone),
    website: text(row.website),
    budget: text(row.budget),
    formType: formType === 'rfp' || formType === 'talk' ? formType : 'contact',
    page: text(row.page),
    status: isLeadStatus(status) ? status : 'new',
    notes: String(row.notes ?? ''),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  }
}

export type LeadFilters = { status?: LeadStatus; formType?: LeadFormType; search?: string }

function whereClause({ status, formType, search }: LeadFilters) {
  const clauses: string[] = []
  const args: string[] = []
  if (status) { clauses.push('status = ?'); args.push(status) }
  if (formType) { clauses.push('form_type = ?'); args.push(formType) }
  if (search) {
    clauses.push("(name LIKE ? ESCAPE '\\' OR email LIKE ? ESCAPE '\\' OR IFNULL(company, '') LIKE ? ESCAPE '\\' OR IFNULL(phone, '') LIKE ? ESCAPE '\\' OR IFNULL(website, '') LIKE ? ESCAPE '\\')")
    const like = `%${search.replace(/[\\%_]/g, (c) => `\\${c}`)}%`
    args.push(like, like, like, like, like)
  }
  return { sql: clauses.length ? `WHERE ${clauses.join(' AND ')}` : '', args }
}

export async function listLeads(filters: LeadFilters = {}, limit = 500): Promise<Lead[]> {
  const db = await getDatabase()
  const where = whereClause(filters)
  const result = await db.execute({
    sql: `SELECT * FROM contact_submissions ${where.sql} ORDER BY created_at DESC LIMIT ?`,
    args: [...where.args, limit],
  })
  return result.rows.map((row) => toLead(row as unknown as Record<string, unknown>))
}

export async function getLeadStats() {
  const db = await getDatabase()
  const weekAgo = new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString()
  const result = await db.execute({
    sql: `SELECT status, COUNT(*) AS n, SUM(CASE WHEN created_at >= ? THEN 1 ELSE 0 END) AS week
          FROM contact_submissions GROUP BY status`,
    args: [weekAgo],
  })
  const byStatus = Object.fromEntries(LEAD_STATUSES.map((s) => [s, 0])) as Record<LeadStatus, number>
  let total = 0
  let thisWeek = 0
  for (const row of result.rows) {
    const status = String(row.status)
    const n = Number(row.n)
    if (isLeadStatus(status)) byStatus[status] = n
    total += n
    thisWeek += Number(row.week ?? 0)
  }
  return { total, thisWeek, byStatus }
}

export async function updateLead(id: number, changes: { status?: LeadStatus; notes?: string }) {
  const db = await getDatabase()
  const sets: string[] = []
  const args: (string | number)[] = []
  if (changes.status) { sets.push('status = ?'); args.push(changes.status) }
  if (changes.notes !== undefined) { sets.push('notes = ?'); args.push(changes.notes) }
  if (!sets.length) return false
  sets.push('updated_at = ?')
  args.push(new Date().toISOString(), id)
  const result = await db.execute({ sql: `UPDATE contact_submissions SET ${sets.join(', ')} WHERE id = ?`, args })
  return result.rowsAffected > 0
}

export async function deleteLead(id: number) {
  const db = await getDatabase()
  const result = await db.execute({ sql: 'DELETE FROM contact_submissions WHERE id = ?', args: [id] })
  return result.rowsAffected > 0
}
