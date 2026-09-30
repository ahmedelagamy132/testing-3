import type { MetadataRoute } from 'next'
import { getPageDocument } from '@/lib/puck/storage'
import { SITE_URL } from '@/lib/seo'
import { getAllPosts, getCategories } from '@/lib/wordpress'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [{ publishedAt }, posts, categories] = await Promise.all([
    getPageDocument().catch(() => ({ publishedAt: null })),
    getAllPosts(),
    getCategories(),
  ])
  return [
    {
      url: `${SITE_URL}/`,
      lastModified: publishedAt ? new Date(publishedAt) : undefined,
      changeFrequency: 'monthly',
      priority: 1,
    },
    { url: `${SITE_URL}/privacy`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE_URL}/terms`, changeFrequency: 'yearly', priority: 0.2 },
    {
      url: `${SITE_URL}/blog`,
      lastModified: posts[0] ? new Date(posts[0].modified) : undefined,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    ...categories.map((category) => ({
      url: `${SITE_URL}/blog/category/${category.slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    })),
    ...posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.modified),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
      ...(post.image ? { images: [post.image.url] } : {}),
    })),
  ]
}
