import type { LandingPageData, SectionId } from '@/lib/types'

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
type LayoutSection = { id: SectionId; visible: boolean }

const DEFAULT_SECTION_IDS: SectionId[] = [
  'hero',
  'systems',
  'problem-solution',
  'how-it-works',
  'results',
  'our-work',
  'why-miduva',
  'parallax',
  'dashboard',
  'services',
  'growth-os',
  'faq',
  'free-offer',
  'contact',
  'footer',
]

export function transformLandingPage(doc: AnyDoc | null | undefined): LandingPageData {
  if (!doc) return {}

  const data: LandingPageData = {}

  if (doc.branding) {
    data.branding = {
      logoDarkUrl: mediaUrl(doc.branding.logoDark) || undefined,
      logoLightUrl: mediaUrl(doc.branding.logoLight) || undefined,
    }
  }

  if (doc.nav) {
    data.nav = {
      leftLinks: doc.nav.leftLinks ?? [],
      rightLinks: doc.nav.rightLinks ?? [],
    }
  }

  if (doc.hero) {
    data.hero = {
      headline: doc.hero.headline ?? undefined,
      tagline: doc.hero.tagline ?? undefined,
      body: doc.hero.body ?? undefined,
      phrases: extractStrings(doc.hero.phrases),
      primaryCta: doc.hero.primaryCta ?? undefined,
      secondaryCta: doc.hero.secondaryCta ?? undefined,
      illustrationDarkUrl: mediaUrl(doc.hero.illustrationDark) || undefined,
      illustrationLightUrl: mediaUrl(doc.hero.illustrationLight) || undefined,
    }
  }

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
      backgroundImages: (doc.systems.backgroundImages ?? [])
        .map((b: AnyDoc) => ({
          url: mediaUrl(b.image),
          alt:
            (b.image && typeof b.image === 'object' && 'alt' in b.image
              ? ((b.image as AnyDoc).alt as string | undefined)
              : undefined) ?? '',
        }))
        .filter((b: { url: string }) => Boolean(b.url)),
    }
  }

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

  if (doc.dashboard) {
    const d = doc.dashboard
    data.dashboard = {
      urlLabel: d.urlLabel ?? undefined,
      statusLabel: d.statusLabel ?? undefined,
      navItems: (d.navItems ?? []).map((n: AnyDoc) => n.label).filter(Boolean),
      clients: (d.clients ?? []).map((c: AnyDoc) => ({ initials: c.initials, name: c.name })),
      eyebrow: d.eyebrow ?? undefined,
      title: d.title ?? undefined,
      kpis: (d.kpis ?? []).map((k: AnyDoc) => ({
        label: k.label,
        value: k.value,
        delta: k.delta,
        color: (k.color as 'teal' | 'navy') ?? 'teal',
      })),
      chartTitle: d.chartTitle ?? undefined,
      chartSubtitle: d.chartSubtitle ?? undefined,
      funnelTitle: d.funnelTitle ?? undefined,
      funnelStages: (d.funnelStages ?? []).map((s: AnyDoc) => ({ name: s.name, value: s.value })),
    }
  }

  if (doc.growthOs) {
    const g = doc.growthOs
    data.growthOs = {
      eyebrow: g.eyebrow ?? undefined,
      headline: g.headline ?? undefined,
      headlineAccent: g.headlineAccent ?? undefined,
      description: g.description ?? undefined,
      ctaLabel: g.ctaLabel ?? undefined,
      ctaHref: g.ctaHref ?? undefined,
      modules: (g.modules ?? []).map((m: AnyDoc) => ({
        name: m.name,
        tag: m.tag,
        description: m.description,
        color: (m.color as 'teal' | 'navy') ?? 'teal',
        span: (Number(m.span) === 2 ? 2 : 1) as 1 | 2,
        visual: m.visual,
      })),
    }
  }

  if (doc.freeOffer) {
    const f = doc.freeOffer
    data.freeOffer = {
      eyebrow: f.eyebrow ?? undefined,
      headlineLine1: f.headlineLine1 ?? undefined,
      headlineAccent: f.headlineAccent ?? undefined,
      headlineLine3: f.headlineLine3 ?? undefined,
      includes: (f.includes ?? []).map((i: AnyDoc) => i.label).filter(Boolean),
      ctaLabel: f.ctaLabel ?? undefined,
      ctaHref: f.ctaHref ?? undefined,
      trustNote: f.trustNote ?? undefined,
    }
  }

  if (doc.contact) {
    const c = doc.contact
    data.contact = {
      eyebrow: c.eyebrow ?? undefined,
      headline: c.headline ?? undefined,
      headlineAccent: c.headlineAccent ?? undefined,
      body: c.body ?? undefined,
      contactInfo: (c.contactInfo ?? []).map((row: AnyDoc) => ({
        icon: (row.icon as 'mail' | 'building') ?? 'mail',
        label: row.label,
      })),
      trustStats: (c.trustStats ?? []).map((s: AnyDoc) => ({ stat: s.stat, label: s.label })),
      formHeadline: c.formHeadline ?? undefined,
      formSubheadline: c.formSubheadline ?? undefined,
      serviceOptions: (c.serviceOptions ?? []).map((o: AnyDoc) => ({ value: o.value, label: o.label })),
      submitLabel: c.submitLabel ?? undefined,
      finePrint: c.finePrint ?? undefined,
    }
  }

  if (doc.footer) {
    const f = doc.footer
    data.footer = {
      giantBgText: f.giantBgText ?? undefined,
      heading: f.heading ?? undefined,
      marqueeItems: (f.marqueeItems ?? []).map((m: AnyDoc) => m.phrase).filter(Boolean),
      primaryCtas: (f.primaryCtas ?? []).map((l: AnyDoc) => ({ label: l.label, href: l.href })),
      secondaryLinks: (f.secondaryLinks ?? []).map((l: AnyDoc) => ({ label: l.label, href: l.href })),
      copyright: f.copyright ?? undefined,
      createdByLabel: f.createdByLabel ?? undefined,
    }
  }

  if (doc.layout?.sections && Array.isArray(doc.layout.sections)) {
    const sections: LayoutSection[] = doc.layout.sections
      .filter((row: AnyDoc) => row && typeof row.sectionId === 'string')
      .map((row: AnyDoc) => ({
        id: row.sectionId as SectionId,
        visible: row.visible !== false,
      }))
    const seen = new Set(sections.map((row) => row.id))

    if (!seen.has('our-work')) {
      const resultsIndex = sections.findIndex((row) => row.id === 'results')
      const insertAt = resultsIndex >= 0 ? resultsIndex + 1 : sections.length
      sections.splice(insertAt, 0, { id: 'our-work', visible: true })
      seen.add('our-work')
    }

    data.layout = {
      sections: [
        ...sections,
        ...DEFAULT_SECTION_IDS.filter((id) => !seen.has(id)).map((id) => ({ id, visible: true })),
      ],
    }
  }

  return data
}
