import 'server-only'

// Headless WordPress client for the /blog pages. WordPress (miduva.com/wp-admin)
// is only the editor; everything public is rendered here with the site's own
// components. All reads are cached and tagged so the WordPress save hook can
// refresh them through /api/blog/revalidate.

const API_URL = (process.env.WORDPRESS_API_URL ?? 'http://localhost:8080/wp-json').replace(/\/$/, '')
export const WORDPRESS_TAG = 'wordpress'
const REVALIDATE_SECONDS = 300

export const POSTS_PER_PAGE = 12

export type BlogCategory = { id: number; name: string; slug: string; description: string; count: number }

export type BlogAuthor = { name: string; slug: string; bio: string; avatar: string | null }

export type BlogImage = { url: string; alt: string; width: number | null; height: number | null }

export type BlogSeo = {
  title: string | null
  description: string | null
  ogImage: string | null
  noindex: boolean
}

export type BlogPostSummary = {
  id: number
  slug: string
  title: string
  excerpt: string
  date: string
  modified: string
  readingMinutes: number
  image: BlogImage | null
  categories: BlogCategory[]
  author: BlogAuthor | null
}

export type TocItem = { id: string; text: string; level: 2 | 3 }

export type BlogPost = BlogPostSummary & {
  html: string
  toc: TocItem[]
  seo: BlogSeo
}

export type PostPage = { posts: BlogPostSummary[]; total: number; totalPages: number }

/* ─── Raw REST shapes (only the fields we read) ─── */
type WpRendered = { rendered: string }
type WpTerm = { id: number; name: string; slug: string; taxonomy: string; description?: string; count?: number }
type WpMedia = { source_url: string; alt_text?: string; media_details?: { width?: number; height?: number } }
type WpUser = { name: string; slug: string; description?: string; avatar_urls?: Record<string, string> }
type WpYoast = {
  title?: string
  description?: string
  og_image?: { url: string }[]
  robots?: { index?: string }
}
type WpPost = {
  id: number
  slug: string
  date_gmt: string
  modified_gmt: string
  title: WpRendered
  excerpt: WpRendered
  content: WpRendered
  yoast_head_json?: WpYoast
  _embedded?: {
    author?: WpUser[]
    'wp:featuredmedia'?: WpMedia[]
    'wp:term'?: WpTerm[][]
  }
}

async function wpFetch<T>(path: string, params: Record<string, string | number | undefined> = {}) {
  const url = new URL(`${API_URL}${path}`)
  for (const [key, value] of Object.entries(params)) if (value !== undefined && value !== '') url.searchParams.set(key, String(value))
  try {
    const res = await fetch(url, {
      cache: 'force-cache',
      next: { revalidate: REVALIDATE_SECONDS, tags: [WORDPRESS_TAG] },
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) return null
    return {
      data: (await res.json()) as T,
      total: Number(res.headers.get('x-wp-total') ?? 0),
      totalPages: Number(res.headers.get('x-wp-totalpages') ?? 0),
    }
  } catch (error) {
    console.error(`[wordpress] ${url.pathname} failed:`, error instanceof Error ? error.message : error)
    return null
  }
}

/* ─── Text helpers ─── */
const NAMED_ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', hellip: '…', mdash: '—', ndash: '–', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“' }

export function decodeEntities(value: string) {
  return value.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, code: string) => {
    if (code[0] === '#') {
      const n = code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10)
      return Number.isFinite(n) ? String.fromCodePoint(n) : match
    }
    return NAMED_ENTITIES[code.toLowerCase()] ?? match
  })
}

function stripTags(html: string) {
  return decodeEntities(html.replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim()
}

function readingMinutes(html: string) {
  const words = stripTags(html).split(' ').filter(Boolean).length
  return Math.max(1, Math.round(words / 225))
}

function slugify(text: string) {
  return text.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9؀-ۿ]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80) || 'section'
}

/** Gives every h2/h3 a stable id and collects them for the table of contents. */
function withHeadingAnchors(html: string) {
  const toc: TocItem[] = []
  const used = new Set<string>()
  const out = html.replace(/<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi, (match, level: string, attrs: string, inner: string) => {
    const text = stripTags(inner)
    if (!text) return match
    const existing = attrs.match(/\sid=["']([^"']+)["']/i)?.[1]
    let id = existing ?? slugify(text)
    if (!existing) {
      let n = 2
      const base = id
      while (used.has(id)) id = `${base}-${n++}`
    }
    used.add(id)
    toc.push({ id, text, level: level === '2' ? 2 : 3 })
    return existing ? match : `<h${level}${attrs} id="${id}">${inner}</h${level}>`
  })
  return { html: out, toc }
}

