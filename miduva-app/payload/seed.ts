import { getPayload } from 'payload'
import config from '@payload-config'

async function seed() {
  const payload = await getPayload({ config })

  console.log('🌱 Seeding landing page content...')

  await payload.updateGlobal({
    slug: 'landing-page',
    data: {
      nav: {
        leftLinks: [
          { label: 'Services', href: '#services' },
          { label: 'Systems', href: '#systems' },
          { label: 'How it Works', href: '#how-it-works' },
        ],
        rightLinks: [
          { label: 'Case Studies', href: '#case-studies' },
          { label: 'About', href: '#about' },
          { label: 'Get Started', href: '#cta' },
        ],
      },

      hero: {
        headline: 'We build custom growth systems.',
        tagline: 'A system that learns, adapts, and accelerates your growth.',
        body: 'No generic services. We design tailored systems using ads, funnels, automation, and data — engineered end-to-end, owned by you.',
        phrases: [
          { phrase: 'generate leads.' },
          { phrase: 'drive sales.' },
          { phrase: 'scale your business.' },
        ],
        primaryCta: { label: 'Get Started', href: '#get-started' },
        secondaryCta: { label: 'See Our Work', href: '#case-studies' },
      },

      systems: {
        eyebrow: '/ our systems',
        headline: 'Three systems.',
        headlineAccent: 'One growth machine.',
        systems: [
          {
            id: 'lead-gen',
            num: '01',
            label: 'Lead Generation System',
            title: 'Consistent leads.\nOn autopilot.',
            description:
              'Generate predictable lead flow using ads, funnels & precision conversion systems built for your market.',
          },
          {
            id: 'website-conversion',
            num: '02',
            label: 'Website & Conversion System',
            title: 'Your website,\nactually converting.',
            description:
              "Turn traffic into revenue with a high-performance site engineered around your buyer's journey.",
          },
          {
            id: 'automation',
            num: '03',
            label: 'Smart Automation System',
            title: 'Sales & follow-ups\nrunning 24/7.',
            description:
              'CRM workflows, AI agents, and email sequences that close deals while you sleep — no extra hires.',
          },
        ],
      },

      problemSolution: {
        problemEyebrow: '/ the problem',
        problemHeadline: 'Most businesses are stuck in these traps.',
        problems: [
          {
            id: 'ads',
            num: '01',
            label: 'Trap 01',
            title: 'Traffic that goes nowhere',
            detail: "You're buying clicks. Not customers. Your ad spend is a leaky bucket.",
            icon: 'close',
          },
          {
            id: 'traffic',
            num: '02',
            label: 'Trap 02',
            title: 'Visitors that bounce',
            detail: 'People land, scan, leave. No funnel. No follow-up. No revenue.',
            icon: 'alert',
          },
          {
            id: 'leads',
            num: '03',
            label: 'Trap 03',
            title: 'Leads that go cold',
            detail: 'Hot prospects slip through the cracks. No system to catch them.',
            icon: 'close',
          },
        ],
        solution: {
          headline: 'One connected',
          headlineAccent: 'system.',
          subheadline: 'that turns strangers into customers.',
          bullets: [
            { text: 'Ads engineered to attract ready buyers' },
            { text: 'Funnels built to convert, not decorate' },
            { text: 'Automation that nurtures while you sleep' },
          ],
          ctaLabel: 'See the system',
          ctaHref: '#systems',
          bottomNote: 'Everything connected. Every dollar tracked.',
        },
      },

      results: {
        eyebrow: '/ results',
        headline: 'Numbers don\'t lie.',
        subheadline:
          'Aggregated across all active client systems.\nMeasured. Verified. Repeatable.',
        stats: [
          {
            id: 'leads',
            value: 120,
            suffix: '+',
            label: 'Leads Generated',
            sub: 'Per client, per quarter on average',
          },
          {
            id: 'conversion',
            value: 3,
            suffix: '×',
            label: 'Conversion Rate',
            sub: 'Compared to industry baseline',
          },
          {
            id: 'cpl',
            value: 40,
            suffix: '%',
            label: 'Lower Cost per Lead',
            sub: 'After full system optimization',
          },
        ],
        trustNote: 'All metrics averaged across Q1–Q2 client cohorts',
        ctaLabel: 'Get your free growth plan',
        ctaHref: '#cta',
      },

      parallax: {
        eyebrow: 'The Miduva Difference',
        headline: 'Built as a',
        description:
          'Not a one-off campaign, not a template. A connected machine — ads → funnels → automation → data — tuned for your business.',
        pipelineLabel: 'Pipeline · live',
        pipelineValue: '$482,120',
        pipelineDelta: '▲ 21.4%',
        bottomLabel: 'Eight modules · one OS',
        bottomDescription:
          'Every lever connected, every number visible, every dollar accounted for.',
      },

      whyMiduva: {
        eyebrow: 'Why Miduva',
        differentiators: [
          {
            id: 'custom',
            num: '01',
            title: 'Custom Solutions',
            subtitle: 'Tailored architecture',
            oldWay: 'cookie-cutter packages',
            newWay: 'systems built around your business',
          },
          {
            id: 'data',
            num: '02',
            title: 'Data-Driven Decisions',
            subtitle: 'Quantified strategy',
            oldWay: 'gut-feel strategy',
            newWay: 'every move backed by real numbers',
          },
          {
            id: 'ai',
            num: '03',
            title: 'AI-Powered Systems',
            subtitle: 'Intelligent automation',
            oldWay: 'manual, repetitive tasks',
            newWay: 'AI agents running the heavy lifting',
          },
          {
            id: 'roi',
            num: '04',
            title: 'Focus on ROI',
            subtitle: 'Revenue-first metrics',
            oldWay: 'vanity metrics and reports',
            newWay: 'revenue impact, measured and proven',
          },
        ],
      },

      howItWorks: {
        eyebrow: '/ how it works',
        headline: 'From audit to scale —',
        steps: [
          {
            id: 'analyze',
            num: '01',
            title: 'Analyze Your Business',
            description:
              'We audit your channels, funnels, and conversion gaps to build a complete picture of where you stand and where the biggest opportunities hide.',
          },
          {
            id: 'strategy',
            num: '02',
            title: 'Build a Custom Strategy',
            description:
              'A system blueprint tailored to your market, audience, and goals — no templates, no guesswork, just a clear plan for growth.',
          },
          {
            id: 'launch',
            num: '03',
            title: 'Launch & Optimize the System',
            description:
              'Everything goes live and gets tuned until it performs. We test, iterate, and refine until every metric is moving in the right direction.',
          },
          {
            id: 'scale',
            num: '04',
            title: 'Scale Your Results',
            description:
              'More traffic, better conversions, automated follow-up — compounding returns that grow your business while you focus on what you do best.',
          },
        ],
      },

      faq: {
        items: [
          {
            id: 'different',
            num: '01',
            question: 'How is Miduva different from a traditional marketing agency?',
            answer:
              'Traditional agencies sell services: ad management, email sequences, content calendars. Miduva builds the infrastructure those services run on. We design a complete acquisition and conversion system, wire it together across your channels, and hand it to you fully owned. When the engagement ends, the system keeps running without us.',
          },
          {
            id: 'specialize',
            num: '02',
            question: 'Do you work with any business, or do you specialize?',
            answer:
              'We work best with B2B SaaS companies and DTC brands generating between $1M and $30M in annual revenue. At that stage, there\'s enough volume to optimize against and enough complexity to warrant a system. Earlier-stage companies often need a different approach, and we\'ll say so upfront rather than take the engagement.',
          },
          {
            id: 'first30',
            num: '03',
            question: 'What does the first 30 days actually look like?',
            answer:
              'We start with a full audit: current channels, funnel performance, conversion rates, and attribution. In week two, you receive a system blueprint, a prioritized roadmap, and the baseline KPIs we\'ll measure against. By day 30, the first components are live and generating real data. No 90-day ramp-up periods.',
          },
          {
            id: 'timeline',
            num: '04',
            question: 'How quickly will I see results?',
            answer:
              'Most clients see measurable changes within 30 to 60 days. Meaningful ROI, the kind you\'d present in a board meeting, typically lands in the 60 to 90 day window as the system compounds. We put these expectations in writing before we start, not after a quarter passes.',
          },
          {
            id: 'performance',
            num: '05',
            question: 'What if the system doesn\'t perform?',
            answer:
              'We build in checkpoints at 30, 60, and 90 days. If a component isn\'t hitting its benchmark, we diagnose and rebuild it, not add more budget to something broken. Every system ships with defined success criteria, and we hold ourselves to those, not to billable-hour targets.',
          },
          {
            id: 'budget',
            num: '06',
            question: 'Do I need a large budget to get started?',
            answer:
              'We don\'t have a fixed minimum, but we do require an existing audience or traffic source to work with. Cold-start growth from zero is a different playbook. If you\'re already generating leads or revenue and want to systematize and scale, we\'re likely a strong fit.',
          },
          {
            id: 'team',
            num: '07',
            question: 'Will I need to hire a team to manage what you build?',
            answer:
              'No. Operational independence is a design constraint on every system we build. It should run with minimal ongoing management from your side. We document everything, train your team on the parts that matter, and design for the scenario where we\'re no longer involved.',
          },
          {
            id: 'ownership',
            num: '08',
            question: 'What does \'owned by you\' mean in practice?',
            answer:
              'Every tool, account, campaign, and automation lives in your accounts from day one. No proprietary platforms, no locked dashboards, no client portal we control. If you want to bring operations in-house or hand the system to another team, you can. We have no lock-in incentive.',
          },
        ],
      },

      services: {
        eyebrow: '/ what we do',
        headline: 'Everything you need',
        headlineAccent: 'to grow.',
        ctaLabel: 'Book a free strategy call',
        ctaHref: '#cta',
        categories: [
          {
            id: 'growth-marketing',
            title: 'Growth & Marketing',
            items: [
              { item: 'Paid Ads' },
              { item: 'Social Media Ads' },
              { item: 'Retargeting' },
              { item: 'SEO' },
              { item: 'Content Marketing' },
              { item: 'AI Visibility (GEO)' },
              { item: 'Advanced Growth Strategies' },
            ],
          },
          {
            id: 'conversion-funnels',
            title: 'Conversion & Funnels',
            items: [
              { item: 'Landing Pages' },
              { item: 'Sales Funnels' },
              { item: 'CRO' },
              { item: 'A/B Testing' },
              { item: 'UX Optimization' },
              { item: 'Personalization Systems' },
            ],
          },
          {
            id: 'websites-dev',
            title: 'Websites & Development',
            items: [
              { item: 'Landing Pages' },
              { item: 'E-Commerce' },
              { item: 'Performance Optimization' },
              { item: 'CMS' },
              { item: 'Web Apps' },
              { item: 'SaaS Development' },
            ],
          },
          {
            id: 'ecommerce',
            title: 'E-Commerce',
            items: [
              { item: 'Shopify' },
              { item: 'WooCommerce' },
              { item: 'Custom Platforms' },
              { item: 'Marketing Integration' },
              { item: 'Conversion Optimization' },
            ],
          },
          {
            id: 'ai-automation',
            title: 'AI & Automation',
            items: [
              { item: 'WhatsApp & Website Chatbots' },
              { item: 'CRM Automation' },
              { item: 'Email Automation' },
              { item: 'Lead Management' },
              { item: 'AI Sales Agents' },
              { item: 'n8n Workflows' },
              { item: 'Custom AI' },
            ],
          },
          {
            id: 'data-analytics',
            title: 'Data & Analytics',
            items: [
              { item: 'GA4 / Meta Setup' },
              { item: 'Conversion Tracking' },
              { item: 'Dashboards' },
              { item: 'Reporting' },
              { item: 'Attribution Modeling' },
              { item: 'Revenue Forecasting' },
            ],
          },
        ],
      },
    },
  })

  console.log('✅ Landing page seeded successfully!')
  console.log('👉 Visit /admin to create your user account and upload images.')
  process.exit(0)
}

await seed().catch((err) => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})
