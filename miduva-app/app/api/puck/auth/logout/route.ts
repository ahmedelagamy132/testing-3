import { destroyPuckAdminSession, requirePuckAdmin } from '@/lib/puck/auth'

export async function POST(request: Request) {
  const denied = await requirePuckAdmin(request)
  if (denied) return denied
  await destroyPuckAdminSession()
  return Response.json({ ok: true })
}
