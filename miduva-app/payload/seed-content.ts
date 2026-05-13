import path from 'path'
import { getPayload } from 'payload'
import config from '@payload-config'

const ROOT = process.cwd()
const ASSETS = path.join(ROOT, 'public', 'assets')
const SYSTEMS_ASSETS = path.join(ASSETS, 'systems')
const PUBLIC = path.join(ROOT, 'public')

interface ImageEntry {
  title: string
  alt: string
  filePath: string
}

// All site visuals worth having available in the Media library.
const IMAGES: ImageEntry[] = [
  // Branding
  { title: 'Miduva logo (dark)', alt: 'Miduva logo', filePath: path.join(ASSETS, 'miduva-logo.png') },
  { title: 'Miduva logo (white)', alt: 'Miduva logo', filePath: path.join(ASSETS, 'miduva-logo-white.png') },
  // Hero illustrations
  { title: 'Hero illustration — dark mode', alt: 'Miduva system illustration', filePath: path.join(ASSETS, 'system-dark.png') },
  { title: 'Hero illustration — light mode', alt: 'Miduva system illustration', filePath: path.join(ASSETS, 'system-light.png') },
  // Generic visuals available to cards
  { title: 'Hero — main composition', alt: 'Hero composition', filePath: path.join(ASSETS, 'hero-main.png') },
  { title: 'Hero — background', alt: 'Hero background', filePath: path.join(ASSETS, 'hero-bg.png') },
  { title: 'Hero — image', alt: 'Hero image', filePath: path.join(ASSETS, 'hero_image.png') },
  { title: 'Background plate', alt: 'Background', filePath: path.join(ASSETS, 'background.png') },
  { title: 'Foreground plate', alt: 'Foreground', filePath: path.join(ASSETS, 'foreground.png') },
  { title: 'Earth — globe', alt: 'Earth globe visual', filePath: path.join(PUBLIC, 'earth.png') },
  { title: 'Main brand background', alt: 'Brand background', filePath: path.join(PUBLIC, 'bg-main.png') },
  { title: 'Hero — image (alt 1)', alt: 'Hero variant', filePath: path.join(PUBLIC, 'hero-bg-image.png') },
  { title: 'Hero — image (light)', alt: 'Hero variant light', filePath: path.join(PUBLIC, 'hero-bg-image-light.png') },
  { title: 'Hero — image (variant p)', alt: 'Hero variant p', filePath: path.join(PUBLIC, 'hero-bg-image-p.png') },
  { title: 'Hero — image (variant 7)', alt: 'Hero variant 7', filePath: path.join(PUBLIC, 'hero-bg-image7.png') },
  { title: 'AI generated visual', alt: 'AI generated', filePath: path.join(PUBLIC, 'ChatGPT Image May 6, 2026, 10_12_54 PM.png') },
  // Systems section — card images
  { title: 'System — Lead Generation', alt: 'Lead generation visualization', filePath: path.join(SYSTEMS_ASSETS, 'lead-gen.jpg') },
  { title: 'System — Website & Conversion', alt: 'Website conversion visualization', filePath: path.join(SYSTEMS_ASSETS, 'website-conversion.jpg') },
  { title: 'System — Smart Automation', alt: 'Smart automation visualization', filePath: path.join(SYSTEMS_ASSETS, 'automation.jpg') },
  // Systems section — zoom backgrounds (order matters; ties to on-screen positioning)
  { title: 'Systems bg — charts', alt: 'Marketing charts', filePath: path.join(SYSTEMS_ASSETS, 'bg-charts.jpg') },
  { title: 'Systems bg — data', alt: 'Data visualization', filePath: path.join(SYSTEMS_ASSETS, 'bg-data.jpg') },
  { title: 'Systems bg — digital', alt: 'Digital marketing', filePath: path.join(SYSTEMS_ASSETS, 'bg-digital.jpg') },
  { title: 'Systems bg — growth', alt: 'Growth metrics', filePath: path.join(SYSTEMS_ASSETS, 'bg-growth.jpg') },
  { title: 'Systems bg — web', alt: 'Web design', filePath: path.join(SYSTEMS_ASSETS, 'bg-web.jpg') },
  { title: 'Systems bg — automation', alt: 'Automation', filePath: path.join(SYSTEMS_ASSETS, 'bg-automation.jpg') },
]

