import type { LandingPagePuckData } from './types'
import { SECTION_COMPONENT_NAMES } from './types'

const MAX_DOCUMENT_BYTES = 1_000_000
const allowedComponents = new Set<string>(SECTION_COMPONENT_NAMES)

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function safeHref(value: string) {
  if (/^[\u0000-\u0020]/.test(value)) return false
  if (value.startsWith('#')) return true
  if (value.startsWith('/') && !value.startsWith('//') && !value.startsWith('/\\')) return true
  if (value.startsWith('mailto:') || value.startsWith('tel:')) return true
  try {
    return new URL(value).protocol === 'https:'
  } catch {
    return false
  }
}

function safeMediaUrl(value: string) {
  if (value.startsWith('/') && !value.startsWith('//') && !value.startsWith('/\\')) return true
  try {
    return new URL(value).protocol === 'https:'
  } catch {
    return false
  }
}

type PrimitiveKind = 'string' | 'number'

function validRecordArray(value: unknown, fields: Record<string, PrimitiveKind | 'strings'>) {
  return value === undefined || (Array.isArray(value) && value.every((item) => isRecord(item) && Object.entries(fields).every(([key, kind]) => {
    const fieldValue = item[key]
    if (kind === 'strings') return Array.isArray(fieldValue) && fieldValue.every((entry) => typeof entry === 'string')
    return typeof fieldValue === kind
  })))
}

function validStringArray(value: unknown) {
  return value === undefined || (Array.isArray(value) && value.every((item) => typeof item === 'string'))
}

function validateSectionProps(type: string, props: Record<string, unknown>) {
  switch (type) {
    case 'HeroSection':
      if (!validStringArray(props.phrases)) return 'Hero phrases are malformed'
      break
    case 'SystemsSection':
      if (!validRecordArray(props.systems, { id: 'string', num: 'string', label: 'string', title: 'string', description: 'string', imageUrl: 'string' })) return 'System cards are malformed'
      if (!validRecordArray(props.backgroundImages, { url: 'string', alt: 'string' })) return 'System background images are malformed'
      if ((props.systems as unknown[] | undefined)?.length !== 3 || (props.backgroundImages as unknown[] | undefined)?.length !== 6) return 'The systems section requires three cards and six background images'
      break
    case 'ProblemSolutionSection':
      if (!validRecordArray(props.problems, { id: 'string', num: 'string', label: 'string', title: 'string', detail: 'string', icon: 'string' })) return 'Problem cards are malformed'
      if ((props.problems as unknown[] | undefined)?.length !== 3) return 'The problem section requires three cards'
      if (props.solution !== undefined && (!isRecord(props.solution) || !validStringArray(props.solution.bullets))) return 'Solution content is malformed'
      break
    case 'HowItWorksSection':
      if (!validRecordArray(props.steps, { id: 'string', num: 'string', title: 'string', description: 'string', imageUrl: 'string' })) return 'How-it-works steps are malformed'
      break
    case 'ResultsSection':
      if (!validRecordArray(props.stats, { id: 'string', value: 'number', suffix: 'string', label: 'string', sub: 'string' })) return 'Result statistics are malformed'
      break
    case 'OurWorkSection':
      if (!validRecordArray(props.logos, { src: 'string', name: 'string', category: 'string' })) return 'Client logos are malformed'
      break
    case 'WhyMiduvaSection':
      if (!validRecordArray(props.differentiators, { id: 'string', num: 'string', title: 'string', subtitle: 'string', oldWay: 'string', newWay: 'string' })) return 'Differentiators are malformed'
      break
    case 'ServicesSection':
      if (!validRecordArray(props.categories, { id: 'string', title: 'string', items: 'strings', imageUrl: 'string' })) return 'Service categories are malformed'
      break
    case 'GrowthOsSection':
      if (!validRecordArray(props.modules, { name: 'string', tag: 'string', description: 'string', color: 'string', span: 'number', visual: 'string' })) return 'Growth OS modules are malformed'
      break
    case 'FaqSection':
      if (!validRecordArray(props.items, { id: 'string', num: 'string', question: 'string', answer: 'string' })) return 'FAQ items are malformed'
      break
    case 'FreeOfferSection':
      if (!validStringArray(props.includes)) return 'Free-offer items are malformed'
      break
    case 'ContactSection':
      if (!validRecordArray(props.contactInfo, { icon: 'string', label: 'string' })) return 'Contact information is malformed'
      if (!validRecordArray(props.trustStats, { stat: 'string', label: 'string' })) return 'Contact statistics are malformed'
      if (!validRecordArray(props.serviceOptions, { value: 'string', label: 'string' })) return 'Contact service options are malformed'
      break
    case 'FooterSection':
      if (!validStringArray(props.marqueeItems)) return 'Footer marquee items are malformed'
      if (!validRecordArray(props.primaryCtas, { label: 'string', href: 'string' }) || !validRecordArray(props.secondaryLinks, { label: 'string', href: 'string' })) return 'Footer links are malformed'
      break
  }
  return null
}

