import { redirect } from "next/navigation"
import { SiteEditor } from "@/components/site-editor/editor"
import { isPuckAdminAuthenticated } from "@/lib/puck/auth"
import { getPageDocument } from "@/lib/puck/storage"
import { contentFromDocument } from "@/lib/site-editor/content"

export const dynamic = "force-dynamic"

export default async function AdminPage() {
  if (!(await isPuckAdminAuthenticated())) redirect("/admin/login")
  const document = await getPageDocument()
  return (
    <SiteEditor
      draft={contentFromDocument(document.draft)}
      published={contentFromDocument(document.published)}
      version={document.version}
    />
  )
}
