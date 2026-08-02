import type { Data, Slot } from '@puckeditor/core'
import type {
  BrandingData,
  ContactData,
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
} from '@/lib/types'

export type LandingPageComponents = {
  HeroSection: HeroData
  SystemsSection: SystemsSectionData
  ProblemSolutionSection: ProblemSolutionData
  HowItWorksSection: HowItWorksData
  ResultsSection: ResultsData
  OurWorkSection: OurWorkData
  WhyMiduvaSection: WhyMiduvaData
  ParallaxSection: ParallaxData
  ServicesSection: ServicesData
  GrowthOsSection: GrowthOsData
  FaqSection: FaqData
  FreeOfferSection: FreeOfferData
  ContactSection: ContactData
  FooterSection: FooterData
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
  beforeDashboard?: Slot<LandingPageComponents>
  afterDashboard?: Slot<LandingPageComponents>
}

export type LandingPagePuckData = Data<LandingPageComponents, LandingPageRootProps>

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
  'FooterSection',
] as const satisfies readonly (keyof LandingPageComponents)[]