type Payload = Awaited<ReturnType<typeof getPayload>>

async function findOrCreateMedia(payload: Payload, entry: ImageEntry) {
  const existing = await payload.find({
    collection: 'media',
    where: { title: { equals: entry.title } },
    limit: 1,
  })
  if (existing.docs.length > 0) {
    return existing.docs[0]
  }
  try {
    const created = await payload.create({
      collection: 'media',
      data: { title: entry.title, alt: entry.alt },
      filePath: entry.filePath,
    })
    console.log(`  + uploaded: ${entry.title}`)
    return created
  } catch (err) {
    console.warn(`  ! skipped ${entry.title}: ${(err as Error).message}`)
    return null
  }
}

const FAQ_SEED = [
  {
    id: 'different',
    num: '01',
    question: 'How is Miduva different from a traditional marketing agency?',
    answer:
      "Traditional agencies sell services: ad management, email sequences, content calendars. Miduva builds the infrastructure those services run on. We design a complete acquisition and conversion system, wire it together across your channels, and hand it to you fully owned. When the engagement ends, the system keeps running without us.",
  },
  {
    id: 'specialize',
    num: '02',
    question: 'Do you work with any business, or do you specialize?',
    answer:
      "We work best with B2B SaaS companies and DTC brands generating between $1M and $30M in annual revenue. At that stage, there's enough volume to optimize against and enough complexity to warrant a system. Earlier-stage companies often need a different approach, and we'll say so upfront rather than take the engagement.",
  },
  {
    id: 'first30',
    num: '03',
    question: 'What does the first 30 days actually look like?',
    answer:
      "We start with a full audit: current channels, funnel performance, conversion rates, and attribution. In week two, you receive a system blueprint, a prioritized roadmap, and the baseline KPIs we'll measure against. By day 30, the first components are live and generating real data. No 90-day ramp-up periods.",
  },
  {
    id: 'timeline',
    num: '04',
    question: 'How quickly will I see results?',
    answer:
      "Most clients see measurable changes within 30 to 60 days. Meaningful ROI, the kind you'd present in a board meeting, typically lands in the 60 to 90 day window as the system compounds. We put these expectations in writing before we start, not after a quarter passes.",
  },
  {
    id: 'performance',
    num: '05',
    question: "What if the system doesn't perform?",
    answer:
      "We build in checkpoints at 30, 60, and 90 days. If a component isn't hitting its benchmark, we diagnose and rebuild it, not add more budget to something broken. Every system ships with defined success criteria, and we hold ourselves to those, not to billable-hour targets.",
  },
  {
    id: 'budget',
    num: '06',
    question: 'Do I need a large budget to get started?',
    answer:
      "We don't have a fixed minimum, but we do require an existing audience or traffic source to work with. Cold-start growth from zero is a different playbook. If you're already generating leads or revenue and want to systematize and scale, we're likely a strong fit.",
  },
  {
    id: 'team',
    num: '07',
    question: 'Will I need to hire a team to manage what you build?',
    answer:
      "No. Operational independence is a design constraint on every system we build. It should run with minimal ongoing management from your side. We document everything, train your team on the parts that matter, and design for the scenario where we're no longer involved.",
  },
  {
    id: 'ownership',
    num: '08',
    question: "What does 'owned by you' mean in practice?",
    answer:
      'Every tool, account, campaign, and automation lives in your accounts from day one. No proprietary platforms, no locked dashboards, no client portal we control. If you want to bring operations in-house or hand the system to another team, you can. We have no lock-in incentive.',
  },
]

type AnyRecord = Record<string, unknown>

function assignByOrder<T extends AnyRecord>(items: T[], imageField: string, pool: (number | string)[]): T[] {
  return items.map((item, idx) => {
    if (item[imageField]) return item
    const next = pool[idx % pool.length]
    if (next == null) return item
    return { ...item, [imageField]: next }
  })
}

