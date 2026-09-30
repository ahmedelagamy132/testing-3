import Link from "next/link"
import { BlogShell } from "@/components/blog/blog-shell"
import { CtaBand } from "@/components/blog/blog-cta"
import { Breadcrumbs, CategoryPills, Eyebrow, FeaturedPost, Pagination, PostCard, SearchForm } from "@/components/blog/blog-ui"
import type { SiteChrome } from "@/lib/blog-chrome"
import type { BlogCategory, PostPage } from "@/lib/wordpress"
import { JsonLd, SITE_NAME, SITE_URL } from "@/lib/seo"

type Props = {
  chrome: SiteChrome
  categories: BlogCategory[]
  result: PostPage
  page: number
  basePath: string
  heading: { eyebrow: string; title: string; accent: string; description: string }
  category?: BlogCategory
  search?: string
}

// Rows of three before the call-to-action band breaks up the grid.
const CARDS_BEFORE_CTA = 6

export function PostListView({ chrome, categories, result, page, basePath, heading, category, search }: Props) {
  const { posts, totalPages } = result
  const featured = page === 1 && !search && !category ? posts[0] : undefined
  const gridPosts = featured ? posts.slice(1) : posts
  const beforeCta = gridPosts.slice(0, CARDS_BEFORE_CTA)
  const afterCta = gridPosts.slice(CARDS_BEFORE_CTA)
  const hrefFor = (p: number) => {
    const params = new URLSearchParams()
    if (search) params.set("q", search)
    if (p > 1) params.set("page", String(p))
    const qs = params.toString()
    return qs ? `${basePath}?${qs}` : basePath
  }

  const crumbs = [
    { label: "Home", href: "/" },
    ...(category || search ? [{ label: "Blog", href: "/blog" }] : []),
    { label: category ? category.name : search ? `Search: ${search}` : "Blog" },
  ]

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": category ? "CollectionPage" : "Blog",
        "@id": `${SITE_URL}${basePath}#${category ? "collection" : "blog"}`,
        url: `${SITE_URL}${basePath}`,
        name: category ? `${category.name} — ${SITE_NAME} Blog` : `${SITE_NAME} Blog`,
        description: heading.description,
        publisher: { "@id": `${SITE_URL}/#organization` },
        isPartOf: { "@id": `${SITE_URL}/#website` },
        ...(posts.length
          ? {
              [category ? "hasPart" : "blogPost"]: posts.map((p) => ({
                "@type": "BlogPosting",
                headline: p.title,
                url: `${SITE_URL}/blog/${p.slug}`,
                datePublished: p.date,
                dateModified: p.modified,
                ...(p.image ? { image: p.image.url } : {}),
                ...(p.author ? { author: { "@type": "Person", name: p.author.name } } : {}),
              })),
            }
          : {}),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: crumbs.map((c, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: c.label,
          ...(c.href ? { item: `${SITE_URL}${c.href}` } : { item: `${SITE_URL}${basePath}` }),
        })),
      },
    ],
  }

  return (
    <BlogShell chrome={chrome}>
      {!search && <JsonLd data={jsonLd} />}
      <div id="hero" />

      {/* ── Header ── */}
      <header className="relative overflow-hidden">
        <div aria-hidden className="absolute -top-40 -left-40 w-[640px] h-[640px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(43,200,183,0.10) 0%, transparent 60%)", filter: "blur(80px)" }} />
        <div aria-hidden className="absolute inset-0 pointer-events-none opacity-60" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "56px 56px", maskImage: "radial-gradient(ellipse 80% 70% at 30% 0%, black, transparent 75%)", WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 30% 0%, black, transparent 75%)" }} />
        <div className="relative max-w-6xl mx-auto px-6 pt-32 md:pt-40 pb-10 md:pb-12">
          <Breadcrumbs items={crumbs} />
          <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <Eyebrow>{heading.eyebrow}</Eyebrow>
              <h1 className="text-[42px] md:text-[72px] font-extrabold tracking-[-0.04em] text-[var(--navy-900)] leading-[1.02]">
                {heading.title}
                {heading.accent && <><br /><span className="text-[var(--teal-500)]">{heading.accent}</span></>}
              </h1>
              <p className="mt-5 max-w-[56ch] text-[16px] md:text-[18px] leading-[1.6] text-[var(--muted)]">{heading.description}</p>
            </div>
            <SearchForm defaultValue={search} />
          </div>
        </div>
      </header>

      {/* ── Categories ── */}
      {categories.length > 0 && (
        <div className="max-w-6xl mx-auto px-6">
          <CategoryPills categories={categories} activeSlug={category?.slug} />
        </div>
      )}

      {/* ── Posts ── */}
      <section aria-label="Articles" className="max-w-6xl mx-auto px-6 pt-10 pb-24 md:pb-32">
        {search && (
          <p className="mb-8 mono text-[12px] uppercase tracking-[0.16em] text-[var(--muted)]">
            {result.total} {result.total === 1 ? "result" : "results"} for <span className="text-[var(--ink)]">&ldquo;{search}&rdquo;</span>
          </p>
        )}

        {posts.length === 0 ? (
          <div className="rounded-[24px] border border-[var(--line)] bg-[var(--card)] px-6 py-16 text-center">
            <p className="text-[22px] font-extrabold tracking-[-0.03em] text-[var(--ink)]">
              {search ? "No articles match that search." : "New articles are on the way."}
            </p>
            <p className="mt-2 text-[15px] text-[var(--muted)]">
              {search ? "Try a different keyword, or browse all posts." : "Check back soon — or talk to us about your growth system today."}
            </p>
            <Link href="/blog" className="mt-6 inline-flex site-btn site-btn--outline">Browse all posts</Link>
          </div>
        ) : (
          <>
            {featured && (
              <div className="mb-5 md:mb-6">
                <FeaturedPost post={featured} />
              </div>
            )}
            {beforeCta.length > 0 && (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {beforeCta.map((post) => <PostCard key={post.id} post={post} />)}
              </div>
            )}
            <div className="my-10 md:my-14">
              <CtaBand />
            </div>
            {afterCta.length > 0 && (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {afterCta.map((post) => <PostCard key={post.id} post={post} />)}
              </div>
            )}
            <Pagination page={page} totalPages={totalPages} hrefFor={hrefFor} />
          </>
        )}
      </section>
    </BlogShell>
  )
}
