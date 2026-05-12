export interface NavLink { label: string; href: string }
export interface NavData { leftLinks?: NavLink[]; rightLinks?: NavLink[] }

export interface KpiItem { key: string; value: string }

export interface HeroCta { label: string; href: string }
export interface HeroData {
  headline?: string; tagline?: string; body?: string
  phrases?: string[]; primaryCta?: HeroCta; secondaryCta?: HeroCta
}

export interface SystemCard {
  id: string; num: string; label: string
  title: string; description: string; imageUrl: string
}
export interface SystemsSectionData {
  eyebrow?: string; headline?: string; headlineAccent?: string; systems?: SystemCard[]
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
  eyebrow?: string; headline?: string; description?: string
  pipelineLabel?: string; pipelineValue?: string; pipelineDelta?: string
  bottomLabel?: string; bottomDescription?: string
}

export interface DifferentiatorCard {
  id: string; num: string; title: string; subtitle: string; oldWay: string; newWay: string
}
export interface WhyMiduvaData { eyebrow?: string; differentiators?: DifferentiatorCard[] }

export interface HowItWorksStep {
  id: string; num: string; title: string; description: string; imageUrl: string
}
export interface HowItWorksData { eyebrow?: string; headline?: string; steps?: HowItWorksStep[] }

export interface ServiceCategory { id: string; title: string; items: string[]; imageUrl: string }
export interface ServicesData {
  eyebrow?: string; headline?: string; headlineAccent?: string
  ctaLabel?: string; ctaHref?: string; categories?: ServiceCategory[]
}

export interface FaqItem { id: string; num: string; question: string; answer: string }
export interface FaqData { items?: FaqItem[] }

export interface LandingPageData {
  nav?: NavData; kpis?: KpiItem[]; hero?: HeroData; systems?: SystemsSectionData
  problemSolution?: ProblemSolutionData; results?: ResultsData; parallax?: ParallaxData
  whyMiduva?: WhyMiduvaData; howItWorks?: HowItWorksData; services?: ServicesData
  faq?: FaqData
}
