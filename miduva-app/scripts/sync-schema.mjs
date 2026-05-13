import { createClient } from '@libsql/client'

const url = process.env.DATABASE_URI ?? 'file:./payload.db'
const client = createClient({ url })

const EXPECTED_TABLES = [
  {
    table: 'subscribers',
    create: `CREATE TABLE IF NOT EXISTS "subscribers" (
      "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
      "email" text NOT NULL,
      "source" text DEFAULT 'coming-soon',
      "user_agent" text,
      "updated_at" text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
      "created_at" text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
    )`,
    indexes: [
      `CREATE UNIQUE INDEX IF NOT EXISTS "subscribers_email_idx" ON "subscribers"("email")`,
      `CREATE INDEX IF NOT EXISTS "subscribers_updated_at_idx" ON "subscribers"("updated_at")`,
      `CREATE INDEX IF NOT EXISTS "subscribers_created_at_idx" ON "subscribers"("created_at")`,
    ],
  },
]

const EXPECTED = [
  {
    table: 'payload_locked_documents_rels',
    column: 'subscribers_id',
    sql: `ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "subscribers_id" integer REFERENCES "subscribers"(id) ON DELETE CASCADE`,
  },
  {
    table: 'landing_page',
    column: 'branding_logo_dark_id',
    sql: `ALTER TABLE "landing_page" ADD COLUMN "branding_logo_dark_id" integer REFERENCES "media"(id) ON DELETE SET NULL`,
  },
  {
    table: 'landing_page',
    column: 'branding_logo_light_id',
    sql: `ALTER TABLE "landing_page" ADD COLUMN "branding_logo_light_id" integer REFERENCES "media"(id) ON DELETE SET NULL`,
  },
  {
    table: 'landing_page',
    column: 'hero_illustration_dark_id',
    sql: `ALTER TABLE "landing_page" ADD COLUMN "hero_illustration_dark_id" integer REFERENCES "media"(id) ON DELETE SET NULL`,
  },
  {
    table: 'landing_page',
    column: 'hero_illustration_light_id',
    sql: `ALTER TABLE "landing_page" ADD COLUMN "hero_illustration_light_id" integer REFERENCES "media"(id) ON DELETE SET NULL`,
  },
]

async function columnExists(table, column) {
  const res = await client.execute(`PRAGMA table_info("${table}")`)
  return res.rows.some((r) => r.name === column)
}

async function tableExists(table) {
  const res = await client.execute({
    sql: `SELECT name FROM sqlite_master WHERE type='table' AND name=?`,
    args: [table],
  })
  return res.rows.length > 0
}

async function run() {
  let applied = 0

  for (const entry of EXPECTED_TABLES) {
    if (await tableExists(entry.table)) {
      console.log(`✓ table ${entry.table} present`)
      continue
    }
    console.log(`+ creating table ${entry.table}`)
    await client.execute(entry.create)
    for (const idx of entry.indexes ?? []) {
      await client.execute(idx)
    }
    applied += 1
  }

  for (const entry of EXPECTED) {
    if (await columnExists(entry.table, entry.column)) {
      console.log(`✓ ${entry.table}.${entry.column} present`)
      continue
    }
    console.log(`+ adding ${entry.table}.${entry.column}`)
    await client.execute(entry.sql)
    applied += 1
  }
  console.log(applied > 0 ? `done (${applied} change(s) applied)` : 'schema in sync')
}

run()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(() => client.close())
