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

export async function addContactSubmission({
  name,
  email,
  company,
  service,
  message,
  userAgent,
}: {
  name: string
  email: string
  company: string
  service: string
  message: string
  userAgent?: string
}) {
  const db = await getDatabase()
  const now = new Date().toISOString()

  await db.execute({
    sql: `
      INSERT INTO contact_submissions
        (name, email, company, service, message, source, user_agent, updated_at, created_at)
      VALUES (?, ?, ?, ?, ?, 'contact-form', ?, ?, ?)
    `,
    args: [name, email, company || null, service, message, userAgent ?? null, now, now],
  })
}
