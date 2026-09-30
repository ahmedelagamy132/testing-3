import 'server-only'

import { getPublishedLandingPageData } from '@/lib/puck/storage'
import { contentFromDocument } from '@/lib/site-editor/content'
import type { BrandingData, FooterData, NavData } from '@/lib/types'

export type SiteChrome = { nav?: NavData; branding?: BrandingData; footer?: FooterData }

type Link = { label: string; href: string }

// Landing-page links are in-page anchors (#services). From /blog they must
// point back at the home page instead.
function toSiteLink<T extends Link>(link: T): T {
  return link.href.startsWith('#') ? { ...link, href: `/${link.href}` } : link
}

/** Nav, branding and footer exactly as published in the site editor. */
export async function getSiteChrome(): Promise<SiteChrome> {
  try {
    const { settings, sections } = contentFromDocument(await getPublishedLandingPageData())
    const footer = sections.find((section) => section.type === 'FooterSection' && !section.hidden)?.props as FooterData | undefined
    return {
      nav: settings.nav
        ? { leftLinks: settings.nav.leftLinks?.map(toSiteLink), rightLinks: settings.nav.rightLinks?.map(toSiteLink) }
        : undefined,
      branding: settings.branding,
      footer: footer
        ? { ...footer, primaryCtas: footer.primaryCtas?.map(toSiteLink), secondaryLinks: footer.secondaryLinks?.map(toSiteLink) }
        : undefined,
    }
  } catch (error) {
    console.error('[blog] could not load site chrome:', error)
    return {}
  }
}
