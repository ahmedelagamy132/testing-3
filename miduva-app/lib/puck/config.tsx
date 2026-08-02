import type { Config, Field } from '@puckeditor/core'
/* eslint-disable @typescript-eslint/no-explicit-any -- Puck's field union requires a polymorphic props escape hatch for shared field factories. */
import type { LandingPageComponents, LandingPageRootProps } from './types'
import { DEFAULT_ROOT_PROPS, DEFAULT_SECTION_PROPS } from './defaults'
import { MediaField } from '@/components/puck/media-field'
import { StringListField } from '@/components/puck/string-list-field'
import { NumberListField } from '@/components/puck/number-list-field'
import {
  LandingPageRoot,
  PuckContactSection,
  PuckFaqSection,
  PuckFooterSection,
  PuckFreeOfferSection,
  PuckGrowthOsSection,
  PuckHeroSection,
  PuckHowItWorksSection,
  PuckOurWorkSection,
  PuckParallaxSection,
  PuckProblemSolutionSection,
  PuckResultsSection,
  PuckServicesSection,
  PuckSystemsSection,
  PuckWhyMiduvaSection,
} from '@/components/puck/landing-page'

const text = (label: string): Field<any> => ({ type: 'text', label })
const area = (label: string): Field<any> => ({ type: 'textarea', label })
const number = (label: string, min?: number, max?: number): Field<any> => ({ type: 'number', label, min, max })
const strings = (label: string): Field<any> => ({ type: 'custom', label, render: StringListField })
const image = (label: string): Field<any> => ({ type: 'custom', label, render: MediaField })
const numbers = (label: string): Field<any> => ({ type: 'custom', label, render: NumberListField })

const linkFields = {
  label: text('Label'),
  href: text('Link'),
}

const singletonPermissions = { duplicate: false }

