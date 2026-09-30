// Miduva's editable sections, described for the reusable visual editor
// (lib/visual-editor). Admins only ever see these labelled fields.
import type { Field, SectionDefinition } from '@/lib/visual-editor'
import { DEFAULT_SECTION_PROPS } from '@/lib/puck/defaults'

type FieldDef = Field
type ListDef = Extract<Field, { kind: 'list' }>

export type SectionType =
  | 'HeroSection'
  | 'SystemsSection'
  | 'ProblemSolutionSection'
  | 'HowItWorksSection'
  | 'ResultsSection'
  | 'OurWorkSection'
  | 'WhyMiduvaSection'
  | 'ParallaxSection'
  | 'ServicesSection'
  | 'GrowthOsSection'
  | 'FaqSection'
  | 'FreeOfferSection'
  | 'ContactSection'
  | 'FooterSection'

type SectionSchema = Omit<SectionDefinition, 'defaults' | 'single'> & { description: string }

const text = (key: string, label: string, help?: string): FieldDef => ({ kind: 'text', key, label, help })
const area = (key: string, label: string, help?: string): FieldDef => ({ kind: 'textarea', key, label, help })
const image = (key: string, label: string): FieldDef => ({ kind: 'image', key, label })
const strings = (key: string, label: string, help = 'One per line'): FieldDef => ({ kind: 'strings', key, label, help })
const link = (key: string, label: string): FieldDef => ({ kind: 'link', key, label })
const str = (value: unknown) => (typeof value === 'string' || typeof value === 'number' ? String(value) : '')
const numbered = (item: Record<string, unknown>, index: number, key: string) =>
  str(item[key]) || `Item ${index + 1}`

const linkItemFields: FieldDef[] = [text('label', 'Label'), text('href', 'Link', 'e.g. #contact, /privacy or https://…')]
const linkList = (key: string, label: string, max = 8): FieldDef => ({
  kind: 'list', key, label, itemLabel: 'link', fields: linkItemFields, max,
  summary: (item, index) => numbered(item, index, 'label'),
  newItem: () => ({ label: 'New link', href: '#contact' }),
})

