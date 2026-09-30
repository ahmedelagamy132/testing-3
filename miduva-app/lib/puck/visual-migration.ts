import type { LandingPagePuckData } from './types'

// Existing Puck pages keep their saved content. Only bundled stock-image choices
// are upgraded; images that an editor selected remain untouched.
const visualById: Record<string, string> = {
  'growth-marketing': '/assets/visuals/growth-marketing.webp',
  'conversion-funnels': '/assets/visuals/conversion-funnels.webp',
  'websites-dev': '/assets/visuals/websites-development.webp',
  ecommerce: '/assets/visuals/ecommerce.webp',
  'ai-automation': '/assets/visuals/ai-automation.webp',
  'data-analytics': '/assets/visuals/data-analytics.webp',
  analyze: '/assets/visuals/analyze.webp',
  strategy: '/assets/visuals/strategy.webp',
  launch: '/assets/visuals/launch.webp',
  scale: '/assets/visuals/scale.webp',
  'lead-gen': '/assets/system-story/lead-generation-system.webp',
  'website-conversion': '/assets/system-story/website-conversion-system.webp',
  automation: '/assets/system-story/smart-automation-system.webp',
}

const previousVisualById: Record<string, string> = {
  ...visualById,
  'lead-gen': '/assets/visuals/growth-marketing.webp',
  'website-conversion': '/assets/visuals/conversion-funnels.webp',
  automation: '/assets/visuals/ai-automation.webp',
}

const backgroundBySource: Record<string, string> = {
  '/assets/systems/bg-growth.jpg': '/assets/system-story/campaign-reach.webp',
  '/assets/systems/bg-web.jpg': '/assets/system-story/responsive-website.webp',
  '/assets/systems/bg-data.jpg': '/assets/system-story/performance-data.webp',
  '/assets/systems/bg-automation.jpg': '/assets/system-story/follow-up-flow.webp',
  '/assets/systems/bg-digital.jpg': '/assets/system-story/campaign-production.webp',
  '/assets/systems/bg-charts.jpg': '/assets/system-story/business-results.webp',
  '/assets/visuals/growth-marketing.webp': '/assets/system-story/campaign-reach.webp',
  '/assets/visuals/websites-development.webp': '/assets/system-story/responsive-website.webp',
  '/assets/visuals/data-analytics.webp': '/assets/system-story/performance-data.webp',
  '/assets/visuals/ai-automation.webp': '/assets/system-story/follow-up-flow.webp',
  '/assets/visuals/ecommerce.webp': '/assets/system-story/campaign-production.webp',
  '/assets/visuals/scale.webp': '/assets/system-story/business-results.webp',
}

const backgroundAltBySource: Record<string, string> = {
  '/assets/systems/bg-growth.jpg': 'Two men planning a campaign at a studio wall',
  '/assets/systems/bg-web.jpg': 'Man browsing a ceramic shop on his phone',
  '/assets/systems/bg-data.jpg': 'Analyst reviewing printed sales charts',
  '/assets/systems/bg-automation.jpg': 'Sales associate making a customer follow-up call',
  '/assets/systems/bg-digital.jpg': 'Photographer shooting a ceramic product in a studio',
  '/assets/systems/bg-charts.jpg': 'Shop owner preparing customer orders for dispatch',
  '/assets/visuals/growth-marketing.webp': 'Two men planning a campaign at a studio wall',
  '/assets/visuals/websites-development.webp': 'Man browsing a ceramic shop on his phone',
  '/assets/visuals/data-analytics.webp': 'Analyst reviewing printed sales charts',
  '/assets/visuals/ai-automation.webp': 'Sales associate making a customer follow-up call',
  '/assets/visuals/ecommerce.webp': 'Photographer shooting a ceramic product in a studio',
  '/assets/visuals/scale.webp': 'Shop owner preparing customer orders for dispatch',
  '/assets/system-story/campaign-reach.webp': 'Two men planning a campaign at a studio wall',
  '/assets/system-story/responsive-website.webp': 'Man browsing a ceramic shop on his phone',
  '/assets/system-story/performance-data.webp': 'Analyst reviewing printed sales charts',
  '/assets/system-story/follow-up-flow.webp': 'Sales associate making a customer follow-up call',
  '/assets/system-story/campaign-production.webp': 'Photographer shooting a ceramic product in a studio',
  '/assets/system-story/business-results.webp': 'Shop owner preparing customer orders for dispatch',
}

const previousDefaultAlts = new Set([
  'Growth dashboard visualization', 'Website conversion interface',
  'Data analytics workspace', 'Automation workflow interface',
  'Digital campaign interface', 'Performance chart visualization',
  'Teal pathways spreading across a dark landscape',
  'Teal light flowing through glass architectural frames',
  'Data points forming a luminous upward arc',
  'Connected glass modules carrying a teal signal',
  'Product display plinths connected by teal light',
  'A teal pathway rising through illuminated terraces',
  'Two marketers reviewing ad creative and campaign results',
  'Two developers reviewing a website and code',
  'Two analysts reviewing a performance dashboard',
  'Two specialists reviewing a CRM automation workflow',
  'A shop owner packing an online order',
  'A business owner reviewing growth data beside packed orders',
  'Product ad and campaign reach on connected devices',
  'Responsive product website on a laptop and phone',
  'Analytics dashboard with a printed performance report',
  'Lead follow-up workflow on a tablet and phone',
  'Camera and product set for a digital campaign',
  'Outgoing orders beside a sales performance view',
])

function isBundledStockImage(value: string, domainId: string) {
  if (value.startsWith('/assets/visuals/')) return previousVisualById[domainId] === value
  return value.startsWith('https://images.unsplash.com/') ||
    value.startsWith('/assets/systems/') ||
    value.startsWith('/assets/services/') ||
    value.startsWith('/assets/how-it-works/')
}

export function migrateLegacyVisuals(data: LandingPagePuckData): LandingPagePuckData {
  function visit(value: unknown): unknown {
    if (Array.isArray(value)) return value.map(visit)
    if (!value || typeof value !== 'object') return value

    const entry = value as Record<string, unknown>
    const copy: Record<string, unknown> = {}
    for (const [key, child] of Object.entries(entry)) copy[key] = visit(child)

    const domainId = typeof entry.itemId === 'string' ? entry.itemId : entry.id
    if (typeof domainId === 'string' && typeof entry.imageUrl === 'string' && isBundledStockImage(entry.imageUrl, domainId)) {
      copy.imageUrl = visualById[domainId] ?? entry.imageUrl
    }
    if (typeof entry.url === 'string') {
      copy.url = backgroundBySource[entry.url] ?? entry.url
      if (backgroundAltBySource[entry.url] && typeof entry.alt === 'string' && previousDefaultAlts.has(entry.alt)) {
        copy.alt = backgroundAltBySource[entry.url]
      }
    }
    return copy
  }

  return visit(data) as LandingPagePuckData
}
