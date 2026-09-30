import { requirePuckAdmin } from '@/lib/puck/auth'
import { deleteLead, isLeadStatus, updateLead } from '@/lib/submissions'

export const runtime = 'nodejs'

type Context = { params: Promise<{ id: string }> }

async function leadId(context: Context) {
  const id = Number((await context.params).id)
  return Number.isInteger(id) && id > 0 ? id : null
}

export async function PATCH(request: Request, context: Context) {
  const denied = await requirePuckAdmin(request)
  if (denied) return denied
  const id = await leadId(context)
  if (!id) return Response.json({ error: 'Invalid lead.' }, { status: 400 })

  let body: { status?: unknown; notes?: unknown }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid request.' }, { status: 400 })
  }
  if (body.status !== undefined && !isLeadStatus(body.status)) {
    return Response.json({ error: 'Unknown status.' }, { status: 400 })
  }
  if (body.notes !== undefined && typeof body.notes !== 'string') {
    return Response.json({ error: 'Notes must be text.' }, { status: 400 })
  }

  const updated = await updateLead(id, {
    status: body.status as Parameters<typeof updateLead>[1]['status'],
    notes: typeof body.notes === 'string' ? body.notes.slice(0, 5000) : undefined,
  })
  return updated ? Response.json({ ok: true }) : Response.json({ error: 'Lead not found.' }, { status: 404 })
}

export async function DELETE(request: Request, context: Context) {
  const denied = await requirePuckAdmin(request)
  if (denied) return denied
  const id = await leadId(context)
  if (!id) return Response.json({ error: 'Invalid lead.' }, { status: 400 })
  return (await deleteLead(id)) ? Response.json({ ok: true }) : Response.json({ error: 'Lead not found.' }, { status: 404 })
}
