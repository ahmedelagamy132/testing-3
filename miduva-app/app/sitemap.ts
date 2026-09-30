import type { MetadataRoute } from 'next'
import { getPageDocument } from '@/lib/puck/storage'
import { SITE_URL } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { publishedAt } = await getPageDocument().catch(() => ({ publishedAt: null }))
  return [
    {
      url: `${SITE_URL}/`,
      lastModified: publishedAt ? new Date(publishedAt) : undefined,
      changeFrequency: 'monthly',
      priority: 1,
    },
    { url: `${SITE_URL}/privacy`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE_URL}/terms`, changeFrequency: 'yearly', priority: 0.2 },
  ]
}
