import Link from "next/link"
import type { BlogAuthor, BlogCategory, BlogPostSummary } from "@/lib/wordpress"

/* Server-rendered building blocks for /blog. They reuse the landing page's
   visual language: mono teal eyebrows, heavy tight headlines, 24px cards on
   var(--card) with a hairline border and a teal hover glow. */

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <div className="mono text-[13px] uppercase tracking-[0.22em] text-[var(--teal-500)] mb-3">{children}</div>
}

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mono text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((item, i) => (
          <li key={`${item.label}-${i}`} className="flex items-center gap-2 min-w-0">
            {i > 0 && <span aria-hidden className="text-white/20">/</span>}
            {item.href ? (
              <Link href={item.href} className="hover:text-[var(--teal-500)] transition-colors">{item.label}</Link>
            ) : (
              <span aria-current="page" className="text-[var(--navy-700)] truncate max-w-[42ch]">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

function CategoryChip({ category }: { category: BlogCategory }) {
  return (
    <Link
      href={`/blog/category/${category.slug}`}
      className="relative z-10 inline-flex items-center rounded-full border border-[rgba(43,200,183,0.3)] bg-[rgba(43,200,183,0.08)] px-2.5 py-1 mono text-[10px] uppercase tracking-[0.16em] text-[var(--teal-500)] hover:bg-[rgba(43,200,183,0.16)] transition-colors"
    >
      {category.name}
    </Link>
  )
}

function Meta({ post }: { post: BlogPostSummary }) {
  return (
    <div className="flex items-center gap-2 mono text-[11px] uppercase tracking-[0.12em] text-[var(--muted)]">
      <time dateTime={post.date}>{formatDate(post.date)}</time>
      <span aria-hidden>·</span>
      <span>{post.readingMinutes} min read</span>
    </div>
  )
}

function Avatar({ author, size = 28 }: { author: BlogAuthor; size?: number }) {
  return author.avatar ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={author.avatar} alt="" width={size} height={size} className="rounded-full ring-1 ring-[var(--line)]" loading="lazy" />
  ) : (
    <span className="rounded-full bg-[var(--chip)] ring-1 ring-[var(--line)] flex items-center justify-center text-[11px] font-bold text-[var(--teal-500)]" style={{ width: size, height: size }}>
      {author.name.charAt(0)}
    </span>
  )
}

function Cover({ post, className, sizes }: { post: BlogPostSummary; className: string; sizes: string }) {
  return (
    <div className={`relative overflow-hidden bg-[var(--paper-2)] ${className}`}>
      {post.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.image.url}
          alt={post.image.alt}
          width={post.image.width ?? undefined}
          height={post.image.height ?? undefined}
          sizes={sizes}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.04]"
        />
      ) : (
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(var(--line) 1px, transparent 1px), radial-gradient(circle at 30% 20%, rgba(43,200,183,0.22), transparent 60%)",
            backgroundSize: "14px 14px, 100% 100%",
          }}
        />
      )}
      <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to top, rgba(2,6,15,0.45) 0%, transparent 50%)" }} />
    </div>
  )
}

const CARD =
  "group relative flex flex-col overflow-hidden rounded-[24px] border border-[var(--line)] bg-[var(--card)] shadow-[0_1px_2px_rgba(15,35,73,0.04)] transition-[border-color,box-shadow] duration-300 hover:border-[rgba(43,200,183,0.35)] hover:shadow-[0_0_40px_rgba(43,200,183,0.06)]"

