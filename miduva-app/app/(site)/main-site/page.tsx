import type { Metadata } from 'next'
import { PublicLandingPage } from '@/components/puck/public-landing-page'
import { getPublishedLandingPageData } from '@/lib/puck/storage'
import { contentFromDocument } from '@/lib/site-editor/content'
import { buildLandingMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'

// Duplicate of / — canonical points to / so it isn't indexed separately
export async function generateMetadata(): Promise<Metadata> {
  return buildLandingMetadata(await getPublishedLandingPageData())
}

export default async function MainSitePage() {
  return <PublicLandingPage content={contentFromDocument(await getPublishedLandingPageData())} />
}
