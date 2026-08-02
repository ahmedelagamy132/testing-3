import { requirePuckAdmin } from '@/lib/puck/auth'
import { listRevisions, PuckVersionConflictError, restoreRevisionToDraft } from '@/lib/puck/storage'
import { validateLandingPageData } from '@/lib/puck/validation'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const denied = await requirePuckAdmin()
  if (denied) return denied
  return Response.json(await listRevisions(), { headers: { 'Cache-Control': 'no-store' } })
}

export async function POST(request: Request) {
  const denied = await requirePuckAdmin(request)
  if (denied) return denied
  let body: { id?: unknown; version?: unknown }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON request.' }, { status: 400 })
  }
  if (!Number.isInteger(body.id) || typeof body.version !== 'number') {
    return Response.json({ error: 'A valid revision and document version are required.' }, { status: 400 })
  }
  try {
    const document = await restoreRevisionToDraft(Number(body.id), body.version)
    const validated = validateLandingPageData(document.draft)
    if (!validated.ok) return Response.json({ error: validated.error }, { status: 422 })
    return Response.json(document)
  } catch (error) {
    if (error instanceof PuckVersionConflictError) return Response.json({ error: error.message }, { status: 409 })
    if (error instanceof Error && error.message === 'Revision not found') return Response.json({ error: error.message }, { status: 404 })
    throw error
  }
}
