import type { LandingPagePuckData } from '@/lib/puck/types'

type PageRuntime = {
  document: Document
  window: Window & typeof globalThis
}

type SectionRecord = {
  type?: unknown
  props?: Record<string, unknown>
}

type EditableLink = {
  label?: unknown
  href?: unknown
}

const LEGACY_FOOTER_LINKS = [
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms of Service', href: '#' },
  { label: 'Support', href: '#' },
]

const WORKING_FOOTER_LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'Our Work', href: '#our-work' },
  { label: 'FAQ', href: '#faq' },
]

function anchorId(href: string) {
  if (!href.startsWith('#')) return null
  try {
    return decodeURIComponent(href.slice(1))
  } catch {
    return href.slice(1)
  }
}

export function findPageAnchor(document: Document, href: string) {
  const id = anchorId(href)
  if (id === null) return null
  if (!id) return document.getElementById('anchor-hero') ?? document.body

  // Puck wraps every section in an anchor with the header offset applied.
  // Prefer it over a nested section that happens to expose the same public ID.
  return document.getElementById(`anchor-${id}`) ?? document.getElementById(id)
}

export function scrollToPageAnchor(runtime: PageRuntime, href: string) {
  const target = findPageAnchor(runtime.document, href)
  if (!target) return false

  const reduceMotion = runtime.window.matchMedia('(prefers-reduced-motion: reduce)').matches
  target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })

  const id = anchorId(href)
  if (id && runtime.window.location.hash !== href) {
    runtime.window.history.pushState(null, '', href)
  }

  return true
}

function matchesLinks(value: unknown, expected: readonly { label: string; href: string }[]) {
  if (!Array.isArray(value) || value.length !== expected.length) return false
  return expected.every((expectedLink, index) => {
    const link = value[index] as EditableLink | undefined
    return link?.label === expectedLink.label && link.href === expectedLink.href
  })
}

function sectionRecords(data: LandingPagePuckData) {
  const rootProps = data.root?.props
  if (!rootProps) return []
  return [...(rootProps.beforeDashboard ?? []), ...(rootProps.afterDashboard ?? [])] as SectionRecord[]
}

/** Repairs only the exact placeholder links shipped by earlier Miduva builds. */
export function migrateLegacyPageLinks(input: LandingPagePuckData): LandingPagePuckData {
  const data = structuredClone(input)
  const rootProps = data.root?.props

  const getStartedNavLink = rootProps?.nav?.rightLinks?.find(
    (link) => link.label === 'Get Started' && link.href === '#cta',
  )
  if (getStartedNavLink) getStartedNavLink.href = '#contact'

  // The Why Miduva section was retired; drop it from saved pages and point
  // the About link at the Miduva Difference (parallax) section instead.
  if (rootProps) {
    for (const zone of ['beforeDashboard', 'afterDashboard'] as const) {
      const sections = rootProps[zone]
      if (sections) rootProps[zone] = sections.filter((section) => section.type !== 'WhyMiduvaSection') as typeof sections
    }
    for (const link of [...(rootProps.nav?.leftLinks ?? []), ...(rootProps.nav?.rightLinks ?? [])]) {
      if (link.href === '#why-miduva') link.href = '#parallax'
    }
  }

  for (const component of sectionRecords(data)) {
    if (!component.props) continue

    if (component.type === 'HeroSection') {
      const primaryCta = component.props.primaryCta as EditableLink | undefined
      if (primaryCta?.label === 'Get Started' && (primaryCta.href === '#get-started' || primaryCta.href === '#contact')) {
        primaryCta.label = 'Let’s talk!'
        primaryCta.href = '#lets-talk'
      }
      // Hero buttons now mirror NP Digital's "RFP" / "Let's talk!" pair, each
      // opening a lead form modal. Only the stock labels are replaced.
      const secondaryCta = component.props.secondaryCta as EditableLink | undefined
      if (secondaryCta?.label === 'See Our Work' && secondaryCta.href === '#our-work') {
        secondaryCta.label = 'RFP'
        secondaryCta.href = '#rfp'
      }
    }

    if (component.type === 'FreeOfferSection' && component.props.ctaHref === '#cta') {
      component.props.ctaHref = '#contact'
    }

    if (component.type === 'FooterSection') {
      const primaryCtas = component.props.primaryCtas as EditableLink[] | undefined
      primaryCtas?.forEach((link) => {
        if ((link.label === 'Book a Free Call' || link.label === 'Get Started') && link.href === '#') {
          link.href = '#contact'
        }
      })

      if (matchesLinks(component.props.secondaryLinks, LEGACY_FOOTER_LINKS)) {
        component.props.secondaryLinks = structuredClone(WORKING_FOOTER_LINKS)
      }
    }
  }

  return data
}
