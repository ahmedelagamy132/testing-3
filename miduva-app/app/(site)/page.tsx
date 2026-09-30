import type { Metadata } from 'next'
import { PublicLandingPage } from '@/components/puck/public-landing-page'
import { getPublishedLandingPageData } from '@/lib/puck/storage'
import { contentFromDocument } from '@/lib/site-editor/content'
import { buildLandingJsonLd, buildLandingMetadata, JsonLd } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  return buildLandingMetadata(await getPublishedLandingPageData())
}

export default async function Home() {
  const data = await getPublishedLandingPageData()
  return (
    <>
      <JsonLd data={buildLandingJsonLd(data)} />
      <PublicLandingPage content={contentFromDocument(data)} />
    </>
  )
}
