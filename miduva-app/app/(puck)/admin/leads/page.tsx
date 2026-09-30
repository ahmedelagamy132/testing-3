import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { LeadsBoard } from "@/components/admin/leads-board"
import { isPuckAdminAuthenticated } from "@/lib/puck/auth"
import { getLeadStats, isLeadStatus, listLeads, type LeadFormType } from "@/lib/submissions"

export const dynamic = "force-dynamic"
export const metadata: Metadata = { title: "Leads — Miduva Admin", robots: { index: false, follow: false } }

type Search = Promise<{ status?: string; form?: string; q?: string }>

export default async function LeadsPage({ searchParams }: { searchParams: Search }) {
  if (!(await isPuckAdminAuthenticated())) redirect("/admin/login?next=/admin/leads")
  const { status, form, q } = await searchParams
  const filters = {
    status: isLeadStatus(status) ? status : undefined,
    formType: form === "contact" || form === "rfp" || form === "talk" ? (form as LeadFormType) : undefined,
    search: q?.trim().slice(0, 100) || undefined,
  }
  const [leads, stats] = await Promise.all([listLeads(filters), getLeadStats()])
  return <LeadsBoard leads={leads} stats={stats} filters={filters} />
}