async function run() {
  const payload = await getPayload({ config })

  console.log('🌱 Uploading images to Media library…')
  const media: Record<string, number | string | null> = {}
  for (const entry of IMAGES) {
    const doc = await findOrCreateMedia(payload, entry)
    media[entry.title] = doc?.id ?? null
  }

  const mediaId = (title: string) => media[title] ?? null

  console.log('\n🔌 Wiring images into landing page…')

  const current = (await payload.findGlobal({
    slug: 'landing-page',
    depth: 0,
  })) as unknown as AnyRecord

  const patch: AnyRecord = {}

  // ── Logos
  const branding = (current.branding ?? {}) as AnyRecord
  const newBranding = { ...branding }
  let brandingChanged = false
  if (!branding.logoDark && mediaId('Miduva logo (dark)')) {
    newBranding.logoDark = mediaId('Miduva logo (dark)')
    brandingChanged = true
  }
  if (!branding.logoLight && mediaId('Miduva logo (white)')) {
    newBranding.logoLight = mediaId('Miduva logo (white)')
    brandingChanged = true
  }
  if (brandingChanged) {
    patch.branding = newBranding
    console.log('  + wired logos')
  }

  // ── Hero illustrations
  const hero = (current.hero ?? {}) as AnyRecord
  const newHero = { ...hero }
  let heroChanged = false
  if (!hero.illustrationDark && mediaId('Hero illustration — dark mode')) {
    newHero.illustrationDark = mediaId('Hero illustration — dark mode')
    heroChanged = true
  }
  if (!hero.illustrationLight && mediaId('Hero illustration — light mode')) {
    newHero.illustrationLight = mediaId('Hero illustration — light mode')
    heroChanged = true
  }
  if (heroChanged) {
    patch.hero = newHero
    console.log('  + wired hero illustrations')
  }

  // ── Systems section — card images + decorative zoom backgrounds
  const systemsGroup = (current.systems ?? {}) as AnyRecord
  const systemsArr = (systemsGroup.systems as AnyRecord[] | undefined) ?? []
  const systemsPatch: AnyRecord = { ...systemsGroup }
  let systemsChanged = false

  if (systemsArr.length > 0) {
    // Card images — match each card by `id` to its purpose-built asset.
    const cardImageByCardId: Record<string, number | string | null> = {
      'lead-gen': mediaId('System — Lead Generation'),
      'website-conversion': mediaId('System — Website & Conversion'),
      automation: mediaId('System — Smart Automation'),
    }
    const fallbackPool = [
      mediaId('System — Lead Generation'),
      mediaId('System — Website & Conversion'),
      mediaId('System — Smart Automation'),
    ].filter(Boolean) as (number | string)[]
    const nextCards = systemsArr.map((card, idx) => {
      const matched = cardImageByCardId[(card.id as string) ?? ''] ?? fallbackPool[idx % fallbackPool.length] ?? null
      if (!matched) return card
      return { ...card, image: matched }
    })
    if (JSON.stringify(nextCards) !== JSON.stringify(systemsArr)) {
      systemsPatch.systems = nextCards
      systemsChanged = true
      console.log('  + wired system card images')
    }
  }

  // Decorative backgrounds — fixed order. Code positions them by index, so order matters.
  const bgTitles = [
    'Systems bg — charts',
    'Systems bg — data',
    'Systems bg — digital',
    'Systems bg — growth',
    'Systems bg — web',
    'Systems bg — automation',
  ]
  const bgImageIds = bgTitles.map((t) => mediaId(t)).filter(Boolean) as (number | string)[]
  if (bgImageIds.length === bgTitles.length) {
    const existingBg = (systemsGroup.backgroundImages as AnyRecord[] | undefined) ?? []
    const desiredBg = bgImageIds.map((id) => ({ image: id }))
    if (
      existingBg.length !== desiredBg.length ||
      existingBg.some((row, i) => row.image !== desiredBg[i].image)
    ) {
      systemsPatch.backgroundImages = desiredBg
      systemsChanged = true
      console.log('  + wired systems decorative backgrounds')
    }
  }

  if (systemsChanged) {
    patch.systems = systemsPatch
  }

  // ── How It Works steps (4)
  const howItWorks = (current.howItWorks ?? {}) as AnyRecord
  const stepsArr = (howItWorks.steps as AnyRecord[] | undefined) ?? []
  if (stepsArr.length > 0) {
    const pool = [
      mediaId('Hero — background'),
      mediaId('Background plate'),
      mediaId('Foreground plate'),
      mediaId('Hero — image'),
    ].filter(Boolean) as (number | string)[]
    const next = assignByOrder(stepsArr, 'image', pool)
    if (JSON.stringify(next) !== JSON.stringify(stepsArr)) {
      patch.howItWorks = { ...howItWorks, steps: next }
      console.log('  + wired step images')
    }
  }

  // ── Services categories (6)
  const services = (current.services ?? {}) as AnyRecord
  const categoriesArr = (services.categories as AnyRecord[] | undefined) ?? []
  if (categoriesArr.length > 0) {
    const pool = [
      mediaId('Main brand background'),
      mediaId('Hero — image (alt 1)'),
      mediaId('Hero — image (light)'),
      mediaId('Hero — image (variant p)'),
      mediaId('Hero — image (variant 7)'),
      mediaId('AI generated visual'),
    ].filter(Boolean) as (number | string)[]
    const next = assignByOrder(categoriesArr, 'image', pool)
    if (JSON.stringify(next) !== JSON.stringify(categoriesArr)) {
      patch.services = { ...services, categories: next }
      console.log('  + wired service category images')
    }
  }

  // ── FAQ — seed when empty
  const faq = (current.faq ?? {}) as AnyRecord
  const faqItems = (faq.items as unknown[] | undefined) ?? []
  if (faqItems.length === 0) {
    patch.faq = { items: FAQ_SEED }
    console.log(`  + seeded ${FAQ_SEED.length} FAQ items (was empty)`)
  }

  // ── Dashboard — seed when empty
  const dashboard = (current.dashboard ?? {}) as AnyRecord
  if (!dashboard.title) {
    patch.dashboard = {
      urlLabel: 'app.miduva.systems / growth-os',
      statusLabel: 'LIVE',
      navItems: ['Overview', 'Ads', 'Funnels', 'Automation', 'Data', 'Reports'].map((label) => ({ label })),
      clients: [
        { initials: 'AR', name: 'Arvo Labs' },
        { initials: 'NV', name: 'Novae' },
        { initials: 'KL', name: 'Kilo & Co' },
      ],
      eyebrow: 'Growth System · Arvo Labs',
      title: 'Q2 Performance Overview',
      kpis: [
        { label: 'Qualified Leads', value: '1,284', delta: '+38%',  color: 'teal' },
        { label: 'Pipeline',        value: '$482K', delta: '+21%',  color: 'navy' },
        { label: 'ROAS',            value: '5.2×',  delta: '+0.8×', color: 'teal' },
        { label: 'CAC',             value: '$41',   delta: '-29%',  color: 'navy' },
      ],
      chartTitle: 'Lead flow · last 12 weeks',
      chartSubtitle: 'Paid + Organic + Automation',
      funnelTitle: 'Funnel health',
      funnelStages: [
        { name: 'Visitors',   value: '48,210' },
        { name: 'Engaged',    value: '12,882' },
        { name: 'Leads',      value: '3,104'  },
        { name: 'SQLs',       value: '1,284'  },
        { name: 'Closed-won', value: '184'    },
      ],
    }
    console.log('  + seeded dashboard mockup')
  }

  // ── Growth OS (system ribbon) — seed when empty
  const growthOs = (current.growthOs ?? {}) as AnyRecord
  if (!growthOs.headline) {
    patch.growthOs = {
      eyebrow: '/ growth os',
      headline: 'Six modules.',
      headlineAccent: 'One connected system.',
      description: 'Every lever connected, every number visible, every dollar accounted for.',
      ctaLabel: 'See how we build it',
      ctaHref: '#cta',
      modules: [
        { name: 'Paid Ads',      tag: 'Meta · Google · TikTok',  description: 'Multi-channel acquisition tuned for CAC efficiency.',   color: 'teal', span: '2', visual: 'bars'   },
        { name: 'Funnel Design', tag: 'High-converting flows',   description: 'Landing pages & flows that turn clicks into SQLs.',      color: 'navy', span: '1', visual: 'funnel' },
        { name: 'Automation',    tag: 'Sequences & triggers',    description: 'Smart nurture that responds to behaviour in real time.', color: 'teal', span: '1', visual: 'nodes'  },
        { name: 'CRM & Data',    tag: 'Pipeline · attribution',  description: 'Clean data architecture with full-funnel visibility.',   color: 'navy', span: '2', visual: 'grid'   },
        { name: 'Lead Scoring',  tag: 'Qualify & prioritise',    description: 'AI-ranked leads so sales always knows who to call.',     color: 'teal', span: '2', visual: 'rings'  },
        { name: 'Analytics',     tag: 'Live · actionable',       description: 'No vanity metrics. Just decisions that move revenue.',   color: 'navy', span: '1', visual: 'spark'  },
      ],
    }
    console.log('  + seeded growth OS section')
  }

  // ── Free offer — seed when empty
  const freeOffer = (current.freeOffer ?? {}) as AnyRecord
  if (!freeOffer.headlineAccent) {
    patch.freeOffer = {
      eyebrow: '/ free offer',
      headlineLine1: 'Get a Free',
      headlineAccent: 'Growth Strategy',
      headlineLine3: 'for Your Business.',
      includes: [
        { label: 'Full Business Audit' },
        { label: 'Custom Growth Plan' },
        { label: 'Expert Recommendations' },
      ],
      ctaLabel: 'Book Your Free Call',
      ctaHref: '#contact',
      trustNote: 'No commitment · No credit card · Just real strategy',
    }
    console.log('  + seeded free offer')
  }

  // ── Contact — seed when empty
  const contact = (current.contact ?? {}) as AnyRecord
  if (!contact.headline) {
    patch.contact = {
      eyebrow: '/ get in touch',
      headline: "Let's build something",
      headlineAccent: 'that actually works.',
      body: "Tell us about your business. We'll review your situation and respond with a tailored plan — not a sales pitch.",
      contactInfo: [
        { icon: 'mail',     label: 'hello@miduva.com' },
        { icon: 'building', label: 'Available Worldwide · Remote-First' },
      ],
      trustStats: [
        { stat: '4.8×',    label: 'Average ROAS' },
        { stat: '+312%',   label: 'Lead Volume' },
        { stat: '14 days', label: 'Time to Launch' },
        { stat: '94%',     label: 'Client Retention' },
      ],
      formHeadline: 'Start the conversation',
      formSubheadline: 'We respond within 24 hours · No spam, ever',
      serviceOptions: [
        { value: 'growth-marketing',   label: 'Growth & Marketing' },
        { value: 'conversion-funnels', label: 'Conversion & Funnels' },
        { value: 'websites-dev',       label: 'Websites & Development' },
        { value: 'ecommerce',          label: 'E-Commerce' },
        { value: 'ai-automation',      label: 'AI & Automation' },
        { value: 'data-analytics',     label: 'Data & Analytics' },
        { value: 'full-system',        label: 'Full Growth System' },
      ],
      submitLabel: 'Send Message',
      finePrint: 'No commitment · No credit card · 100% Confidential',
    }
    console.log('  + seeded contact section')
  }

  // ── Footer — seed when empty
  const footer = (current.footer ?? {}) as AnyRecord
  if (!footer.heading) {
    patch.footer = {
      giantBgText: 'MIDUVA',
      heading: 'Ready to grow?',
      marqueeItems: [
        { phrase: 'More Leads, Less Effort' },
        { phrase: '4.8× ROAS Guaranteed' },
        { phrase: 'Launch in 14 Days' },
        { phrase: '94% Client Retention' },
        { phrase: 'Done-For-You Systems' },
      ],
      primaryCtas: [
        { label: 'Book a Free Call', href: '#contact' },
        { label: 'Get Started',      href: '#contact' },
      ],
      secondaryLinks: [
        { label: 'Privacy Policy',   href: '#' },
        { label: 'Terms of Service', href: '#' },
        { label: 'Support',          href: '#contact' },
      ],
      copyright: '© 2026 Miduva. All rights reserved.',
      createdByLabel: 'Created by',
    }
    console.log('  + seeded footer')
  }

  if (Object.keys(patch).length === 0) {
    console.log('  ✓ nothing to wire — everything already set')
  } else {
    await payload.updateGlobal({ slug: 'landing-page', data: patch })
    console.log('\n✅ landing-page updated:', Object.keys(patch).join(', '))
  }

  process.exit(0)
}

await run().catch((err) => {
  console.error('❌ seed-content failed:', err)
  process.exit(1)
})
