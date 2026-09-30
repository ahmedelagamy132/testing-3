import { notFound } from "next/navigation"
import { PreviewFrame } from "@/components/site-editor/preview-frame"
import { isPuckAdminAuthenticated } from "@/lib/puck/auth"
import { getPageDocument } from "@/lib/puck/storage"
import { contentFromDocument } from "@/lib/site-editor/content"

export const dynamic = "force-dynamic"

// Rendered inside the editor's iframe: the real site, fed live draft content.
export default async function AdminPreviewPage() {
  if (!(await isPuckAdminAuthenticated())) notFound()
  const document = await getPageDocument()
  return <PreviewFrame initialContent={contentFromDocument(document.draft)} />
}