/* ─── Mappers ─── */
function mapCategory(term: WpTerm): BlogCategory {
  return { id: term.id, name: decodeEntities(term.name), slug: term.slug, description: stripTags(term.description ?? ''), count: term.count ?? 0 }
}

function mapSummary(post: WpPost): BlogPostSummary {
  const media = post._embedded?.['wp:featuredmedia']?.[0]
  const user = post._embedded?.author?.[0]
  const terms = (post._embedded?.['wp:term'] ?? []).flat().filter((t) => t?.taxonomy === 'category')
  const avatar = user?.avatar_urls ? user.avatar_urls['96'] ?? Object.values(user.avatar_urls).pop() ?? null : null
  return {
    id: post.id,
    slug: post.slug,
    title: stripTags(post.title.rendered),
    excerpt: stripTags(post.excerpt.rendered).replace(/\s*\[(…|&hellip;|\.\.\.)\]\s*$/, '…'),
    date: `${post.date_gmt}Z`,
    modified: `${post.modified_gmt}Z`,
    readingMinutes: readingMinutes(post.content?.rendered ?? ''),
    image: media?.source_url
      ? { url: media.source_url, alt: media.alt_text || stripTags(post.title.rendered), width: media.media_details?.width ?? null, height: media.media_details?.height ?? null }
      : null,
    categories: terms.map(mapCategory),
    author: user ? { name: user.name, slug: user.slug, bio: stripTags(user.description ?? ''), avatar } : null,
  }
}

/* ─── Queries ─── */
export async function getPosts({ page = 1, categoryId, search, perPage = POSTS_PER_PAGE }: { page?: number; categoryId?: number; search?: string; perPage?: number } = {}): Promise<PostPage> {
  const res = await wpFetch<WpPost[]>('/wp/v2/posts', {
    _embed: 'author,wp:featuredmedia,wp:term',
    per_page: perPage,
    page,
    categories: categoryId,
    search: search?.slice(0, 100),
  })
  if (!res || !Array.isArray(res.data)) return { posts: [], total: 0, totalPages: 0 }
  return { posts: res.data.map(mapSummary), total: res.total, totalPages: res.totalPages }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const res = await wpFetch<WpPost[]>('/wp/v2/posts', { slug, _embed: 'author,wp:featuredmedia,wp:term' })
  const post = res?.data?.[0]
  if (!post) return null
  const { html, toc } = withHeadingAnchors(post.content.rendered)
  const yoast = post.yoast_head_json
  return {
    ...mapSummary(post),
    html,
    toc,
    seo: {
      title: yoast?.title ? decodeEntities(yoast.title) : null,
      description: yoast?.description ? decodeEntities(yoast.description) : null,
      ogImage: yoast?.og_image?.[0]?.url ?? null,
      noindex: yoast?.robots?.index === 'noindex',
    },
  }
}

export async function getCategories(): Promise<BlogCategory[]> {
  const res = await wpFetch<WpTerm[]>('/wp/v2/categories', { per_page: 100, hide_empty: 'true', orderby: 'count', order: 'desc' })
  return (res?.data ?? []).map((term) => mapCategory({ ...term, taxonomy: 'category' }))
}

export async function getCategoryBySlug(slug: string): Promise<BlogCategory | null> {
  const res = await wpFetch<WpTerm[]>('/wp/v2/categories', { slug })
  const term = res?.data?.[0]
  return term ? mapCategory({ ...term, taxonomy: 'category' }) : null
}

export async function getRelatedPosts(post: BlogPostSummary, count = 3): Promise<BlogPostSummary[]> {
  const categoryId = post.categories[0]?.id
  const res = await wpFetch<WpPost[]>('/wp/v2/posts', {
    _embed: 'author,wp:featuredmedia,wp:term',
    per_page: count,
    exclude: post.id,
    categories: categoryId,
  })
  const related = (res?.data ?? []).map(mapSummary)
  if (related.length >= count || !categoryId) return related
  const fill = await getPosts({ perPage: count + 1 + related.length })
  const seen = new Set([post.id, ...related.map((p) => p.id)])
  return [...related, ...fill.posts.filter((p) => !seen.has(p.id))].slice(0, count)
}

/** Every published post, newest first — for the sitemap and RSS feed. */
export async function getAllPosts(limit = 1000): Promise<BlogPostSummary[]> {
  const all: BlogPostSummary[] = []
  for (let page = 1; all.length < limit; page++) {
    const res = await getPosts({ page, perPage: 100 })
    all.push(...res.posts)
    if (page >= res.totalPages) break
  }
  return all.slice(0, limit)
}
