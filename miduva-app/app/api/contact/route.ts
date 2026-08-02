import { NextResponse } from 'next/server'
import { addContactSubmission } from '@/lib/submissions'
import { deliverContactSubmission } from '@/lib/contact-delivery'

export const dynamic = 'force-dynamic'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type ContactBody = {
  name?: unknown
  email?: unknown
  company?: unknown
  service?: unknown
  message?: unknown
}

type Status = 'submitted' | 'invalid' | 'error'

function cleanText(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

export async function POST(request: Request) {
  let body: ContactBody

  try {
    body = (await request.json()) as ContactBody
  } catch {
    return NextResponse.json<{ status: Status }>({ status: 'invalid' }, { status: 400 })
  }

  const name = cleanText(body.name, 160)
  const email = cleanText(body.email, 254).toLowerCase()
  const company = cleanText(body.company, 160)
  const service = cleanText(body.service, 120)
  const message = cleanText(body.message, 4000)

  if (
    !name ||
    !email ||
    !EMAIL_RE.test(email) ||
    !service ||
    !message ||
    message.length < 20
  ) {
    return NextResponse.json<{ status: Status }>({ status: 'invalid' }, { status: 400 })
  }

  const userAgent = request.headers.get('user-agent')?.slice(0, 500) ?? undefined
  const submittedAt = new Date().toISOString()

  try {
    await addContactSubmission({
      name,
      email,
      company,
      service,
      message,
      userAgent,
    })

    const delivery = await deliverContactSubmission({
      name,
      email,
      company,
      service,
      message,
      userAgent,
      submittedAt,
    })

    if (!delivery.configured) {
      console.warn(
        '[api/contact] submission stored, but no notification channel is configured',
      )
    } else if (!delivery.delivered) {
      console.error(
        '[api/contact] submission stored, but every notification channel failed',
      )
    }

    return NextResponse.json<{ status: Status }>({ status: 'submitted' })
  } catch (err) {
    console.error('[api/contact] failed:', err)
    return NextResponse.json<{ status: Status }>({ status: 'error' }, { status: 500 })
  }
}
