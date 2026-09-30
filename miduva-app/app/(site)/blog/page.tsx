import type { Metadata } from "next"
import { PostListView } from "@/components/blog/post-list-view"
import { getSiteChrome } from "@/lib/blog-chrome"
import { getCategories, getPosts } from "@/lib/wordpress"
import { SITE_NAME } from "@/lib/seo"

type Search = Promise<{ page?: string; q?: string }>

const TITLE = "Growth Marketing Blog — Ads, Funnels, Automation & Data"
const DESCRIPTION =
  "Practical guides on paid ads, conversion funnels, marketing automation, SEO and analytics — how to build a growth system that brings in customers on repeat."

function parsePage(value?: string) {
  const n = Number(value)
  return Number.isInteger(n) && n > 1 ? Math.min(n, 1000) : 1
}

export async function generateMetadata({ searchParams }: { searchParams: Search }): Promise<Metadata> {
  const { page: rawPage, q } = await searchParams
  const page = parsePage(rawPage)
  const search = q?.trim()
  const title = page > 1 ? `${TITLE} — Page ${page}` : TITLE
  return {
    title: `${title} | ${SITE_NAME}`,
    description: DESCRIPTION,
    alternates: {
      canonical: page > 1 ? `/blog?page=${page}` : "/blog",
      types: { "application/rss+xml": [{ url: "/blog/rss.xml", title: `${SITE_NAME} Blog` }] },
    },
    // Search results are thin, duplicate listings — keep them out of the index.
    robots: search ? { index: false, follow: true } : undefined,
    openGraph: { type: "website", url: "/blog", siteName: SITE_NAME, title, description: DESCRIPTION, locale: "en_US" },
    twitter: { card: "summary_large_image", title, description: DESCRIPTION },
  }
}

export default async function BlogIndex({ searchParams }: { searchParams: Search }) {
  const { page: rawPage, q } = await searchParams
  const page = parsePage(rawPage)
  const search = q?.trim().slice(0, 100) || undefined
  const [chrome, categories, result] = await Promise.all([getSiteChrome(), getCategories(), getPosts({ page, search })])

  return (
    <PostListView
      chrome={chrome}
      categories={categories}
      result={result}
      page={page}
      basePath="/blog"
      search={search}
      heading={{
        eyebrow: "/ the miduva blog",
        title: "Growth insights",
        accent: "that compound.",
        description: "Ads, funnels, automation and data — practical playbooks for building a growth system that brings in customers on repeat.",
      }}
    />
  )
}
