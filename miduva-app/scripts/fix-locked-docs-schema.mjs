import { createClient } from '@libsql/client'

const url = process.env.DATABASE_URI ?? 'file:./payload.db'
const client = createClient({ url })

async function columnExists(table, column) {
  const res = await client.execute(`PRAGMA table_info("${table}")`)
  return res.rows.some((r) => r.name === column)
}

async function run() {
  const table = 'payload_locked_documents_rels'
  const missing = []

  for (const col of ['subscribers_id']) {
    if (!(await columnExists(table, col))) missing.push(col)
  }

  if (missing.length === 0) {
    console.log('schema already has all expected columns; nothing to do')
    return
  }

  for (const col of missing) {
    const referencedTable = col.replace(/_id$/, '')
    const sql = `ALTER TABLE "${table}" ADD COLUMN "${col}" integer REFERENCES "${referencedTable}"(id) ON DELETE CASCADE`
    console.log('applying:', sql)
    await client.execute(sql)
  }

  console.log('done')
}

run()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(() => client.close())