export function PostCard({ post }: { post: BlogPostSummary }) {
  return (
    <article className={`${CARD} h-full`}>
      <Cover post={post} className="aspect-[16/9] border-b border-[var(--line)]" sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw" />
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between gap-3 mb-4">
          {post.categories[0] ? <CategoryChip category={post.categories[0]} /> : <span />}
          <span className="mono text-[11px] uppercase tracking-[0.12em] text-[var(--muted)]">{post.readingMinutes} min</span>
        </div>
        <h3 className="text-[20px] md:text-[21px] font-extrabold tracking-[-0.03em] leading-[1.25] text-[var(--ink)] group-hover:text-[var(--teal-300)] transition-colors">
          {/* Stretched link: the whole card is clickable, category chip stays its own link */}
          <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0">{post.title}</Link>
        </h3>
        <p className="mt-2 text-[14px] leading-[1.6] text-[var(--muted)] line-clamp-3">{post.excerpt}</p>
        <div className="mt-auto pt-5">
          <div className="flex items-center gap-2.5 pt-4 border-t border-[var(--line)]">
            {post.author && <Avatar author={post.author} size={24} />}
            <span className="text-[13px] font-semibold text-[var(--navy-700)] truncate">{post.author?.name}</span>
            <time dateTime={post.date} className="ml-auto mono text-[11px] uppercase tracking-[0.12em] text-[var(--muted)] whitespace-nowrap">{formatDate(post.date)}</time>
          </div>
        </div>
      </div>
    </article>
  )
}

export function FeaturedPost({ post }: { post: BlogPostSummary }) {
  return (
    <article className={`${CARD} lg:grid lg:grid-cols-12`}>
      <Cover post={post} className="aspect-[16/9] lg:aspect-auto lg:min-h-[380px] lg:col-span-7 border-b lg:border-b-0 lg:border-r border-[var(--line)]" sizes="(max-width: 1023px) 100vw, 60vw" />
      <div className="flex flex-col justify-center p-6 md:p-10 lg:col-span-5">
        <div className="flex items-center gap-3 mb-5">
          <span className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]">Latest</span>
          {post.categories[0] && <CategoryChip category={post.categories[0]} />}
        </div>
        <h2 className="text-[28px] md:text-[38px] font-extrabold tracking-[-0.04em] leading-[1.08] text-[var(--ink)] group-hover:text-[var(--teal-300)] transition-colors">
          <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0">{post.title}</Link>
        </h2>
        <p className="mt-4 text-[15px] leading-[1.65] text-[var(--muted)] line-clamp-4">{post.excerpt}</p>
        <div className="mt-6 flex items-center gap-3">
          {post.author && <Avatar author={post.author} size={32} />}
          <div className="min-w-0">
            <div className="text-[14px] font-semibold text-[var(--navy-700)] truncate">{post.author?.name}</div>
            <Meta post={post} />
          </div>
        </div>
      </div>
    </article>
  )
}

