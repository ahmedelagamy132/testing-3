import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { BlogShell } from "@/components/blog/blog-shell"
import { CtaBand, SidebarLeadCard } from "@/components/blog/blog-cta"
import { AuthorBio, Breadcrumbs, Eyebrow, PostCard, ShareLinks, formatDate } from "@/components/blog/blog-ui"
import { TableOfContents } from "@/components/blog/table-of-contents"
import { getSiteChrome } from "@/lib/blog-chrome"
import { getPostBySlug, getRelatedPosts } from "@/lib/wordpress"
import { JsonLd, SITE_NAME, SITE_URL } from "@/lib/seo"

type Params = Promise<{ slug: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return { title: `Not found | ${SITE_NAME}`, robots: { index: false } }
  const path = `/blog/${post.slug}`
  const title = post.seo.title || `${post.title} | ${SITE_NAME} Blog`
  const description = post.seo.description || post.excerpt.slice(0, 160)
  const image = post.seo.ogImage || post.image?.url
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    robots: post.seo.noindex ? { index: false, follow: true } : undefined,
    authors: post.author ? [{ name: post.author.name }] : undefined,
    openGraph: {
      type: "article",
      url: path,
      siteName: SITE_NAME,
      title: post.seo.title || post.title,
      description,
      locale: "en_US",
      publishedTime: post.date,
      modifiedTime: post.modified,
      authors: post.author ? [post.author.name] : undefined,
      section: post.categories[0]?.name,
      images: image ? [{ url: image, alt: post.image?.alt ?? post.title }] : undefined,
    },
    twitter: { card: "summary_large_image", title: post.seo.title || post.title, description, images: image ? [image] : undefined },
  }
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()
  const [chrome, related] = await Promise.all([getSiteChrome(), getRelatedPosts(post)])

  const url = `${SITE_URL}/blog/${post.slug}`
  const category = post.categories[0]
  const updated = new Date(post.modified).getTime() - new Date(post.date).getTime() > 24 * 3600 * 1000

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        headline: post.title,
        description: post.seo.description || post.excerpt,
        url,
        mainEntityOfPage: url,
        datePublished: post.date,
        dateModified: post.modified,
        ...(post.image ? { image: [post.image.url] } : {}),
        ...(category ? { articleSection: category.name } : {}),
        ...(post.author ? { author: { "@type": "Person", name: post.author.name, url: `${SITE_URL}/blog` } } : {}),
        publisher: { "@id": `${SITE_URL}/#organization` },
        isPartOf: { "@id": `${SITE_URL}/blog#blog` },
        timeRequired: `PT${post.readingMinutes}M`,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
          ...(category ? [{ "@type": "ListItem", position: 3, name: category.name, item: `${SITE_URL}/blog/category/${category.slug}` }] : []),
          { "@type": "ListItem", position: category ? 4 : 3, name: post.title, item: url },
        ],
      },
    ],
  }

  return (
    <BlogShell chrome={chrome}>
      <JsonLd data={jsonLd} />
      <div id="hero" />

      <article className="relative">
        <div aria-hidden className="absolute -top-40 -left-40 w-[640px] h-[640px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(43,200,183,0.09) 0%, transparent 60%)", filter: "blur(80px)" }} />

        <div className="relative max-w-6xl mx-auto px-6 pt-32 md:pt-40">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Blog", href: "/blog" },
              ...(category ? [{ label: category.name, href: `/blog/category/${category.slug}` }] : []),
              { label: post.title },
            ]}
          />

          <div className="mt-8 grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-14">
            {/* ── Main column ── */}
            <div className="min-w-0">
              {category && <Eyebrow>/ {category.name}</Eyebrow>}
              <h1 className="text-[36px] md:text-[54px] font-extrabold tracking-[-0.045em] leading-[1.04] text-[var(--navy-900)]">{post.title}</h1>
              {post.excerpt && <p className="mt-5 text-[18px] md:text-[20px] leading-[1.55] text-[var(--muted)]">{post.excerpt}</p>}

              {/* Byline */}
              <div className="mt-8 flex flex-wrap items-center justify-between gap-5 border-y border-[var(--line)] py-5">
                <div className="flex items-center gap-3">
                  {post.author?.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={post.author.avatar} alt="" width={44} height={44} className="rounded-full ring-1 ring-[var(--line)]" />
                  ) : null}
                  <div>
                    {post.author && <div className="text-[15px] font-bold text-[var(--ink)]">{post.author.name}</div>}
                    <div className="mt-0.5 flex flex-wrap items-center gap-x-2 mono text-[11px] uppercase tracking-[0.12em] text-[var(--muted)]">
                      <time dateTime={post.date}>{formatDate(post.date)}</time>
                      {updated && <><span aria-hidden>·</span><span>Updated <time dateTime={post.modified}>{formatDate(post.modified)}</time></span></>}
                      <span aria-hidden>·</span>
                      <span>{post.readingMinutes} min read</span>
                    </div>
                  </div>
                </div>
                <ShareLinks url={url} title={post.title} />
              </div>

              {post.image && (
                <figure className="mt-8 overflow-hidden rounded-[24px] border border-[var(--line)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={post.image.url} alt={post.image.alt} width={post.image.width ?? undefined} height={post.image.height ?? undefined} className="w-full h-auto" fetchPriority="high" />
                </figure>
              )}

              {/* Mobile outline */}
              {post.toc.length > 1 && (
                <details className="mt-8 lg:hidden rounded-[20px] border border-[var(--line)] bg-[var(--card)] px-5 py-4">
                  <summary className="cursor-pointer mono text-[12px] uppercase tracking-[0.16em] text-[var(--teal-500)]">Table of contents</summary>
                  <div className="mt-4"><TableOfContents items={post.toc} /></div>
                </details>
              )}

              <div className="blog-prose mt-10" dangerouslySetInnerHTML={{ __html: post.html }} />

              <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--line)] pt-6">
                <div className="flex flex-wrap gap-2">
                  {post.categories.map((c) => (
                    <Link key={c.id} href={`/blog/category/${c.slug}`} className="rounded-full border border-[var(--line)] bg-[var(--chip)] px-3 py-1.5 text-[12px] font-semibold text-[var(--navy-700)] hover:text-[var(--teal-500)] transition-colors">
                      {c.name}
                    </Link>
                  ))}
                </div>
                <ShareLinks url={url} title={post.title} />
              </div>

              {post.author && <AuthorBio author={post.author} />}
            </div>

            {/* ── Sidebar ── */}
            <aside className="hidden lg:block">
              <div className="sticky top-28 space-y-5">
                {post.toc.length > 1 && (
                  <div className="rounded-[24px] border border-[var(--line)] bg-[var(--card)] p-6">
                    <div className="mb-4 mono text-[11px] uppercase tracking-[0.18em] text-[var(--teal-500)]">On this page</div>
                    <div className="max-h-[42vh] overflow-y-auto pr-1"><TableOfContents items={post.toc} /></div>
                  </div>
                )}
                <SidebarLeadCard />
              </div>
            </aside>
          </div>
        </div>
      </article>

      {/* ── Related + CTA ── */}
      <section className="relative max-w-6xl mx-auto px-6 pt-20 pb-24 md:pb-32">
        {related.length > 0 && (
          <>
            <Eyebrow>/ keep reading</Eyebrow>
            <h2 className="text-[34px] md:text-[48px] font-extrabold tracking-[-0.04em] leading-[1.05] text-[var(--navy-900)]">
              More on <span className="text-[var(--teal-500)]">{category?.name ?? "growth"}.</span>
            </h2>
            <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => <PostCard key={p.id} post={p} />)}
            </div>
          </>
        )}
        <div className={related.length > 0 ? "mt-16" : ""}>
          <CtaBand />
        </div>
      </section>
    </BlogShell>
  )
}
