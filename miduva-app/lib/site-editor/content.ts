import type { LandingPagePuckData, LandingPageRootProps } from '@/lib/puck/types'
import { NATIVE_SLOT_SPECS } from '@/lib/puck/native-slots'
import { isSectionType, type SectionType } from './schema'

// The editor and the public renderer work with this flat shape. It is stored in
// the existing page document format, so saved drafts, published pages and
// revisions from before the editor switch keep working unchanged.

export type SectionEntry = {
  id: string
  type: SectionType
  hidden?: boolean
  props: Record<string, unknown>
}

export type SiteSettings = Omit<LandingPageRootProps, 'beforeDashboard' | 'afterDashboard'>

export type LandingContent = {
  settings: SiteSettings
  sections: SectionEntry[]
}

type StoredSection = { type: string; props?: Record<string, unknown> }

const slotProps = new Set(NATIVE_SLOT_SPECS.map((spec) => spec.slotProp))

export function contentFromDocument(data: LandingPagePuckData): LandingContent {
  const { beforeDashboard, afterDashboard, ...settings } = (data.root?.props ?? {}) as LandingPageRootProps
  const stored = [...((beforeDashboard ?? []) as unknown as StoredSection[]), ...((afterDashboard ?? []) as unknown as StoredSection[])]
  const sections: SectionEntry[] = []
  for (const section of stored) {
    if (!section || !isSectionType(section.type)) continue
    const { id, hidden, ...rest } = section.props ?? {}
    const props: Record<string, unknown> = {}
    // Plain item arrays are the source of truth; the stored slot copies are regenerated on save.
    for (const [key, value] of Object.entries(rest)) if (!slotProps.has(key)) props[key] = value
    sections.push({ id: typeof id === 'string' && id ? id : `${section.type}-${sections.length}`, type: section.type, hidden: hidden === true || undefined, props })
  }
  return { settings: settings as SiteSettings, sections }
}

export function documentFromContent(content: LandingContent): LandingPagePuckData {
  return {
    content: [],
    root: {
      props: {
        ...content.settings,
        beforeDashboard: content.sections.map((section) => ({
          type: section.type,
          props: { ...section.props, id: section.id, ...(section.hidden ? { hidden: true } : {}) },
        })),
        afterDashboard: [],
      },
    },
  } as unknown as LandingPagePuckData
}
