type ContactSubmission = {
  name: string
  email: string
  company: string
  service: string
  message: string
  userAgent?: string
  submittedAt: string
}

type DeliveryResult = {
  configured: boolean
  delivered: boolean
}

const RESEND_ENDPOINT = 'https://api.resend.com/emails'

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function getRecipients() {
  return (process.env.CONTACT_NOTIFICATION_EMAIL ?? 'hello@miduva.com')
    .split(',')
    .map((email) => email.trim())
    .filter(Boolean)
}

function buildPlainText(submission: ContactSubmission) {
  return [
    'New Miduva website enquiry',
    '',
    `Name: ${submission.name}`,
    `Email: ${submission.email}`,
    `Company: ${submission.company || 'Not provided'}`,
    `Service: ${submission.service}`,
    `Submitted: ${submission.submittedAt}`,
    '',
    'Message:',
    submission.message,
  ].join('\n')
}

function buildHtml(submission: ContactSubmission) {
  const rows = [
    ['Name', submission.name],
    ['Email', submission.email],
    ['Company', submission.company || 'Not provided'],
    ['Service', submission.service],
    ['Submitted', submission.submittedAt],
  ]

  return `
    <div style="font-family:Arial,sans-serif;color:#0f2349;line-height:1.5;max-width:640px">
      <h1 style="font-size:22px;margin:0 0 24px">New Miduva website enquiry</h1>
      <table style="border-collapse:collapse;width:100%;margin-bottom:24px">
        ${rows
          .map(
            ([label, value]) => `
              <tr>
                <th style="text-align:left;padding:8px 16px 8px 0;color:#526783;font-size:13px;vertical-align:top">${escapeHtml(label)}</th>
                <td style="padding:8px 0;font-size:14px">${escapeHtml(value)}</td>
              </tr>`,
          )
          .join('')}
      </table>
      <h2 style="font-size:15px;margin:0 0 8px">Message</h2>
      <div style="white-space:pre-wrap;background:#f3f7f8;border-radius:10px;padding:16px;font-size:14px">${escapeHtml(submission.message)}</div>
    </div>
  `
}

async function sendEmail(
  submission: ContactSubmission,
  apiKey: string,
  from: string,
) {
  const response = await fetch(RESEND_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: getRecipients(),
      reply_to: submission.email,
      subject: `Website enquiry from ${submission.name.replace(/[\r\n]+/g, ' ')}`,
      text: buildPlainText(submission),
      html: buildHtml(submission),
    }),
    signal: AbortSignal.timeout(10_000),
  })

  if (!response.ok) {
    const responseBody = await response.text().catch(() => '')
    throw new Error(`Resend returned ${response.status}: ${responseBody.slice(0, 500)}`)
  }

  return true
}

async function sendWebhook(
  submission: ContactSubmission,
  webhookUrl: string,
  webhookSecret?: string,
) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (webhookSecret) headers.Authorization = `Bearer ${webhookSecret}`

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify({ event: 'contact.submitted', data: submission }),
    signal: AbortSignal.timeout(10_000),
  })

  if (!response.ok) {
    const responseBody = await response.text().catch(() => '')
    throw new Error(`Contact webhook returned ${response.status}: ${responseBody.slice(0, 500)}`)
  }

  return true
}

export async function deliverContactSubmission(
  submission: ContactSubmission,
): Promise<DeliveryResult> {
  const attempts: Promise<boolean>[] = []
  const apiKey = process.env.RESEND_API_KEY?.trim()
  const from = process.env.CONTACT_FROM_EMAIL?.trim()
  const webhookUrl = process.env.CONTACT_WEBHOOK_URL?.trim()

  if (apiKey && from) attempts.push(sendEmail(submission, apiKey, from))
  if (webhookUrl) {
    attempts.push(
      sendWebhook(
        submission,
        webhookUrl,
        process.env.CONTACT_WEBHOOK_SECRET?.trim(),
      ),
    )
  }

  const results = await Promise.allSettled(attempts)

  for (const result of results) {
    if (result.status === 'rejected') {
      console.error('[contact-delivery] failed:', result.reason)
    }
  }

  return {
    configured: attempts.length > 0,
    delivered: results.some(
      (result) => result.status === 'fulfilled' && result.value === true,
    ),
  }
}