export const SECTION_SCHEMAS: Record<SectionType, SectionSchema> = {
  HeroSection: {
    label: 'Hero',
    description: 'The first screen visitors see',
    fields: [
      text('headline', 'Headline'),
      text('tagline', 'Tagline'),
      area('body', 'Intro text'),
      text('phrasePrefix', 'Rotating phrase prefix'),
      strings('phrases', 'Rotating phrases'),
      link('primaryCta', 'Primary button'),
      link('secondaryCta', 'Secondary button'),
      image('illustrationDarkUrl', 'Illustration (dark theme)'),
      image('illustrationLightUrl', 'Illustration (light theme)'),
      text('illustrationAlt', 'Illustration description', 'Read by screen readers'),
    ],
  },
  SystemsSection: {
    label: 'Systems',
    description: 'Scroll-zoom story with three system cards',
    fields: [
      text('eyebrow', 'Eyebrow'),
      text('headline', 'Headline'),
      text('headlineAccent', 'Headline accent'),
      text('ctaLabel', 'Card button label'),
      text('ctaHref', 'Card button link'),
      {
        kind: 'list', key: 'systems', label: 'System cards', itemLabel: 'card', idPrefix: 'system', min: 3, max: 3,
        fields: [text('num', 'Number'), text('label', 'Label'), area('title', 'Title'), area('description', 'Description'), image('imageUrl', 'Image'), text('imageAlt', 'Image description')],
        summary: (item, index) => numbered(item, index, 'label'),
        newItem: () => ({ num: '01', label: 'System', title: 'System title', description: '', imageUrl: '', imageAlt: '' }),
      },
      {
        kind: 'list', key: 'backgroundImages', label: 'Zoom background images', itemLabel: 'image', min: 6, max: 6,
        fields: [image('url', 'Image'), text('alt', 'Image description')],
        summary: (item, index) => numbered(item, index, 'alt'),
        newItem: () => ({ url: '', alt: '' }),
      },
    ],
  },
  ProblemSolutionSection: {
    label: 'Problem & solution',
    description: 'Three pain points and the Miduva answer',
    fields: [
      text('problemEyebrow', 'Problem eyebrow'),
      text('problemHeadline', 'Problem headline'),
      {
        kind: 'list', key: 'problems', label: 'Problem cards', itemLabel: 'card', idPrefix: 'problem', min: 3, max: 3,
        fields: [
          text('num', 'Number'), text('label', 'Label'), text('title', 'Title'), area('detail', 'Detail'),
          { kind: 'select', key: 'icon', label: 'Icon', options: [{ label: 'Cross', value: 'close' }, { label: 'Alert', value: 'alert' }] },
        ],
        summary: (item, index) => numbered(item, index, 'title'),
        newItem: () => ({ num: '01', label: 'Trap', title: 'Problem', detail: '', icon: 'close' }),
      },
      {
        kind: 'group', key: 'solution', label: 'Solution',
        fields: [
          text('headline', 'Headline'), text('headlineAccent', 'Headline accent'), text('subheadline', 'Subheadline'),
          strings('bullets', 'Bullet points'), text('ctaLabel', 'Button label'), text('ctaHref', 'Button link'), text('bottomNote', 'Bottom note'),
        ],
      },
    ],
  },
  HowItWorksSection: {
    label: 'How it works',
    description: 'Step-by-step process',
    fields: [
      text('eyebrow', 'Eyebrow'),
      text('headline', 'Headline'),
      text('headlineAccent', 'Headline accent'),
      {
        kind: 'list', key: 'steps', label: 'Steps', itemLabel: 'step', idPrefix: 'step', max: 8,
        fields: [text('num', 'Number'), text('title', 'Title'), area('description', 'Description'), image('imageUrl', 'Image'), text('imageAlt', 'Image description')],
        summary: (item, index) => numbered(item, index, 'title'),
        newItem: () => ({ num: '05', title: 'New step', description: '', imageUrl: '/assets/visuals/analyze.webp', imageAlt: '' }),
      },
    ],
  },
  ResultsSection: {
    label: 'Results',
    description: 'Headline numbers',
    fields: [
      text('eyebrow', 'Eyebrow'),
      text('headline', 'Headline'),
      area('subheadline', 'Subheadline'),
      {
        kind: 'list', key: 'stats', label: 'Statistics', itemLabel: 'statistic', idPrefix: 'stat', max: 8,
        fields: [{ kind: 'number', key: 'value', label: 'Value', min: 0, max: 1_000_000 }, text('suffix', 'Suffix', 'e.g. +, %, x'), text('label', 'Label'), text('sub', 'Small print')],
        summary: (item, index) => str(item.label) ? `${str(item.value)}${str(item.suffix)} ${str(item.label)}` : `Statistic ${index + 1}`,
        newItem: () => ({ value: 0, suffix: '+', label: 'Metric', sub: 'Description' }),
      },
      text('trustNote', 'Trust note'),
      text('ctaLabel', 'Button label'),
      text('ctaHref', 'Button link'),
    ],
  },
  OurWorkSection: {
    label: 'Our work',
    description: 'Client logo rail',
    fields: [
      text('eyebrow', 'Eyebrow'),
      text('headline', 'Headline'),
      text('ariaLabel', 'Logo rail description', 'Read by screen readers'),
      {
        kind: 'list', key: 'logos', label: 'Client logos', itemLabel: 'logo', max: 30,
        fields: [
          image('src', 'Logo'), text('name', 'Client name'), text('category', 'Category'),
          { kind: 'select', key: 'size', label: 'Logo shape', options: [{ label: 'Compact', value: 'compact' }, { label: 'Wide', value: 'wide' }, { label: 'Tall', value: 'tall' }] },
        ],
        summary: (item, index) => numbered(item, index, 'name'),
        newItem: () => ({ src: '', name: 'New client', category: 'Client', size: 'compact' }),
      },
    ],
  },
  WhyMiduvaSection: {
    label: 'Why Miduva',
    description: 'Statement and differentiators',
    fields: [
      text('eyebrow', 'Eyebrow'),
      text('statementLead', 'Statement opening'),
      text('statementOldWay', 'Struck-through phrase'),
      text('statementBridge', 'Statement bridge'),
      text('statementAccent', 'Statement accent'),
      text('statementTail', 'Statement ending'),
      text('wideStatValue', 'Wide card statistic'),
      text('wideStatLabel', 'Wide card statistic label'),
      {
        kind: 'list', key: 'differentiators', label: 'Differentiators', itemLabel: 'differentiator', idPrefix: 'difference', max: 8,
        fields: [text('num', 'Number'), text('title', 'Title'), text('subtitle', 'Subtitle'), text('oldWay', 'Old way'), text('newWay', 'New way')],
        summary: (item, index) => numbered(item, index, 'title'),
        newItem: () => ({ num: '05', title: 'Difference', subtitle: '', oldWay: '', newWay: '' }),
      },
    ],
  },
  ParallaxSection: {
    label: 'The difference',
    description: 'Big "Built as a system." statement',
    fields: [
      text('eyebrow', 'Eyebrow'),
      text('headline', 'Headline'),
      text('headlineAccent', 'Headline accent'),
    ],
  },
  ServicesSection: {
    label: 'Services',
    description: 'Service categories',
    fields: [
      text('eyebrow', 'Eyebrow'),
      text('headline', 'Headline'),
      text('headlineAccent', 'Headline accent'),
      text('activeLabel', 'Active item label'),
      text('servicesLabel', 'Services count label'),
      text('ctaLabel', 'Button label'),
      text('ctaHref', 'Button link'),
      {
        kind: 'list', key: 'categories', label: 'Service categories', itemLabel: 'category', idPrefix: 'service', max: 12,
        fields: [text('title', 'Title'), strings('items', 'Services'), image('imageUrl', 'Image'), text('imageAlt', 'Image description')],
        summary: (item, index) => numbered(item, index, 'title'),
        newItem: () => ({ title: 'New service', items: ['Service item'], imageUrl: '/assets/visuals/growth-marketing.webp', imageAlt: '' }),
      },
    ],
  },
  GrowthOsSection: {
    label: 'Growth OS',
    description: 'Module grid',
    fields: [
      text('eyebrow', 'Eyebrow'),
      text('headline', 'Headline'),
      text('headlineAccent', 'Headline accent'),
      area('description', 'Description'),
      text('ctaLabel', 'Button label'),
      text('ctaHref', 'Button link'),
      {
        kind: 'list', key: 'modules', label: 'Modules', itemLabel: 'module', max: 12,
        fields: [
          text('name', 'Name'), text('tag', 'Tag'), area('description', 'Description'),
          { kind: 'select', key: 'color', label: 'Colour', options: [{ label: 'Teal', value: 'teal' }, { label: 'Navy', value: 'navy' }] },
          { kind: 'select', key: 'span', label: 'Width', options: [{ label: 'One column', value: 1 }, { label: 'Two columns', value: 2 }] },
          { kind: 'select', key: 'visual', label: 'Visual', options: ['bars', 'funnel', 'nodes', 'grid', 'rings', 'spark'].map((value) => ({ label: value[0].toUpperCase() + value.slice(1), value })) },
        ],
        summary: (item, index) => numbered(item, index, 'name'),
        newItem: () => ({ name: 'Module', tag: 'System', description: '', color: 'teal', span: 1, visual: 'bars' }),
      },
    ],
  },
  FaqSection: {
    label: 'FAQ',
    description: 'Questions and answers',
    fields: [
      text('eyebrow', 'Eyebrow'),
      text('headline', 'Headline'),
      area('body', 'Intro text'),
      {
        kind: 'list', key: 'items', label: 'Questions', itemLabel: 'question', idPrefix: 'faq', max: 20,
        fields: [text('num', 'Number'), text('question', 'Question'), area('answer', 'Answer')],
        summary: (item, index) => numbered(item, index, 'question'),
        newItem: () => ({ num: '', question: 'New question?', answer: 'Answer.' }),
      },
    ],
  },
  FreeOfferSection: {
    label: 'Free offer',
    description: 'Lead magnet call-to-action',
    fields: [
      text('eyebrow', 'Eyebrow'),
      text('headlineLine1', 'Headline line 1'),
      text('headlineAccent', 'Headline accent'),
      text('headlineLine3', 'Headline line 3'),
      text('ctaLabel', 'Button label'),
      text('ctaHref', 'Button link'),
      text('trustNote', 'Trust note'),
    ],
  },
  ContactSection: {
    label: 'Contact',
    description: 'Contact details and form',
    fields: [
      text('eyebrow', 'Eyebrow'),
      text('headline', 'Headline'),
      text('headlineAccent', 'Headline accent'),
      area('body', 'Intro text'),
      {
        kind: 'group', label: 'Free strategy call',
        fields: [
          text('bookingUrl', 'Calendar booking link', 'Your Cal.com (or Calendly) link, e.g. https://cal.com/miduva/strategy-call. Leave empty to send people to the form instead.'),
          text('bookingEyebrow', 'Eyebrow'),
          text('bookingHeadline', 'Headline'),
          text('bookingAccent', 'Headline accent'),
          area('bookingBody', 'Text'),
          text('bookingCtaLabel', 'Button'),
          text('bookingNote', 'Small print'),
        ],
      },
      text('infoHeadline', 'Direct contact headline'),
      area('infoBody', 'Direct contact text'),
      {
        kind: 'list', key: 'contactInfo', label: 'Contact details', itemLabel: 'detail', min: 1, max: 4,
        fields: [
          { kind: 'select', key: 'icon', label: 'Icon', options: [{ label: 'Mail', value: 'mail' }, { label: 'Building', value: 'building' }] },
          text('label', 'Text'),
        ],
        summary: (item, index) => numbered(item, index, 'label'),
        newItem: () => ({ icon: 'mail', label: 'hello@miduva.com' }),
      },
      {
        kind: 'group', label: 'Form labels',
        fields: [
          text('formHeadline', 'Form headline'), text('formSubheadline', 'Form subheadline'),
          text('nameLabel', 'Name label'), text('namePlaceholder', 'Name placeholder'),
          text('emailLabel', 'Email label'), text('emailPlaceholder', 'Email placeholder'),
          text('companyLabel', 'Company label'), text('companyPlaceholder', 'Company placeholder'),
          text('messageLabel', 'Message label'), text('messagePlaceholder', 'Message placeholder'),
          text('submitLabel', 'Submit button'), text('submittingLabel', 'Sending label'), text('finePrint', 'Fine print'),
        ],
      },
      {
        kind: 'group', label: 'Form messages',
        fields: [
          text('successHeadline', 'Success headline'), area('successBody', 'Success message'), text('resetLabel', 'Send another button'),
          text('errorMessage', 'Sending failed'), text('nameRequiredMessage', 'Name missing'), text('emailRequiredMessage', 'Email missing'),
          text('emailInvalidMessage', 'Email invalid'), text('messageRequiredMessage', 'Message missing'), text('messageTooShortMessage', 'Message too short'),
        ],
      },
    ],
  },
  FooterSection: {
    label: 'Footer',
    description: 'Closing call-to-action and links',
    fields: [
      text('giantBgText', 'Background word'),
      text('heading', 'Heading'),
      strings('marqueeItems', 'Scrolling words'),
      { ...(linkList('primaryCtas', 'Main buttons', 4) as ListDef), min: 1 },
      { ...(linkList('secondaryLinks', 'Footer links') as ListDef), min: 1 },
      text('copyright', 'Copyright'),
      text('createdByLabel', 'Created by label'),
      text('createdByName', 'Creator name'),
      text('backToTopLabel', 'Back-to-top description', 'Read by screen readers'),
    ],
  },
}

