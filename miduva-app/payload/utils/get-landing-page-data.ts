import type { LandingPageData } from '@/lib/types'
import { getPayload } from './get-payload'

type MediaDoc = { url?: string | null }

function mediaUrl(field: unknown): string {
  if (field && typeof field === 'object' && 'url' in field) {
    return (field as MediaDoc).url ?? ''
  }
  return ''
}

function extractStrings(
  arr: Array<{ phrase?: string; text?: string; item?: string } | string> | null | undefined,
): string[] {
  if (!arr || arr.length === 0) return []
  return arr
    .map((entry) => {
      if (typeof entry === 'string') return entry
      return entry.phrase ?? entry.text ?? entry.item ?? ''
    })
    .filter(Boolean)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyDoc = Record<string, any>

export async function getLandingPageData(): Promise<LandingPageData> {
  try {
    const payload = await getPayload()
    const doc = (await payload.findGlobal({
      slug: 'landing-page',
      depth: 1,
    })) as AnyDoc | null

    if (!doc) return {}

    const data: LandingPageData = {}

    // ── nav ────────────────────────────────────────────────────────────────
    if (doc.nav) {
      data.nav = {
        leftLinks: doc.nav.leftLinks ?? [],
        rightLinks: doc.nav.rightLinks ?? [],
      }
    }

    // ── kpis ───────────────────────────────────────────────────────────────
    if (doc.kpis?.length) {
      data.kpis = doc.kpis.map((k: AnyDoc) => ({ key: k.key, value: k.value }))
    }

    // ── hero ───────────────────────────────────────────────────────────────
    if (doc.hero) {
      data.hero = {
        headline: doc.hero.headline ?? undefined,
        tagline: doc.hero.tagline ?? undefined,
        body: doc.hero.body ?? undefined,
        phrases: extractStrings(doc.hero.phrases),
        primaryCta: doc.hero.primaryCta ?? undefined,
        secondaryCta: doc.hero.secondaryCta ?? undefined,
      }
    }

    // ── systems ────────────────────────────────────────────────────────────
    if (doc.systems) {
      data.systems = {
        eyebrow: doc.systems.eyebrow ?? undefined,
        headline: doc.systems.headline ?? undefined,
        headlineAccent: doc.systems.headlineAccent ?? undefined,
        systems: (doc.systems.systems ?? []).map((s: AnyDoc) => ({
          id: s.id,
          num: s.num,
          label: s.label,
          title: s.title,
          description: s.description ?? '',
          imageUrl: mediaUrl(s.image),
        })),
      }
    }

    // ── problemSolution ────────────────────────────────────────────────────
    if (doc.problemSolution) {
      const ps = doc.problemSolution
      data.problemSolution = {
        problemEyebrow: ps.problemEyebrow ?? undefined,
        problemHeadline: ps.problemHeadline ?? undefined,
        problems: (ps.problems ?? []).map((p: AnyDoc) => ({
          id: p.id,
          num: p.num,
          label: p.label,
          title: p.title,
          detail: p.detail ?? '',
          icon: p.icon as 'close' | 'alert',
        })),
        solution: ps.solution
          ? {
              headline: ps.solution.headline ?? undefined,
              headlineAccent: ps.solution.headlineAccent ?? undefined,
              subheadline: ps.solution.subheadline ?? undefined,
              bullets: extractStrings(ps.solution.bullets),
              ctaLabel: ps.solution.ctaLabel ?? undefined,
              ctaHref: ps.solution.ctaHref ?? undefined,
              bottomNote: ps.solution.bottomNote ?? undefined,
            }
          : undefined,
      }
    }

    // ── results ────────────────────────────────────────────────────────────
    if (doc.results) {
      data.results = {
        eyebrow: doc.results.eyebrow ?? undefined,
        headline: doc.results.headline ?? undefined,
        subheadline: doc.results.subheadline ?? undefined,
        stats: (doc.results.stats ?? []).map((s: AnyDoc) => ({
          id: s.id,
          value: s.value,
          suffix: s.suffix,
          label: s.label,
          sub: s.sub,
        })),
        trustNote: doc.results.trustNote ?? undefined,
        ctaLabel: doc.results.ctaLabel ?? undefined,
        ctaHref: doc.results.ctaHref ?? undefined,
      }
    }

    // ── parallax ───────────────────────────────────────────────────────────
    if (doc.parallax) {
      data.parallax = {
        eyebrow: doc.parallax.eyebrow ?? undefined,
        headline: doc.parallax.headline ?? undefined,
        description: doc.parallax.description ?? undefined,
        pipelineLabel: doc.parallax.pipelineLabel ?? undefined,
        pipelineValue: doc.parallax.pipelineValue ?? undefined,
        pipelineDelta: doc.parallax.pipelineDelta ?? undefined,
        bottomLabel: doc.parallax.bottomLabel ?? undefined,
        bottomDescription: doc.parallax.bottomDescription ?? undefined,
      }
    }

    // ── whyMiduva ──────────────────────────────────────────────────────────
    if (doc.whyMiduva) {
      data.whyMiduva = {
        eyebrow: doc.whyMiduva.eyebrow ?? undefined,
        differentiators: (doc.whyMiduva.differentiators ?? []).map((d: AnyDoc) => ({
          id: d.id,
          num: d.num,
          title: d.title,
          subtitle: d.subtitle,
          oldWay: d.oldWay,
          newWay: d.newWay,
        })),
      }
    }

    // ── howItWorks ─────────────────────────────────────────────────────────
    if (doc.howItWorks) {
      data.howItWorks = {
        eyebrow: doc.howItWorks.eyebrow ?? undefined,
        headline: doc.howItWorks.headline ?? undefined,
        steps: (doc.howItWorks.steps ?? []).map((s: AnyDoc) => ({
          id: s.id,
          num: s.num,
          title: s.title,
          description: s.description ?? '',
          imageUrl: mediaUrl(s.image),
        })),
      }
    }

    // ── services ───────────────────────────────────────────────────────────
    if (doc.services) {
      data.services = {
        eyebrow: doc.services.eyebrow ?? undefined,
        headline: doc.services.headline ?? undefined,
        headlineAccent: doc.services.headlineAccent ?? undefined,
        ctaLabel: doc.services.ctaLabel ?? undefined,
        ctaHref: doc.services.ctaHref ?? undefined,
        categories: (doc.services.categories ?? []).map((c: AnyDoc) => ({
          id: c.id,
          title: c.title,
          items: extractStrings(c.items),
          imageUrl: mediaUrl(c.image),
        })),
      }
    }

    // ── faq ────────────────────────────────────────────────────────────────
    if (doc.faq?.items?.length) {
      data.faq = {
        items: (doc.faq.items ?? []).map((item: AnyDoc) => ({
          id: item.id,
          num: item.num,
          question: item.question,
          answer: item.answer ?? '',
        })),
      }
    }

    return data
  } catch (error) {
    console.error('[getLandingPageData] Failed to fetch from Payload:', error)
    return {}
  }
}
