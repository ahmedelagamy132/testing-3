import { NextResponse } from 'next/server'
import { getPayload } from '@/payload/utils/get-payload'

export const dynamic = 'force-dynamic'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type Status = 'subscribed' | 'already' | 'invalid' | 'error'

export async function POST(request: Request) {
  let email = ''
  try {
    const body = (await request.json()) as { email?: unknown }
    email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''
  } catch {
    return NextResponse.json<{ status: Status }>({ status: 'invalid' }, { status: 400 })
  }

  if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
    return NextResponse.json<{ status: Status }>({ status: 'invalid' }, { status: 400 })
  }

  const userAgent = request.headers.get('user-agent')?.slice(0, 500) ?? undefined

  try {
    const payload = await getPayload()

    const existing = await payload.find({
      collection: 'subscribers',
      where: { email: { equals: email } },
      limit: 1,
      depth: 0,
    })

    if (existing.docs.length > 0) {
      return NextResponse.json<{ status: Status }>({ status: 'already' })
    }

    await payload.create({
      collection: 'subscribers',
      data: {
        email,
        source: 'coming-soon',
        userAgent,
      },
    })

    return NextResponse.json<{ status: Status }>({ status: 'subscribed' })
  } catch (err) {
    const message = err instanceof Error ? err.message : ''
    if (/unique/i.test(message)) {
      return NextResponse.json<{ status: Status }>({ status: 'already' })
    }
    console.error('[api/subscribe] failed:', err)
    return NextResponse.json<{ status: Status }>({ status: 'error' }, { status: 500 })
  }
}
