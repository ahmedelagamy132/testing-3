"use client"

import { useRouter } from "next/navigation"
import { Fragment, useState, useTransition } from "react"
import type { Lead, LeadFormType, LeadStatus } from "@/lib/submissions"

const STATUSES: { id: LeadStatus; label: string }[] = [
  { id: "new", label: "New" },
  { id: "contacted", label: "Contacted" },
  { id: "qualified", label: "Qualified" },
  { id: "won", label: "Won" },
  { id: "lost", label: "Lost" },
]
const FORM_LABELS: Record<LeadFormType, string> = { contact: "Contact form", rfp: "RFP", talk: "Let’s talk" }

type Stats = { total: number; thisWeek: number; byStatus: Record<LeadStatus, number> }
type Filters = { status?: LeadStatus; formType?: LeadFormType; search?: string }

function when(iso: string) {
  const d = new Date(iso)
  return d.toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
}

function hrefWith(filters: Filters, change: Partial<Filters>) {
  const next = { ...filters, ...change }
  const params = new URLSearchParams()
  if (next.status) params.set("status", next.status)
  if (next.formType) params.set("form", next.formType)
  if (next.search) params.set("q", next.search)
  const qs = params.toString()
  return qs ? `/admin/leads?${qs}` : "/admin/leads"
}

