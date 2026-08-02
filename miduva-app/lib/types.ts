export interface NavLink { label: string; href: string }
export interface NavData { leftLinks?: NavLink[]; rightLinks?: NavLink[] }

export interface HeroCta { label: string; href: string }
export interface HeroData {
  headline?: string; tagline?: string; body?: string
  phrasePrefix?: string
  phrases?: string[]; primaryCta?: HeroCta; secondaryCta?: HeroCta
  illustrationDarkUrl?: string; illustrationLightUrl?: string
  illustrationAlt?: string
}

export interface BrandingData {
  logoDarkUrl?: string
  logoLightUrl?: string
  logoAlt?: string
}

export interface SystemCard {
  id: string; num: string; label: string
  title: string; description: string; imageUrl: string; imageAlt?: string
}
export interface SystemBackgroundImage { url: string; alt: string }
export interface SystemsSectionData {
  eyebrow?: string; headline?: string; headlineAccent?: string
  ctaLabel?: string; ctaHref?: string
  systems?: SystemCard[]
  backgroundImages?: SystemBackgroundImage[]
}

export interface ProblemCard {
  id: string; num: string; label: string
  title: string; detail: string; icon: "close" | "alert"
}
export interface SolutionData {
  headline?: string; headlineAccent?: string; subheadline?: string
  bullets?: string[]; ctaLabel?: string; ctaHref?: string; bottomNote?: string
}
export interface ProblemSolutionData {
  problemEyebrow?: string; problemHeadline?: string
  problems?: ProblemCard[]; solution?: SolutionData
}

export interface StatCard { id: string; value: number; suffix: string; label: string; sub: string }
export interface ResultsData {
  eyebrow?: string; headline?: string; subheadline?: string
  stats?: StatCard[]; trustNote?: string; ctaLabel?: string; ctaHref?: string
}

export interface ParallaxData {
  eyebrow?: string; headline?: string; headlineAccent?: string; description?: string
  pipelineLabel?: string; pipelineValue?: string; pipelineDelta?: string
  pipelineComparison?: string; chartValues?: number[]
  bottomLabel?: string; bottomDescription?: string
}

export interface DifferentiatorCard {
  id: string; num: string; title: string; subtitle: string; oldWay: string; newWay: string
}
export interface WhyMiduvaData {
  eyebrow?: string; watermark?: string
  statementLead?: string; statementOldWay?: string; statementBridge?: string
  statementAccent?: string; statementTail?: string
  wideStatValue?: string; wideStatLabel?: string
  differentiators?: DifferentiatorCard[]
}

export interface HowItWorksStep {
  id: string; num: string; title: string; description: string; imageUrl: string; imageAlt?: string
}
export interface HowItWorksData { eyebrow?: string; headline?: string; headlineAccent?: string; steps?: HowItWorksStep[] }

export interface ServiceCategory { id: string; title: string; items: string[]; imageUrl: string; imageAlt?: string }
export interface ServicesData {
  eyebrow?: string; headline?: string; headlineAccent?: string
  activeLabel?: string; servicesLabel?: string
  ctaLabel?: string; ctaHref?: string; categories?: ServiceCategory[]
}

export interface FaqItem { id: string; num: string; question: string; answer: string }
export interface FaqData { eyebrow?: string; headline?: string; body?: string; items?: FaqItem[] }

export interface DashboardKpi { label: string; value: string; delta: string; color: 'teal' | 'navy' }
export interface DashboardFunnelStage { name: string; value: string }
export interface DashboardClient { initials: string; name: string }
export interface DashboardData {
  urlLabel?: string; statusLabel?: string
  syncLabel?: string
  navItems?: string[]
  systemLabel?: string; clientsLabel?: string
  clients?: DashboardClient[]
  eyebrow?: string; title?: string
  rangeLabels?: string[]; activeRangeIndex?: number
  kpis?: DashboardKpi[]
  chartTitle?: string; chartSubtitle?: string
  chartLegend?: string[]; chartAxisLabels?: string[]; chartWeekLabels?: string[]
  chartValues?: number[]
  funnelTitle?: string; funnelStages?: DashboardFunnelStage[]
  optimizedLabel?: string
  automationLabel?: string; automationHealth?: number
}

export interface ClientLogoData {
  src: string
  name: string
  category: string
  size?: 'wide' | 'compact' | 'tall'
}
export interface OurWorkData {
  eyebrow?: string
  headline?: string
  ariaLabel?: string
  logos?: ClientLogoData[]
}

export type GrowthOsVisual = 'bars' | 'funnel' | 'nodes' | 'grid' | 'rings' | 'spark'
export interface GrowthOsModule {
  name: string; tag: string; description: string
  color: 'teal' | 'navy'; span: 1 | 2; visual: GrowthOsVisual
}
export interface GrowthOsData {
  eyebrow?: string; headline?: string; headlineAccent?: string
  description?: string; ctaLabel?: string; ctaHref?: string
  modules?: GrowthOsModule[]
}

export interface FreeOfferData {
  eyebrow?: string
  headlineLine1?: string; headlineAccent?: string; headlineLine3?: string
  includes?: string[]
  ctaLabel?: string; ctaHref?: string
  trustNote?: string
}

export interface ContactInfoRow { icon: 'mail' | 'building'; label: string }
export interface ContactTrustStat { stat: string; label: string }
export interface ContactServiceOption { value: string; label: string }
export interface ContactData {
  eyebrow?: string; headline?: string; headlineAccent?: string; body?: string
  contactInfo?: ContactInfoRow[]
  trustStats?: ContactTrustStat[]
  formHeadline?: string; formSubheadline?: string
  serviceOptions?: ContactServiceOption[]
  nameLabel?: string; namePlaceholder?: string
  emailLabel?: string; emailPlaceholder?: string
  companyLabel?: string; companyPlaceholder?: string
  serviceLabel?: string; servicePlaceholder?: string
  messageLabel?: string; messagePlaceholder?: string
  submitLabel?: string; submittingLabel?: string; finePrint?: string
  successHeadline?: string; successBody?: string; resetLabel?: string; errorMessage?: string
  nameRequiredMessage?: string; emailRequiredMessage?: string; emailInvalidMessage?: string
  serviceRequiredMessage?: string; messageRequiredMessage?: string; messageTooShortMessage?: string
}

export interface FooterLink { label: string; href: string }
export interface FooterData {
  giantBgText?: string; heading?: string
  marqueeItems?: string[]
  primaryCtas?: FooterLink[]
  secondaryLinks?: FooterLink[]
  copyright?: string; createdByLabel?: string; createdByName?: string; backToTopLabel?: string
}

export type SectionId =
  | 'hero' | 'systems' | 'problem-solution' | 'how-it-works' | 'results'
  | 'our-work' | 'why-miduva' | 'parallax' | 'dashboard' | 'services' | 'growth-os'
  | 'faq' | 'free-offer' | 'contact' | 'footer'

export interface LayoutSectionEntry { id: SectionId; visible: boolean }
export interface LayoutData { sections?: LayoutSectionEntry[] }

export interface LandingPageData {
  branding?: BrandingData
  nav?: NavData; hero?: HeroData; systems?: SystemsSectionData
  problemSolution?: ProblemSolutionData; results?: ResultsData; parallax?: ParallaxData
  whyMiduva?: WhyMiduvaData; howItWorks?: HowItWorksData; services?: ServicesData
  ourWork?: OurWorkData
  faq?: FaqData
  dashboard?: DashboardData
  growthOs?: GrowthOsData
  freeOffer?: FreeOfferData
  contact?: ContactData
  footer?: FooterData
  layout?: LayoutData
}
