import { redirect } from "next/navigation"
import { LandingPageEditor } from "@/components/puck/editor"
import { isPuckAdminAuthenticated } from "@/lib/puck/auth"
import { getPageDocument } from "@/lib/puck/storage"

export const dynamic = "force-dynamic"

export default async function AdminPage() {
  if (!(await isPuckAdminAuthenticated())) redirect("/admin/login")
  return <LandingPageEditor initialDocument={await getPageDocument()} />
}
