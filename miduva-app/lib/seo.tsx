import type { Metadata } from 'next'
import type { LandingPagePuckData } from '@/lib/puck/types'
import type { FaqItem } from '@/lib/types'

export const SITE_URL = (process.env.SITE_URL ?? 'https://miduva.com').replace(/\/$/, '')
export const SITE_NAME = 'Miduva'
export const CONTACT_EMAIL = 'hello@miduva.com'

const FALLBACK_TITLE = 'Miduva — We Build Custom Growth Systems'
const FALLBACK_DESCRIPTION =
  'No generic services. We design tailored systems using ads, funnels, automation & data to grow your business — engineered end-to-end, owned by you.'

export function buildLandingMetadata(data: LandingPagePuckData): Metadata {
  const title = data.root.props?.seo?.title || FALLBACK_TITLE
  const description = data.root.props?.seo?.description || FALLBACK_DESCRIPTION
  return {
    title,
    description,
    // /main-site renders the same page, so both point search engines at /
    alternates: { canonical: '/' },
    openGraph: { type: 'website', url: '/', siteName: SITE_NAME, title, description, locale: 'en_US' },
    twitter: { card: 'summary_large_image', title, description },
  }
}

function findFaqItems(data: LandingPagePuckData): FaqItem[] {
  const sections = [...(data.root.props?.beforeDashboard ?? []), ...(data.root.props?.afterDashboard ?? []), ...data.content]
  const faq = sections.find((section) => section.type === 'FaqSection')
  return ((faq?.props as { items?: FaqItem[] } | undefined)?.items ?? []).filter((item) => item.question && item.answer)
}

export function buildLandingJsonLd(data: LandingPagePuckData) {
  const description = data.root.props?.seo?.description || FALLBACK_DESCRIPTION
  const graph: Record<string, unknown>[] = [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/icon.png`,
      email: CONTACT_EMAIL,
      description,
      areaServed: 'Worldwide',
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
      publisher: { '@id': `${SITE_URL}/#organization` },
    },
  ]

  const faqItems = findFaqItems(data)
  if (faqItems.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${SITE_URL}/#faq`,
      mainEntity: faqItems.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    })
  }

  return { '@context': 'https://schema.org', '@graph': graph }
}

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}
