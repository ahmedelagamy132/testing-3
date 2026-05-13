import type { Metadata } from "next"
import { ComingSoon } from "@/components/coming-soon/coming-soon"

// ─────────────────────────────────────────────────────────────────────
// Coming-soon mode. To restore the full landing page, swap this file's
// default export back to:
//
//   import { AppWrapper } from '@/components/app-wrapper'
//   import { getLandingPageData } from '@/payload/utils/get-landing-page-data'
//   export const revalidate = 60
//   export default async function Home() {
//     const data = await getLandingPageData()
//     return <AppWrapper data={data} />
//   }
//
// The landing components in `components/` are untouched.
// ─────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Miduva — Almost ready",
  description:
    "A new kind of growth agency. Launching May 2026. Leave your email and you'll hear from us the moment it's live.",
  openGraph: {
    title: "Miduva — Almost ready",
    description:
      "A new kind of growth agency. Launching May 2026.",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function Home() {
  return <ComingSoon />
}
