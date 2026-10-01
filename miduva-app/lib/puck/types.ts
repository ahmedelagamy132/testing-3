import type {
  BrandingData,
  ContactData,
  SocialData,
  DashboardData,
  FaqData,
  FooterData,
  FreeOfferData,
  GrowthOsData,
  HeroData,
  HowItWorksData,
  NavData,
  OurWorkData,
  ParallaxData,
  ProblemSolutionData,
  ResultsData,
  ServicesData,
  SystemsSectionData,
  WhyMiduvaData,
  SystemCard,
  SystemBackgroundImage,
  ProblemCard,
  HowItWorksStep,
  StatCard,
  ClientLogoData,
  DifferentiatorCard,
  ServiceCategory,
  GrowthOsModule,
  FaqItem as FaqItemData,
} from '@/lib/types'

// Stored page documents keep the shape the previous (Puck) editor wrote, so
// existing drafts, published pages and revisions stay readable.
export type StoredComponent = { type: string; props: Record<string, unknown> & { id?: string } }
type Slot = StoredComponent[]

export type NativeItemProps<T> = Omit<T, 'id'> & { itemId: string }

export type NativeSectionSlots = {
  systemItems?: Slot
  systemBackgroundItems?: Slot
  problemItems?: Slot
  stepItems?: Slot
  statItems?: Slot
  logoItems?: Slot
  differentiatorItems?: Slot
  serviceItems?: Slot
  moduleItems?: Slot
  faqItems?: Slot
}

export type LandingPageComponents = {
  HeroSection: HeroData
  SystemsSection: SystemsSectionData & Pick<NativeSectionSlots, 'systemItems' | 'systemBackgroundItems'>
  ProblemSolutionSection: ProblemSolutionData & Pick<NativeSectionSlots, 'problemItems'>
  HowItWorksSection: HowItWorksData & Pick<NativeSectionSlots, 'stepItems'>
  ResultsSection: ResultsData & Pick<NativeSectionSlots, 'statItems'>
  OurWorkSection: OurWorkData & Pick<NativeSectionSlots, 'logoItems'>
  WhyMiduvaSection: WhyMiduvaData & Pick<NativeSectionSlots, 'differentiatorItems'>
  ParallaxSection: ParallaxData
  ServicesSection: ServicesData & Pick<NativeSectionSlots, 'serviceItems'>
  GrowthOsSection: GrowthOsData & Pick<NativeSectionSlots, 'moduleItems'>
  FaqSection: FaqData & Pick<NativeSectionSlots, 'faqItems'>
  FreeOfferSection: FreeOfferData
  ContactSection: ContactData
  SocialSection: SocialData
  FooterSection: FooterData
  SystemCardItem: NativeItemProps<SystemCard>
  SystemBackgroundItem: NativeItemProps<SystemBackgroundImage>
  ProblemCardItem: NativeItemProps<ProblemCard>
  HowStepItem: NativeItemProps<HowItWorksStep>
  ResultStatItem: NativeItemProps<StatCard>
  ClientLogoItem: NativeItemProps<ClientLogoData>
  DifferentiatorItem: NativeItemProps<DifferentiatorCard>
  ServiceCategoryItem: NativeItemProps<ServiceCategory>
  GrowthModuleItem: NativeItemProps<GrowthOsModule>
  FaqItem: NativeItemProps<FaqItemData>
}

export type SeoData = {
  title?: string
  description?: string
}

export type LandingPageRootProps = {
  title?: string
  defaultTheme?: 'dark' | 'light'
  seo?: SeoData
  branding?: BrandingData
  nav?: NavData
  dashboard?: DashboardData
  beforeDashboard?: Slot
  afterDashboard?: Slot
}

export type LandingPagePuckData = {
  content: StoredComponent[]
  root: { props?: LandingPageRootProps }
}

export type PuckPageDocument = {
  draft: LandingPagePuckData
  published: LandingPagePuckData
  version: number
  draftUpdatedAt: string | null
  publishedAt: string | null
}

export type PuckRevision = {
  id: number
  createdAt: string
  data: LandingPagePuckData
}

export type PuckMedia = {
  id: string
  url: string
  originalName: string
  mimeType: string
  width: number
  height: number
  size: number
  createdAt: string
  source: 'upload' | 'static'
}

export const SECTION_COMPONENT_NAMES = [
  'HeroSection',
  'SystemsSection',
  'ProblemSolutionSection',
  'HowItWorksSection',
  'ResultsSection',
  'OurWorkSection',
  'WhyMiduvaSection',
  'ParallaxSection',
  'ServicesSection',
  'GrowthOsSection',
  'FaqSection',
  'FreeOfferSection',
  'ContactSection',
  'SocialSection',
  'FooterSection',
] as const satisfies readonly (keyof LandingPageComponents)[]

export const NATIVE_ITEM_COMPONENT_NAMES = [
  'SystemCardItem',
  'SystemBackgroundItem',
  'ProblemCardItem',
  'HowStepItem',
  'ResultStatItem',
  'ClientLogoItem',
  'DifferentiatorItem',
  'ServiceCategoryItem',
  'GrowthModuleItem',
  'FaqItem',
] as const satisfies readonly (keyof LandingPageComponents)[]
