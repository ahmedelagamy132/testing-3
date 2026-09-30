import type { LandingPagePuckData } from './types'

type SectionRecord = {
  type: string
  props: Record<string, unknown>
}

type NativeSlotSpec = {
  sectionType: string
  legacyProp: string
  slotProp: string
  itemType: string
  hasDomainId: boolean
}

export const NATIVE_SLOT_SPECS: readonly NativeSlotSpec[] = [
  { sectionType: 'SystemsSection', legacyProp: 'systems', slotProp: 'systemItems', itemType: 'SystemCardItem', hasDomainId: true },
  { sectionType: 'SystemsSection', legacyProp: 'backgroundImages', slotProp: 'systemBackgroundItems', itemType: 'SystemBackgroundItem', hasDomainId: false },
  { sectionType: 'ProblemSolutionSection', legacyProp: 'problems', slotProp: 'problemItems', itemType: 'ProblemCardItem', hasDomainId: true },
  { sectionType: 'HowItWorksSection', legacyProp: 'steps', slotProp: 'stepItems', itemType: 'HowStepItem', hasDomainId: true },
  { sectionType: 'ResultsSection', legacyProp: 'stats', slotProp: 'statItems', itemType: 'ResultStatItem', hasDomainId: true },
  { sectionType: 'OurWorkSection', legacyProp: 'logos', slotProp: 'logoItems', itemType: 'ClientLogoItem', hasDomainId: false },
  { sectionType: 'WhyMiduvaSection', legacyProp: 'differentiators', slotProp: 'differentiatorItems', itemType: 'DifferentiatorItem', hasDomainId: true },
  { sectionType: 'ServicesSection', legacyProp: 'categories', slotProp: 'serviceItems', itemType: 'ServiceCategoryItem', hasDomainId: true },
  { sectionType: 'GrowthOsSection', legacyProp: 'modules', slotProp: 'moduleItems', itemType: 'GrowthModuleItem', hasDomainId: false },
  { sectionType: 'FaqSection', legacyProp: 'items', slotProp: 'faqItems', itemType: 'FaqItem', hasDomainId: true },
] as const

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function safeToken(value: unknown, fallback: string) {
  const token = typeof value === 'string' ? value.trim().replace(/[^a-zA-Z0-9_-]+/g, '-').replace(/^-+|-+$/g, '') : ''
  return token || fallback
}

function itemId(item: Record<string, unknown>, index: number, hasDomainId: boolean) {
  if (hasDomainId) return safeToken(item.id, `item-${index + 1}`)
  return safeToken(item.name ?? item.label ?? item.alt ?? item.title, `item-${index + 1}`) + `-${index + 1}`
}

export function withNativeItemSlots(sectionType: string, inputProps: Record<string, unknown>, sectionId = sectionType) {
  const props = structuredClone(inputProps)
  const specs = NATIVE_SLOT_SPECS.filter((spec) => spec.sectionType === sectionType)

  for (const spec of specs) {
    const existingSlot = props[spec.slotProp]
    if (Array.isArray(existingSlot)) {
      const legacyItems = existingSlot.map((component) => {
        if (!isRecord(component) || !isRecord(component.props)) return null
        const { id: _componentId, itemId: nativeId, ...item } = component.props
        void _componentId
        return spec.hasDomainId ? { id: nativeId, ...item } : item
      }).filter(isRecord)
      props[spec.legacyProp] = legacyItems
      continue
    }

    const legacyValue = props[spec.legacyProp]
    const legacyItems = Array.isArray(legacyValue) ? legacyValue.filter(isRecord) : []
    props[spec.slotProp] = legacyItems.map((legacyItem, index) => {
      const nativeId = itemId(legacyItem, index, spec.hasDomainId)
      const { id: _domainId, ...item } = legacyItem
      void _domainId
      return {
        type: spec.itemType,
        props: {
          id: `${safeToken(sectionId, sectionType)}-${spec.slotProp}-${nativeId}`,
          itemId: nativeId,
          ...item,
        },
      }
    })
  }

  return props
}

export function migrateNativeItemSlots(input: LandingPagePuckData): LandingPagePuckData {
  const data = structuredClone(input)
  const rootProps = data.root?.props
  if (!rootProps) return data

  for (const slotName of ['beforeDashboard', 'afterDashboard'] as const) {
    const slot = rootProps[slotName]
    if (!Array.isArray(slot)) continue
    for (const component of slot as unknown as SectionRecord[]) {
      if (!component || typeof component.type !== 'string' || !isRecord(component.props)) continue
      const sectionId = typeof component.props.id === 'string' ? component.props.id : component.type
      component.props = withNativeItemSlots(component.type, component.props, sectionId)
    }
  }

  return data
}

export function validateNativeItemSlots(sectionType: string, props: Record<string, unknown>) {
  for (const spec of NATIVE_SLOT_SPECS.filter((entry) => entry.sectionType === sectionType)) {
    const slot = props[spec.slotProp]
    if (!Array.isArray(slot)) return `${spec.slotProp} is required`
    const seen = new Set<string>()
    for (const component of slot) {
      if (!isRecord(component) || component.type !== spec.itemType || !isRecord(component.props)) {
        return `${spec.slotProp} contains an invalid component`
      }
      const nativeId = component.props.itemId
      if (typeof component.props.id !== 'string' || !component.props.id || typeof nativeId !== 'string' || !nativeId) {
        return `${spec.slotProp} contains an item without an ID`
      }
      if (seen.has(nativeId)) return `${spec.slotProp} contains duplicate item IDs`
      seen.add(nativeId)
    }
  }
  return null
}