export const landingPageConfig: Config<LandingPageComponents, LandingPageRootProps> = {
  categories: {
    story: {
      title: 'Story',
      defaultExpanded: true,
      components: ['HeroSection', 'SystemsSection', 'ProblemSolutionSection', 'HowItWorksSection', 'ResultsSection', 'WhyMiduvaSection', 'ParallaxSection'],
    },
    proof: {
      title: 'Proof and services',
      components: ['OurWorkSection', 'ServicesSection', 'GrowthOsSection'],
    },
    conversion: {
      title: 'Conversion',
      components: ['FaqSection', 'FreeOfferSection', 'ContactSection', 'FooterSection'],
    },
  },
  root: {
    label: 'Landing page settings',
    defaultProps: DEFAULT_ROOT_PROPS,
    fields: {
      title: text('Editor label'),
      defaultTheme: { type: 'select', label: 'Default theme', options: [{ label: 'Dark', value: 'dark' }, { label: 'Light', value: 'light' }] },
      seo: {
        type: 'object',
        label: 'SEO',
        objectFields: {
          title: text('Page title'),
          description: area('Meta description'),
        },
      },
      branding: {
        type: 'object',
        label: 'Branding',
        objectFields: {
          logoDarkUrl: image('Dark logo'),
          logoLightUrl: image('Light logo'),
          logoAlt: text('Logo alt text'),
        },
      },
      nav: {
        type: 'object',
        label: 'Navigation',
        objectFields: {
          leftLinks: {
            type: 'array', label: 'Left links', arrayFields: linkFields,
            defaultItemProps: { label: 'Link', href: '#' }, max: 8,
            getItemSummary: (item) => item.label,
          },
          rightLinks: {
            type: 'array', label: 'Right links', arrayFields: linkFields,
            defaultItemProps: { label: 'Link', href: '#' }, max: 8,
            getItemSummary: (item) => item.label,
          },
        },
      },
      dashboard: {
        type: 'object',
        label: 'Protected dashboard content',
        objectFields: {
          urlLabel: text('URL label'),
          statusLabel: text('Status'),
          syncLabel: text('Sync label'),
          systemLabel: text('Dashboard navigation label'),
          clientsLabel: text('Clients label'),
          navItems: strings('Dashboard navigation'),
          clients: {
            type: 'array', label: 'Clients', max: 8,
            arrayFields: { initials: text('Initials'), name: text('Name') },
            defaultItemProps: { initials: 'CL', name: 'Client' },
            getItemSummary: (item) => item.name,
          },
          eyebrow: text('Eyebrow'),
          title: text('Dashboard title'),
          rangeLabels: strings('Date ranges'),
          activeRangeIndex: number('Active date range index', 0, 7),
          kpis: {
            type: 'array', label: 'KPIs', min: 1, max: 4,
            arrayFields: {
              label: text('Label'), value: text('Value'), delta: text('Change'),
              color: { type: 'select', label: 'Color', options: [{ label: 'Teal', value: 'teal' }, { label: 'Navy', value: 'navy' }] },
            },
            defaultItemProps: { label: 'Metric', value: '0', delta: '+0%', color: 'teal' },
            getItemSummary: (item) => `${item.label}: ${item.value}`,
          },
          chartTitle: text('Chart title'),
          chartSubtitle: text('Chart subtitle'),
          chartLegend: strings('Chart legend'),
          chartAxisLabels: strings('Chart axis labels'),
          chartWeekLabels: strings('Chart period labels'),
          chartValues: numbers('Chart values'),
          funnelTitle: text('Funnel title'),
          funnelStages: {
            type: 'array', label: 'Funnel stages', min: 1, max: 8,
            arrayFields: { name: text('Stage'), value: text('Value') },
            defaultItemProps: { name: 'Stage', value: '0' },
            getItemSummary: (item) => `${item.name}: ${item.value}`,
          },
          optimizedLabel: text('Optimization badge'),
          automationLabel: text('Automation label'),
          automationHealth: number('Automation health', 0, 100),
        },
      },
      beforeDashboard: { type: 'slot', label: 'Sections before dashboard' },
      afterDashboard: { type: 'slot', label: 'Sections after dashboard' },
    },
    permissions: { delete: false, duplicate: false, drag: false },
    render: ({ beforeDashboard, afterDashboard, branding, nav, dashboard, defaultTheme }) => (
      <LandingPageRoot
        key={defaultTheme}
        beforeDashboard={beforeDashboard}
        afterDashboard={afterDashboard}
        branding={branding}
        nav={nav}
        dashboard={dashboard}
        defaultTheme={defaultTheme}
      />
    ),
  },
  components: {
    HeroSection: {
      label: 'Hero', permissions: singletonPermissions,
      defaultProps: DEFAULT_SECTION_PROPS.HeroSection,
      fields: {
        headline: text('Headline'), tagline: text('Tagline'), body: area('Body'), phrasePrefix: text('Rotating phrase prefix'),
        phrases: strings('Rotating phrases'),
        primaryCta: { type: 'object', label: 'Primary CTA', objectFields: linkFields },
        secondaryCta: { type: 'object', label: 'Secondary CTA', objectFields: linkFields },
        illustrationDarkUrl: image('Dark illustration'),
        illustrationLightUrl: image('Light illustration'),
        illustrationAlt: text('Illustration alt text'),
      },
      render: (props) => <PuckHeroSection {...props} />,
    },
    SystemsSection: {
      label: 'Systems', permissions: singletonPermissions,
      defaultProps: DEFAULT_SECTION_PROPS.SystemsSection,
      fields: {
        eyebrow: text('Eyebrow'), headline: text('Headline'), headlineAccent: text('Headline accent'), ctaLabel: text('Card CTA label'), ctaHref: text('Card CTA link'),
        systems: {
          type: 'array', label: 'System cards', min: 3, max: 3,
          arrayFields: {
            id: text('Internal ID'), num: text('Number'), label: text('Label'), title: area('Title'),
            description: area('Description'), imageUrl: image('Image'), imageAlt: text('Image alt text'),
          },
          defaultItemProps: { id: 'system', num: '01', label: 'System', title: 'System title', description: '', imageUrl: '/assets/systems/lead-gen.jpg' },
          getItemSummary: (item) => `${item.num} ${item.label}`,
        },
        backgroundImages: {
          type: 'array', label: 'Zoom background images', min: 6, max: 6,
          arrayFields: { url: image('Image'), alt: text('Alt text') },
          defaultItemProps: { url: '/assets/systems/bg-growth.jpg', alt: 'Growth system visual' },
          getItemSummary: (item) => item.alt,
        },
      },
      render: (props) => <PuckSystemsSection {...props} />,
    },
    ProblemSolutionSection: {
      label: 'Problem and solution', permissions: singletonPermissions,
      defaultProps: DEFAULT_SECTION_PROPS.ProblemSolutionSection,
      fields: {
        problemEyebrow: text('Problem eyebrow'), problemHeadline: text('Problem headline'),
        problems: {
          type: 'array', label: 'Problem cards', min: 3, max: 3,
          arrayFields: {
            id: text('Internal ID'), num: text('Number'), label: text('Label'), title: text('Title'), detail: area('Detail'),
            icon: { type: 'select', label: 'Icon', options: [{ label: 'Close', value: 'close' }, { label: 'Alert', value: 'alert' }] },
          },
          defaultItemProps: { id: 'problem', num: '01', label: 'Trap', title: 'Problem', detail: '', icon: 'close' },
          getItemSummary: (item) => `${item.num} ${item.title}`,
        },
        solution: {
          type: 'object', label: 'Solution', objectFields: {
            headline: text('Headline'), headlineAccent: text('Headline accent'), subheadline: text('Subheadline'),
            bullets: strings('Bullet points'), ctaLabel: text('CTA label'), ctaHref: text('CTA link'), bottomNote: text('Bottom note'),
          },
        },
      },
      render: (props) => <PuckProblemSolutionSection {...props} />,
    },
    HowItWorksSection: {
      label: 'How it works', permissions: singletonPermissions,
      defaultProps: DEFAULT_SECTION_PROPS.HowItWorksSection,
      fields: {
        eyebrow: text('Eyebrow'), headline: text('Headline'), headlineAccent: text('Headline accent'),
        steps: {
          type: 'array', label: 'Steps', min: 1, max: 6,
          arrayFields: { id: text('Internal ID'), num: text('Number'), title: text('Title'), description: area('Description'), imageUrl: image('Image'), imageAlt: text('Image alt text') },
          defaultItemProps: { id: 'step', num: '01', title: 'Step', description: '', imageUrl: '/assets/how-it-works/analyze.jpg' },
          getItemSummary: (item) => `${item.num} ${item.title}`,
        },
      },
      render: (props) => <PuckHowItWorksSection {...props} />,
    },
    ResultsSection: {
      label: 'Results', permissions: singletonPermissions,
      defaultProps: DEFAULT_SECTION_PROPS.ResultsSection,
      fields: {
        eyebrow: text('Eyebrow'), headline: text('Headline'), subheadline: area('Subheadline'),
        stats: {
          type: 'array', label: 'Statistics', min: 1, max: 4,
          arrayFields: { id: text('Internal ID'), value: number('Value', 0, 1000000), suffix: text('Suffix'), label: text('Label'), sub: text('Sub-label') },
          defaultItemProps: { id: 'stat', value: 0, suffix: '+', label: 'Metric', sub: 'Description' },
          getItemSummary: (item) => `${item.value}${item.suffix} ${item.label}`,
        },
        trustNote: text('Trust note'), ctaLabel: text('CTA label'), ctaHref: text('CTA link'),
      },
      render: (props) => <PuckResultsSection {...props} />,
    },
    OurWorkSection: {
      label: 'Our work', permissions: singletonPermissions,
      defaultProps: DEFAULT_SECTION_PROPS.OurWorkSection,
      fields: {
        eyebrow: text('Eyebrow'), headline: text('Headline'), ariaLabel: text('Logo rail accessibility label'),
        logos: {
          type: 'array', label: 'Client logos', min: 2, max: 30,
          arrayFields: {
            src: image('Logo'), name: text('Client name'), category: text('Category'),
            size: { type: 'select', label: 'Logo shape', options: [{ label: 'Compact', value: 'compact' }, { label: 'Wide', value: 'wide' }, { label: 'Tall', value: 'tall' }] },
          },
          defaultItemProps: { src: '/client-logos/19.png', name: 'Client', category: 'Client', size: 'compact' },
          getItemSummary: (item) => item.name,
        },
      },
      render: (props) => <PuckOurWorkSection {...props} />,
    },
    WhyMiduvaSection: {
      label: 'Why Miduva', permissions: singletonPermissions,
      defaultProps: DEFAULT_SECTION_PROPS.WhyMiduvaSection,
      fields: {
        eyebrow: text('Eyebrow'), watermark: text('Background word'),
        statementLead: text('Statement opening'), statementOldWay: text('Struck-through phrase'), statementBridge: text('Statement bridge'),
        statementAccent: text('Statement accent'), statementTail: text('Statement ending'), wideStatValue: text('Wide-card statistic'), wideStatLabel: text('Wide-card statistic label'),
        differentiators: {
          type: 'array', label: 'Differentiators', min: 1, max: 4,
          arrayFields: { id: text('Internal ID'), num: text('Number'), title: text('Title'), subtitle: text('Subtitle'), oldWay: text('Old way'), newWay: text('New way') },
          defaultItemProps: { id: 'difference', num: '01', title: 'Difference', subtitle: '', oldWay: '', newWay: '' },
          getItemSummary: (item) => `${item.num} ${item.title}`,
        },
      },
      render: (props) => <PuckWhyMiduvaSection {...props} />,
    },
    ParallaxSection: {
      label: 'The difference', permissions: singletonPermissions,
      defaultProps: DEFAULT_SECTION_PROPS.ParallaxSection,
      fields: {
        eyebrow: text('Eyebrow'), headline: text('Headline'), headlineAccent: text('Headline accent'), description: area('Description'),
        pipelineLabel: text('Pipeline label'), pipelineValue: text('Pipeline value'), pipelineDelta: text('Pipeline change'), pipelineComparison: text('Pipeline comparison'), chartValues: numbers('Chart values'),
        bottomLabel: text('Bottom label'), bottomDescription: area('Bottom description'),
      },
      render: (props) => <PuckParallaxSection {...props} />,
    },
    ServicesSection: {
      label: 'Services', permissions: singletonPermissions,
      defaultProps: DEFAULT_SECTION_PROPS.ServicesSection,
      fields: {
        eyebrow: text('Eyebrow'), headline: text('Headline'), headlineAccent: text('Headline accent'), activeLabel: text('Active item label'), servicesLabel: text('Services count label'), ctaLabel: text('CTA label'), ctaHref: text('CTA link'),
        categories: {
          type: 'array', label: 'Service categories', min: 1, max: 8,
          arrayFields: { id: text('Internal ID'), title: text('Title'), items: strings('Services'), imageUrl: image('Image'), imageAlt: text('Image alt text') },
          defaultItemProps: { id: 'service', title: 'Service', items: ['Service item'], imageUrl: '/assets/services/growth-marketing.jpg' },
          getItemSummary: (item) => item.title,
        },
      },
      render: (props) => <PuckServicesSection {...props} />,
    },
    GrowthOsSection: {
      label: 'Growth OS', permissions: singletonPermissions,
      defaultProps: DEFAULT_SECTION_PROPS.GrowthOsSection,
      fields: {
        eyebrow: text('Eyebrow'), headline: text('Headline'), headlineAccent: text('Headline accent'), description: area('Description'), ctaLabel: text('CTA label'), ctaHref: text('CTA link'),
        modules: {
          type: 'array', label: 'Modules', min: 1, max: 8,
          arrayFields: {
            name: text('Name'), tag: text('Tag'), description: area('Description'),
            color: { type: 'select', label: 'Color', options: [{ label: 'Teal', value: 'teal' }, { label: 'Navy', value: 'navy' }] },
            span: { type: 'select', label: 'Width', options: [{ label: 'One column', value: 1 }, { label: 'Two columns', value: 2 }] },
            visual: { type: 'select', label: 'Visual', options: ['bars', 'funnel', 'nodes', 'grid', 'rings', 'spark'].map((value) => ({ label: value, value })) },
          },
          defaultItemProps: { name: 'Module', tag: 'System', description: '', color: 'teal', span: 1, visual: 'bars' },
          getItemSummary: (item) => item.name,
        },
      },
      render: (props) => <PuckGrowthOsSection {...props} />,
    },
    FaqSection: {
      label: 'FAQ', permissions: singletonPermissions,
      defaultProps: DEFAULT_SECTION_PROPS.FaqSection,
      fields: {
        eyebrow: text('Eyebrow'), headline: text('Headline'), body: area('Intro text'),
        items: {
          type: 'array', label: 'Questions', min: 1, max: 20,
          arrayFields: { id: text('Internal ID'), num: text('Number'), question: text('Question'), answer: area('Answer') },
          defaultItemProps: { id: 'question', num: '01', question: 'Question?', answer: 'Answer.' },
          getItemSummary: (item) => `${item.num} ${item.question}`,
        },
      },
      render: (props) => <PuckFaqSection {...props} />,
    },
    FreeOfferSection: {
      label: 'Free offer', permissions: singletonPermissions,
      defaultProps: DEFAULT_SECTION_PROPS.FreeOfferSection,
      fields: {
        eyebrow: text('Eyebrow'), headlineLine1: text('Headline line 1'), headlineAccent: text('Headline accent'), headlineLine3: text('Headline line 3'),
        includes: strings('Included items'), ctaLabel: text('CTA label'), ctaHref: text('CTA link'), trustNote: text('Trust note'),
      },
      render: (props) => <PuckFreeOfferSection {...props} />,
    },
    ContactSection: {
      label: 'Contact', permissions: singletonPermissions,
      defaultProps: DEFAULT_SECTION_PROPS.ContactSection,
      fields: {
        eyebrow: text('Eyebrow'), headline: text('Headline'), headlineAccent: text('Headline accent'), body: area('Body'),
        contactInfo: {
          type: 'array', label: 'Contact information', min: 1, max: 4,
          arrayFields: {
            icon: { type: 'select', label: 'Icon', options: [{ label: 'Mail', value: 'mail' }, { label: 'Building', value: 'building' }] },
            label: text('Label'),
          },
          defaultItemProps: { icon: 'mail', label: 'hello@miduva.com' }, getItemSummary: (item) => item.label,
        },
        trustStats: {
          type: 'array', label: 'Trust statistics', min: 1, max: 4,
          arrayFields: { stat: text('Statistic'), label: text('Label') },
          defaultItemProps: { stat: '0', label: 'Metric' }, getItemSummary: (item) => `${item.stat} ${item.label}`,
        },
        formHeadline: text('Form headline'), formSubheadline: text('Form subheadline'),
        serviceOptions: {
          type: 'array', label: 'Service options', min: 1, max: 16,
          arrayFields: { value: text('Value'), label: text('Label') },
          defaultItemProps: { value: 'service', label: 'Service' }, getItemSummary: (item) => item.label,
        },
        nameLabel: text('Name field label'), namePlaceholder: text('Name placeholder'),
        emailLabel: text('Email field label'), emailPlaceholder: text('Email placeholder'),
        companyLabel: text('Company field label'), companyPlaceholder: text('Company placeholder'),
        serviceLabel: text('Service field label'), servicePlaceholder: text('Service placeholder'),
        messageLabel: text('Message field label'), messagePlaceholder: text('Message placeholder'),
        submitLabel: text('Submit button'), submittingLabel: text('Submitting label'), finePrint: text('Fine print'),
        successHeadline: text('Success headline'), successBody: area('Success message'), resetLabel: text('Reset button'), errorMessage: text('Submission error'),
        nameRequiredMessage: text('Name required error'), emailRequiredMessage: text('Email required error'), emailInvalidMessage: text('Invalid email error'),
        serviceRequiredMessage: text('Service required error'), messageRequiredMessage: text('Message required error'), messageTooShortMessage: text('Short message error'),
      },
      render: (props) => <PuckContactSection {...props} />,
    },
    FooterSection: {
      label: 'Footer', permissions: singletonPermissions,
      defaultProps: DEFAULT_SECTION_PROPS.FooterSection,
      fields: {
        giantBgText: text('Background word'), heading: text('Heading'), marqueeItems: strings('Marquee items'),
        primaryCtas: {
          type: 'array', label: 'Primary CTAs', min: 1, max: 4, arrayFields: linkFields,
          defaultItemProps: { label: 'CTA', href: '#' }, getItemSummary: (item) => item.label,
        },
        secondaryLinks: {
          type: 'array', label: 'Secondary links', min: 1, max: 8, arrayFields: linkFields,
          defaultItemProps: { label: 'Link', href: '#' }, getItemSummary: (item) => item.label,
        },
        copyright: text('Copyright'), createdByLabel: text('Created by label'), createdByName: text('Creator name'), backToTopLabel: text('Back-to-top accessibility label'),
      },
      render: (props) => <PuckFooterSection {...props} />,
    },
  },
}
