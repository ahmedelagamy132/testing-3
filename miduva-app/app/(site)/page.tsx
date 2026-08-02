import type { Metadata } from 'next'
import { PublicLandingPage } from '@/components/puck/public-landing-page'
import { getPublishedLandingPageData } from '@/lib/puck/storage'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPublishedLandingPageData()
  return {
    title: data.root.props?.seo?.title,
    description: data.root.props?.seo?.description,
  }
}

export default async function Home() {
  return <PublicLandingPage data={await getPublishedLandingPageData()} />
}
