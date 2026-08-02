import { revalidatePath } from 'next/cache'
import { requirePuckAdmin } from '@/lib/puck/auth'
import { getPageDocument, publishPage, PuckVersionConflictError, saveDraft } from '@/lib/puck/storage'
import { validateLandingPageData } from '@/lib/puck/validation'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const denied = await requirePuckAdmin()
  if (denied) return denied
  return Response.json(await getPageDocument(), { headers: { 'Cache-Control': 'no-store' } })
}

async function readPayload(request: Request) {
  if (Number(request.headers.get('content-length') ?? 0) > 1_100_000) return { error: 'Document exceeds the 1 MB limit.' } as const
  try {
    const body = await request.json()
    if (!body || typeof body.version !== 'number') return { error: 'A document version is required.' } as const
    const validated = validateLandingPageData(body.data)
    if (!validated.ok) return { error: validated.error } as const
    return { data: validated.data, version: body.version } as const
  } catch {
    return { error: 'Invalid JSON request.' } as const
  }
}

export async function PUT(request: Request) {
  const denied = await requirePuckAdmin(request)
  if (denied) return denied
  const payload = await readPayload(request)
  if ('error' in payload) return Response.json({ error: payload.error }, { status: 400 })
  try {
    return Response.json(await saveDraft(payload.data, payload.version))
  } catch (error) {
    if (error instanceof PuckVersionConflictError) return Response.json({ error: error.message }, { status: 409 })
    throw error
  }
}

export async function POST(request: Request) {
  const denied = await requirePuckAdmin(request)
  if (denied) return denied
  const payload = await readPayload(request)
  if ('error' in payload) return Response.json({ error: payload.error }, { status: 400 })
  try {
    const document = await publishPage(payload.data, payload.version)
    revalidatePath('/')
    revalidatePath('/main-site')
    return Response.json(document)
  } catch (error) {
    if (error instanceof PuckVersionConflictError) return Response.json({ error: error.message }, { status: 409 })
    throw error
  }
}
