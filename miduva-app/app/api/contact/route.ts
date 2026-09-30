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
  // Hero lead modals ("RFP" / "Let's talk!") send these instead of a message.
  form?: unknown
  website?: unknown
  budget?: unknown
  phone?: unknown
}

const LEAD_FORMS: Record<string, string> = {
  rfp: 'Request for Proposal',
  talk: "Let's talk",
}

type Status = 'submitted' | 'invalid' | 'error'

/** The page the form was sent from (same-origin Referer), e.g. "/" or "/blog/some-post". */
function pagePath(request: Request) {
  const referer = request.headers.get('referer')
  if (!referer) return undefined
  try {
    return new URL(referer).pathname.slice(0, 200)
  } catch {
    return undefined
  }
}

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
  const company = cleanText(body.company, 160) || cleanText(body.website, 160)
  const leadForm = typeof body.form === 'string' ? LEAD_FORMS[body.form] : undefined
  const website = cleanText(body.website, 200)
  const budget = cleanText(body.budget, 60)
  const phone = cleanText(body.phone, 40)
  const service = leadForm ?? cleanText(body.service, 120)
  const formType = body.form === 'rfp' || body.form === 'talk' ? body.form : 'contact'
  const page = pagePath(request)
  const message = leadForm
    ? [
        `${leadForm} request from ${page ?? 'the website'}.`,
        `Website: ${website || '—'}`,
        `Monthly marketing budget: ${budget || '—'}`,
        `Phone: ${phone || '—'}`,
      ].join('\n')
    : cleanText(body.message, 4000)

  if (
    !name ||
    !email ||
    !EMAIL_RE.test(email) ||
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
      phone,
      website,
      budget,
      formType,
      page,
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