export const SETTINGS_SCHEMA: FieldDef[] = [
  {
    kind: 'group', key: 'seo', label: 'Search & sharing',
    fields: [text('title', 'Page title', 'Shown in Google and browser tabs'), area('description', 'Page description', 'Shown under the title in Google')],
  },
  {
    kind: 'group', key: 'branding', label: 'Logo',
    fields: [image('logoDarkUrl', 'Logo on dark backgrounds'), image('logoLightUrl', 'Logo on light backgrounds'), text('logoAlt', 'Logo description')],
  },
  {
    kind: 'group', key: 'nav', label: 'Navigation menu',
    fields: [linkList('leftLinks', 'Left links'), linkList('rightLinks', 'Right links')],
  },
]

// Each Miduva section may appear once (the server enforces it). A removed section
// can be added back and starts from its original default content.
export const MIDUVA_SECTIONS = Object.fromEntries(
  (Object.keys(SECTION_SCHEMAS) as SectionType[]).map((type): [SectionType, SectionDefinition] => [type, {
    ...SECTION_SCHEMAS[type],
    single: true,
    defaults: () => structuredClone(DEFAULT_SECTION_PROPS[type]) as Record<string, unknown>,
  }]),
) as Record<SectionType, SectionDefinition>

export function isSectionType(value: unknown): value is SectionType {
  return typeof value === 'string' && value in SECTION_SCHEMAS
}
