import { requirePuckAdmin } from '@/lib/puck/auth'
import { isLeadStatus, listLeads } from '@/lib/submissions'

export const runtime = 'nodejs'

// Quote every cell and neutralise spreadsheet formulas (=, +, -, @).
function cell(value: unknown) {
  let text = value === null || value === undefined ? '' : String(value)
  // Phone numbers like "+1 555 0100" are safe; anything else starting with a formula character is not.
  if (/^[=@\t\r]/.test(text) || (/^[+-]/.test(text) && !/^[+-][\d\s().-]+$/.test(text))) text = `'${text}`
  return `"${text.replace(/"/g, '""')}"`
}

export async function GET(request: Request) {
  const denied = await requirePuckAdmin()
  if (denied) return denied

  const params = new URL(request.url).searchParams
  const status = params.get('status')
  const leads = await listLeads({ status: isLeadStatus(status) ? status : undefined }, 100000)

  const header = ['Date', 'Name', 'Email', 'Phone', 'Company', 'Website', 'Budget', 'Form', 'Service', 'Page', 'Status', 'Notes', 'Message']
  const rows = leads.map((l) => [l.createdAt, l.name, l.email, l.phone, l.company, l.website, l.budget, l.formType, l.service, l.page, l.status, l.notes, l.message].map(cell).join(','))
  const csv = '﻿' + [header.map(cell).join(','), ...rows].join('\r\n')

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="miduva-leads-${new Date().toISOString().slice(0, 10)}.csv"`,
      'Cache-Control': 'no-store',
    },
  })
}
