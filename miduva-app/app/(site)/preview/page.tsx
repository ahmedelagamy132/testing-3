import { headers } from "next/headers"
import { LivePreviewWrapper } from "@/components/live-preview-wrapper"
import { getLandingPageRawDoc } from "@/payload/utils/get-landing-page-data"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function PreviewPage() {
  const [doc, hdrs] = await Promise.all([
    getLandingPageRawDoc({ draft: true }),
    headers(),
  ])

  const host = hdrs.get("x-forwarded-host") ?? hdrs.get("host") ?? "localhost"
  const proto = hdrs.get("x-forwarded-proto") ?? "https"
  const serverURL = `${proto}://${host}`

  return <LivePreviewWrapper initialDoc={doc} serverURL={serverURL} />
}