async function send(id: number, method: "PATCH" | "DELETE", body?: object) {
  const res = await fetch(`/api/admin/leads/${id}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })
  if (res.status === 401) window.location.href = "/admin/login?next=/admin/leads"
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? "Something went wrong.")
}

function LeadDetail({ lead, onSaved }: { lead: Lead; onSaved: () => void }) {
  const [notes, setNotes] = useState(lead.notes)
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle")
  const save = async () => {
    setState("saving")
    try {
      await send(lead.id, "PATCH", { notes })
      setState("saved")
      onSaved()
    } catch {
      setState("error")
    }
  }
  return (
    <div className="leads-detail">
      <dl>
        <div><dt>Email</dt><dd><a href={`mailto:${lead.email}`}>{lead.email}</a></dd></div>
        {lead.phone && <div><dt>Phone</dt><dd><a href={`tel:${lead.phone.replace(/[^\d+]/g, "")}`}>{lead.phone}</a></dd></div>}
        {lead.company && <div><dt>Company</dt><dd>{lead.company}</dd></div>}
        {lead.website && <div><dt>Website</dt><dd>{lead.website}</dd></div>}
        {lead.budget && <div><dt>Monthly budget</dt><dd>{lead.budget}</dd></div>}
        <div><dt>Interested in</dt><dd>{lead.service || "—"}</dd></div>
        <div><dt>Sent from</dt><dd>{lead.page || "—"}</dd></div>
        <div><dt>Received</dt><dd>{when(lead.createdAt)}</dd></div>
      </dl>
      {lead.formType === "contact" && lead.message && (
        <div className="leads-message">
          <div className="leads-label">Message</div>
          <p>{lead.message}</p>
        </div>
      )}
      <div className="leads-notes">
        <label className="leads-label" htmlFor={`notes-${lead.id}`}>Private notes</label>
        <textarea id={`notes-${lead.id}`} value={notes} onChange={(e) => { setNotes(e.target.value); setState("idle") }} placeholder="Call summary, next step, follow-up date…" rows={3} maxLength={5000} />
        <div className="leads-notes__actions">
          <span className={`leads-save-state is-${state}`}>{state === "saved" ? "Saved" : state === "error" ? "Could not save" : ""}</span>
          <button type="button" className="leads-btn is-primary" disabled={state === "saving" || notes === lead.notes} onClick={save}>
            {state === "saving" ? "Saving…" : "Save notes"}
          </button>
        </div>
      </div>
    </div>
  )
}

export function LeadsBoard({ leads, stats, filters }: { leads: Lead[]; stats: Stats; filters: Filters }) {
  const router = useRouter()
  const [openId, setOpenId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const refresh = () => startTransition(() => router.refresh())

  const setStatus = async (lead: Lead, status: LeadStatus) => {
    setError(null)
    try {
      await send(lead.id, "PATCH", { status })
      refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not update the lead.")
    }
  }

  const remove = async (lead: Lead) => {
    if (!window.confirm(`Delete the lead from ${lead.name} (${lead.email})? This cannot be undone.`)) return
    setError(null)
    try {
      await send(lead.id, "DELETE")
      if (openId === lead.id) setOpenId(null)
      refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not delete the lead.")
    }
  }

  const signOut = async () => {
    await fetch("/api/puck/auth/logout", { method: "POST" }).catch(() => {})
    window.location.href = "/admin/login"
  }

  return (
    <div className="leads-page">
      <header className="leads-topbar">
        <div className="leads-topbar__brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/miduva-logo-white.png" alt="Miduva" width={96} height={20} />
          <nav aria-label="Admin">
            <a href="/admin">Site editor</a>
            <a href="/admin/leads" aria-current="page">Leads</a>
            <a href="/wp-admin/" target="_blank" rel="noreferrer">Blog (WordPress)</a>
          </nav>
        </div>
        <div className="leads-topbar__actions">
          <a className="leads-btn" href={`/api/admin/leads/export${filters.status ? `?status=${filters.status}` : ""}`}>Export CSV</a>
          <button type="button" className="leads-btn is-ghost" onClick={signOut}>Sign out</button>
        </div>
      </header>

      <main className="leads-main">
        <div className="leads-heading">
          <div>
            <div className="leads-eyebrow">/ leads</div>
            <h1>Every form submission, in one place.</h1>
          </div>
          <form className="leads-search" action="/admin/leads" method="get" role="search">
            {filters.status && <input type="hidden" name="status" value={filters.status} />}
            {filters.formType && <input type="hidden" name="form" value={filters.formType} />}
            <input name="q" type="search" defaultValue={filters.search} placeholder="Search name, email, phone, company…" aria-label="Search leads" maxLength={100} />
          </form>
        </div>

        <section className="leads-stats" aria-label="Summary">
          <div><span>{stats.total}</span>Total leads</div>
          <div><span>{stats.thisWeek}</span>Last 7 days</div>
          <div className="is-accent"><span>{stats.byStatus.new}</span>New — not yet contacted</div>
          <div><span>{stats.byStatus.won}</span>Won</div>
        </section>

        <nav className="leads-filters" aria-label="Filter leads">
          <div>
            <a href={hrefWith(filters, { status: undefined })} aria-current={!filters.status ? "true" : undefined}>All <b>{stats.total}</b></a>
            {STATUSES.map((s) => (
              <a key={s.id} href={hrefWith(filters, { status: s.id })} aria-current={filters.status === s.id ? "true" : undefined}>
                {s.label} <b>{stats.byStatus[s.id]}</b>
              </a>
            ))}
          </div>
          <div>
            <a href={hrefWith(filters, { formType: undefined })} aria-current={!filters.formType ? "true" : undefined}>All forms</a>
            {(Object.keys(FORM_LABELS) as LeadFormType[]).map((f) => (
              <a key={f} href={hrefWith(filters, { formType: f })} aria-current={filters.formType === f ? "true" : undefined}>{FORM_LABELS[f]}</a>
            ))}
          </div>
        </nav>

        {error && <p className="leads-error" role="alert">{error}</p>}

        {leads.length === 0 ? (
          <div className="leads-empty">
            <p>{filters.status || filters.formType || filters.search ? "No leads match these filters." : "No leads yet."}</p>
            <span>Submissions from the contact form and the RFP / Let’s talk popups appear here the moment they’re sent.</span>
          </div>
        ) : (
          <div className={`leads-table-wrap${pending ? " is-pending" : ""}`}>
            <table className="leads-table">
              <thead>
                <tr><th>Received</th><th>Lead</th><th>Form</th><th>Budget</th><th>Status</th><th aria-label="Actions" /></tr>
              </thead>
              <tbody>
                {leads.map((lead) => {
                  const open = openId === lead.id
                  return (
                    <Fragment key={lead.id}>
                      <tr className={`${open ? "is-open" : ""} is-${lead.status}`}>
                        <td className="leads-date">{when(lead.createdAt)}</td>
                        <td>
                          <button type="button" className="leads-name" aria-expanded={open} onClick={() => setOpenId(open ? null : lead.id)}>
                            <strong>{lead.name}</strong>
                            <span>{lead.email}{lead.company ? ` · ${lead.company}` : ""}</span>
                          </button>
                        </td>
                        <td><span className={`leads-tag is-${lead.formType}`}>{FORM_LABELS[lead.formType]}</span></td>
                        <td className="leads-muted">{lead.budget || "—"}</td>
                        <td>
                          <select className={`leads-status is-${lead.status}`} value={lead.status} aria-label={`Status for ${lead.name}`} onChange={(e) => void setStatus(lead, e.target.value as LeadStatus)}>
                            {STATUSES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                          </select>
                        </td>
                        <td className="leads-row-actions">
                          <button type="button" className="leads-btn is-ghost" onClick={() => setOpenId(open ? null : lead.id)}>{open ? "Close" : "Details"}</button>
                          <button type="button" className="leads-btn is-danger" aria-label={`Delete lead from ${lead.name}`} onClick={() => void remove(lead)}>Delete</button>
                        </td>
                      </tr>
                      {open && (
                        <tr className="leads-detail-row">
                          <td colSpan={6}><LeadDetail lead={lead} onSaved={refresh} /></td>
                        </tr>
                      )}
                    </Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
