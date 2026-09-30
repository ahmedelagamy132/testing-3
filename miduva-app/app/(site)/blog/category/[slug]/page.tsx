import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { PostListView } from "@/components/blog/post-list-view"
import { getSiteChrome } from "@/lib/blog-chrome"
import { getCategories, getCategoryBySlug, getPosts } from "@/lib/wordpress"
import { SITE_NAME } from "@/lib/seo"

type Params = Promise<{ slug: string }>
type Search = Promise<{ page?: string }>

function parsePage(value?: string) {
  const n = Number(value)
  return Number.isInteger(n) && n > 1 ? Math.min(n, 1000) : 1
}

function describe(name: string, description: string) {
  return description || `${name} guides and playbooks from the Miduva team — practical advice for building a growth system that brings in customers.`
}

export async function generateMetadata({ params, searchParams }: { params: Params; searchParams: Search }): Promise<Metadata> {
  const [{ slug }, { page: rawPage }] = await Promise.all([params, searchParams])
  const category = await getCategoryBySlug(slug)
  if (!category) return { title: `Not found | ${SITE_NAME}`, robots: { index: false } }
  const page = parsePage(rawPage)
  const path = `/blog/category/${category.slug}`
  const title = `${category.name} Articles${page > 1 ? ` — Page ${page}` : ""}`
  const description = describe(category.name, category.description)
  return {
    title: `${title} | ${SITE_NAME} Blog`,
    description,
    alternates: { canonical: page > 1 ? `${path}?page=${page}` : path },
    openGraph: { type: "website", url: path, siteName: SITE_NAME, title, description, locale: "en_US" },
    twitter: { card: "summary_large_image", title, description },
  }
}

export default async function CategoryPage({ params, searchParams }: { params: Params; searchParams: Search }) {
  const [{ slug }, { page: rawPage }] = await Promise.all([params, searchParams])
  const category = await getCategoryBySlug(slug)
  if (!category) notFound()
  const page = parsePage(rawPage)
  const [chrome, categories, result] = await Promise.all([getSiteChrome(), getCategories(), getPosts({ page, categoryId: category.id })])
  if (page > 1 && result.posts.length === 0) notFound()

  return (
    <PostListView
      chrome={chrome}
      categories={categories}
      result={result}
      page={page}
      basePath={`/blog/category/${category.slug}`}
      category={category}
      heading={{
        eyebrow: "/ category",
        title: category.name,
        accent: "",
        description: describe(category.name, category.description),
      }}
    />
  )
}