export function CategoryPills({ categories, activeSlug }: { categories: BlogCategory[]; activeSlug?: string }) {
  const pill = "inline-flex items-center rounded-full px-4 py-2 text-[13px] font-semibold transition-colors whitespace-nowrap"
  const on = `${pill} bg-[var(--teal-500)] text-[#04121F]`
  const off = `${pill} border border-[var(--line)] bg-[var(--chip)] text-[var(--navy-700)] hover:border-[rgba(43,200,183,0.35)] hover:text-[var(--ink)]`
  return (
    <nav aria-label="Blog categories" className="-mx-6 px-6 overflow-x-auto md:mx-0 md:px-0 md:overflow-visible">
      <ul className="flex gap-2 md:flex-wrap">
        <li><Link href="/blog" className={activeSlug ? off : on} aria-current={activeSlug ? undefined : "page"}>All posts</Link></li>
        {categories.map((c) => (
          <li key={c.id}>
            <Link href={`/blog/category/${c.slug}`} className={c.slug === activeSlug ? on : off} aria-current={c.slug === activeSlug ? "page" : undefined}>
              {c.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export function SearchForm({ defaultValue }: { defaultValue?: string }) {
  return (
    <form action="/blog" method="get" role="search" className="relative w-full md:w-[340px]">
      <label htmlFor="blog-search" className="sr-only">Search articles</label>
      <input
        id="blog-search"
        name="q"
        type="search"
        defaultValue={defaultValue}
        placeholder="Search articles"
        maxLength={100}
        className="h-12 w-full rounded-full border border-[var(--line)] bg-[var(--chip)] pl-5 pr-12 text-[14px] text-[var(--ink)] placeholder:text-[var(--muted)] outline-none focus:border-[rgba(43,200,183,0.55)] transition-colors"
      />
      <button type="submit" aria-label="Search" className="absolute right-1.5 top-1.5 h-9 w-9 rounded-full flex items-center justify-center text-[var(--teal-500)] hover:bg-[rgba(43,200,183,0.12)] transition-colors">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
      </button>
    </form>
  )
}

export function Pagination({ page, totalPages, hrefFor }: { page: number; totalPages: number; hrefFor: (page: number) => string }) {
  if (totalPages <= 1) return null
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
  const box = "h-11 min-w-11 px-3 inline-flex items-center justify-center rounded-full mono text-[12px] tracking-[0.1em] transition-colors"
  return (
    <nav aria-label="Pagination" className="mt-14 flex items-center justify-center gap-2">
      {page > 1 && <Link href={hrefFor(page - 1)} rel="prev" className={`${box} border border-[var(--line)] text-[var(--navy-700)] hover:text-[var(--ink)]`}>← Prev</Link>}
      {pages.map((p, i) => (
        <span key={p} className="flex items-center gap-2">
          {i > 0 && p - pages[i - 1] > 1 && <span className="text-[var(--muted)]">…</span>}
          <Link
            href={hrefFor(p)}
            aria-current={p === page ? "page" : undefined}
            className={p === page ? `${box} bg-[var(--teal-500)] text-[#04121F] font-semibold` : `${box} border border-[var(--line)] text-[var(--navy-700)] hover:text-[var(--ink)]`}
          >
            {String(p).padStart(2, "0")}
          </Link>
        </span>
      ))}
      {page < totalPages && <Link href={hrefFor(page + 1)} rel="next" className={`${box} border border-[var(--line)] text-[var(--navy-700)] hover:text-[var(--ink)]`}>Next →</Link>}
    </nav>
  )
}

export function AuthorBio({ author }: { author: BlogAuthor }) {
  return (
    <section aria-label="About the author" className="mt-14 flex flex-col sm:flex-row gap-5 rounded-[24px] border border-[var(--line)] bg-[var(--card)] p-6 md:p-8">
      <Avatar author={author} size={72} />
      <div>
        <div className="mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">About the author</div>
        <div className="mt-1 text-[20px] font-extrabold tracking-[-0.02em] text-[var(--ink)]">{author.name}</div>
        {author.bio && <p className="mt-2 text-[14px] leading-[1.65] text-[var(--muted)]">{author.bio}</p>}
      </div>
    </section>
  )
}

export function ShareLinks({ url, title }: { url: string; title: string }) {
  const u = encodeURIComponent(url)
  const t = encodeURIComponent(title)
  const links = [
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`, path: "M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.5h4V21H3zM9.5 9.5h3.8v1.6h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.1c0-1.22-.02-2.78-1.7-2.78-1.7 0-1.96 1.33-1.96 2.7V21h-4z" },
    { label: "X", href: `https://twitter.com/intent/tweet?url=${u}&text=${t}`, path: "M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.2L2 3h6.33l4.37 5.77zm-1.08 16.2h1.7L7.4 4.73H5.58z" },
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${u}`, path: "M13.5 21v-8h2.7l.4-3.2h-3.1V7.8c0-.92.26-1.55 1.58-1.55h1.68V3.4A22.6 22.6 0 0 0 14.3 3.3c-2.43 0-4.1 1.48-4.1 4.2v2.3H7.5V13h2.7v8z" },
  ]
  return (
    <div className="flex items-center gap-2">
      <span className="mono text-[11px] uppercase tracking-[0.16em] text-[var(--muted)] mr-1">Share</span>
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${l.label}`}
          className="h-9 w-9 rounded-full border border-[var(--line)] bg-[var(--chip)] flex items-center justify-center text-[var(--navy-700)] hover:text-[var(--teal-500)] hover:border-[rgba(43,200,183,0.35)] transition-colors"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d={l.path} /></svg>
        </a>
      ))}
    </div>
  )
}