function inspectValue(value: unknown, key = '', depth = 0): string | null {
  if (depth > 12) return 'Document nesting is too deep'
  if (typeof value === 'string') {
    if (value.length > 10_000) return `Field ${key || 'value'} is too long`
    if (/href$/i.test(key) && !safeHref(value)) return `Unsafe link in ${key}`
    if (/(src|url)$/i.test(key) && value && !safeMediaUrl(value)) return `Unsafe media URL in ${key}`
    return null
  }
  if (typeof value === 'number' && !Number.isFinite(value)) return `Invalid number in ${key}`
  if (Array.isArray(value)) {
    if (value.length > 30) return `Too many items in ${key || 'list'}`
    for (const item of value) {
      const error = inspectValue(item, key, depth + 1)
      if (error) return error
    }
    return null
  }
  if (isRecord(value)) {
    for (const [childKey, childValue] of Object.entries(value)) {
      const error = inspectValue(childValue, childKey, depth + 1)
      if (error) return error
    }
  }
  return null
}

function validateSlots(rootProps: Record<string, unknown>) {
  const before = rootProps.beforeDashboard
  const after = rootProps.afterDashboard
  if (!Array.isArray(before) || !Array.isArray(after)) return 'Both protected dashboard slots are required'

  const seen = new Set<string>()
  for (const component of [...before, ...after]) {
    if (!isRecord(component) || typeof component.type !== 'string' || !isRecord(component.props)) {
      return 'A landing-page section is malformed'
    }
    if (!allowedComponents.has(component.type)) return `Unknown section type: ${component.type}`
    if (seen.has(component.type)) return `Section ${component.type} can only appear once`
    seen.add(component.type)
    if (typeof component.props.id !== 'string' || !component.props.id) return `Section ${component.type} is missing its ID`
    const propsError = validateSectionProps(component.type, component.props)
    if (propsError) return propsError
  }
  return null
}

export function validateLandingPageData(input: unknown): { ok: true; data: LandingPagePuckData } | { ok: false; error: string } {
  let serialized = ''
  try {
    serialized = JSON.stringify(input)
  } catch {
    return { ok: false, error: 'Document is not valid JSON' }
  }
  if (Buffer.byteLength(serialized, 'utf8') > MAX_DOCUMENT_BYTES) return { ok: false, error: 'Document exceeds the 1 MB limit' }
  if (!isRecord(input) || !Array.isArray(input.content) || !isRecord(input.root)) return { ok: false, error: 'Invalid Puck document' }
  if (input.content.length > 0) return { ok: false, error: 'Sections must stay inside the protected landing-page slots' }

  const rootProps = isRecord(input.root.props) ? input.root.props : input.root
  if (!isRecord(rootProps.dashboard)) return { ok: false, error: 'Protected dashboard data is required' }

  const slotError = validateSlots(rootProps)
  if (slotError) return { ok: false, error: slotError }

  const dashboard = rootProps.dashboard
  if (!validStringArray(dashboard.navItems) || !validStringArray(dashboard.rangeLabels) || !validStringArray(dashboard.chartLegend) || !validStringArray(dashboard.chartAxisLabels) || !validStringArray(dashboard.chartWeekLabels)) {
    return { ok: false, error: 'Dashboard labels are malformed' }
  }
  if (!validRecordArray(dashboard.clients, { initials: 'string', name: 'string' }) || !validRecordArray(dashboard.kpis, { label: 'string', value: 'string', delta: 'string', color: 'string' }) || !validRecordArray(dashboard.funnelStages, { name: 'string', value: 'string' })) {
    return { ok: false, error: 'Dashboard records are malformed' }
  }
  if (Array.isArray(dashboard.kpis) && (dashboard.kpis.length < 1 || dashboard.kpis.length > 4)) return { ok: false, error: 'Dashboard supports one to four KPIs' }
  if (Array.isArray(dashboard.kpis) && dashboard.kpis.some((kpi) => !isRecord(kpi) || !['teal', 'navy'].includes(String(kpi.color)))) {
    return { ok: false, error: 'Dashboard KPI colors are invalid' }
  }
  if (dashboard.activeRangeIndex !== undefined && (!Number.isInteger(dashboard.activeRangeIndex) || Number(dashboard.activeRangeIndex) < 0 || (Array.isArray(dashboard.rangeLabels) && Number(dashboard.activeRangeIndex) >= dashboard.rangeLabels.length))) {
    return { ok: false, error: 'Dashboard active range is invalid' }
  }
  if (Array.isArray(dashboard.chartValues)) {
    if (dashboard.chartValues.length < 1 || dashboard.chartValues.length > 24) return { ok: false, error: 'Dashboard supports one to 24 chart values' }
    if (dashboard.chartValues.some((value) => typeof value !== 'number' || value < 0 || value > 120)) {
      return { ok: false, error: 'Dashboard chart values must be between 0 and 120' }
    }
  }
  if (typeof dashboard.automationHealth === 'number' && (dashboard.automationHealth < 0 || dashboard.automationHealth > 100)) {
    return { ok: false, error: 'Automation health must be between 0 and 100' }
  }

  const valueError = inspectValue(input)
  if (valueError) return { ok: false, error: valueError }
  return { ok: true, data: input as LandingPagePuckData }
}
