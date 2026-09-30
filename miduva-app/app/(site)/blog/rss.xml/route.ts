import { getPosts } from '@/lib/wordpress'
import { SITE_NAME, SITE_URL } from '@/lib/seo'

const escape = (value: string) =>
  value.replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c] as string)

export async function GET() {
  const { posts } = await getPosts({ perPage: 30 })
  const items = posts
    .map((post) => {
      const url = `${SITE_URL}/blog/${post.slug}`
      return `    <item>
      <title>${escape(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description>${escape(post.excerpt)}</description>${post.categories.map((c) => `\n      <category>${escape(c.name)}</category>`).join('')}${post.author ? `\n      <dc:creator>${escape(post.author.name)}</dc:creator>` : ''}
    </item>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${SITE_NAME} Blog</title>
    <link>${SITE_URL}/blog</link>
    <description>Growth marketing insights on ads, funnels, automation and data.</description>
    <language>en</language>
    <atom:link href="${SITE_URL}/blog/rss.xml" rel="self" type="application/rss+xml" />${posts[0] ? `\n    <lastBuildDate>${new Date(posts[0].modified).toUTCString()}</lastBuildDate>` : ''}
${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8', 'Cache-Control': 'public, max-age=600' },
  })
}
