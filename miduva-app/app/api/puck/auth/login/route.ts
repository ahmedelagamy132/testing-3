import { createPuckAdminSession, hasValidMutationOrigin, isPuckAdminConfigured, verifyPuckAdminPassword } from '@/lib/puck/auth'

export const runtime = 'nodejs'

const attempts = new Map<string, { count: number; resetAt: number }>()
const WINDOW_MS = 15 * 60 * 1000
const MAX_ATTEMPTS = 8

function clientKey(request: Request) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local'
}

export async function POST(request: Request) {
  if (!isPuckAdminConfigured()) {
    return Response.json({ error: 'Puck admin is not configured.' }, { status: 503 })
  }
  if (!(await hasValidMutationOrigin(request))) {
    return Response.json({ error: 'Invalid request origin.' }, { status: 403 })
  }
  if (Number(request.headers.get('content-length') ?? 0) > 4096) {
    return Response.json({ error: 'Invalid request.' }, { status: 413 })
  }

  const key = clientKey(request)
  const now = Date.now()
  const current = attempts.get(key)
  if (current && current.resetAt > now && current.count >= MAX_ATTEMPTS) {
    return Response.json({ error: 'Too many login attempts. Try again later.' }, { status: 429 })
  }

  let password: unknown
  try {
    password = (await request.json()).password
  } catch {
    return Response.json({ error: 'Invalid request.' }, { status: 400 })
  }

  if (!verifyPuckAdminPassword(password)) {
    const next = !current || current.resetAt <= now ? { count: 1, resetAt: now + WINDOW_MS } : { ...current, count: current.count + 1 }
    attempts.set(key, next)
    return Response.json({ error: 'Incorrect password.' }, { status: 401 })
  }

  attempts.delete(key)
  await createPuckAdminSession()
  return Response.json({ ok: true })
}
