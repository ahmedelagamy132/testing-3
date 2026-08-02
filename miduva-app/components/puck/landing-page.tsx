"use client"

import { createContext, useCallback, useContext, useRef, useState } from "react"
import type { RefObject } from "react"
import type { SlotComponent } from "@puckeditor/core"
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
} from "@/lib/types"
import Nav from "@/components/nav"
import SvgMaskHero from "@/components/svg-mask-hero"
import HeroContent from "@/components/hero-content"
import Dashboard from "@/components/dashboard"
import SystemsZoomSection from "@/components/systems-zoom-section"
import ProblemSolution from "@/components/problem-solution"
import HowItWorks from "@/components/how-it-works"
import ResultsStats from "@/components/results-stats"
import OurWork from "@/components/our-work"
import WhyMiduva from "@/components/why-miduva"
import ParallaxSection from "@/components/parallax-section"
import Services from "@/components/services"
import SystemRibbon from "@/components/system-ribbon"
import FaqSection from "@/components/faq-section"
import FreeOffer from "@/components/free-offer"
import ContactSection from "@/components/contact-section"
import { CinematicFooter } from "@/components/ui/motion-footer"
import { FrameRuntimeProvider, FrameThemeSync } from "@/components/puck/frame-runtime"

type LandingContextValue = {
  theme: "dark" | "light"
  navRef: RefObject<HTMLElement | null>
  onRevealComplete: () => void
  onRevealReverse: () => void
}

const LandingContext = createContext<LandingContextValue | null>(null)

function useLandingContext() {
  const value = useContext(LandingContext)
  if (!value) throw new Error("Landing page sections must render inside LandingPageRoot")
  return value
}

export function LandingPageRoot({
  beforeDashboard,
  afterDashboard,
  branding,
  nav,
  dashboard,
  defaultTheme = "dark",
}: {
  beforeDashboard?: SlotComponent
  afterDashboard?: SlotComponent
  branding?: BrandingData
  nav?: NavData
  dashboard?: DashboardData
  defaultTheme?: "dark" | "light"
}) {
  const [theme, setTheme] = useState<"dark" | "light">(defaultTheme)
  const [heroRevealed, setHeroRevealed] = useState(true)
  const navRef = useRef<HTMLElement>(null)

  const onRevealComplete = useCallback(() => setHeroRevealed(true), [])
  const onRevealReverse = useCallback(() => setHeroRevealed(false), [])

  return (
    <FrameRuntimeProvider className="relative min-h-screen overflow-x-clip">
      <FrameThemeSync theme={theme} />
      <LandingContext.Provider value={{ theme, navRef, onRevealComplete, onRevealReverse }}>
        <div id="anchor-nav" className="preview-anchor preview-nav-backdrop">
          <Nav
            ref={navRef}
            theme={theme}
            setTheme={setTheme}
            heroRevealed={heroRevealed}
            data={nav}
            branding={branding}
          />
        </div>
        <main>
          {beforeDashboard?.({ className: "puck-section-slot", minEmptyHeight: 72 })}
          <div id="anchor-dashboard" className="preview-anchor">
            <div className="hidden px-6 py-10 md:block md:py-14">
              <div className="max-w-6xl mx-auto p-3 rounded-[32px] border-2 border-dashed border-[var(--line)]">
                <Dashboard data={dashboard} />
              </div>
            </div>
          </div>
          {afterDashboard?.({ className: "puck-section-slot", minEmptyHeight: 72 })}
        </main>
      </LandingContext.Provider>
    </FrameRuntimeProvider>
  )
}

function Anchor({ id, children }: { id: string; children: React.ReactNode }) {
  return <div id={`anchor-${id}`} className="preview-anchor">{children}</div>
}

export function PuckHeroSection(props: HeroData) {
  const { theme, navRef, onRevealComplete, onRevealReverse } = useLandingContext()
  return (
    <Anchor id="hero">
      <div className="relative">
        <SvgMaskHero
          theme={theme}
          onRevealComplete={onRevealComplete}
          onRevealReverse={onRevealReverse}
          scanTarget={navRef}
          illustrationDarkUrl={props.illustrationDarkUrl}
          illustrationLightUrl={props.illustrationLightUrl}
          illustrationAlt={props.illustrationAlt}
        >
          <HeroContent theme={theme} data={props} />
        </SvgMaskHero>
      </div>
    </Anchor>
  )
}

export const PuckSystemsSection = (props: SystemsSectionData) => <Anchor id="systems"><SystemsZoomSection data={props} /></Anchor>
export const PuckProblemSolutionSection = (props: ProblemSolutionData) => <Anchor id="problem-solution"><ProblemSolution data={props} /></Anchor>
export const PuckHowItWorksSection = (props: HowItWorksData) => <Anchor id="how-it-works"><HowItWorks data={props} /></Anchor>
export const PuckResultsSection = (props: ResultsData) => <Anchor id="results"><ResultsStats data={props} /></Anchor>
export const PuckOurWorkSection = (props: OurWorkData) => <Anchor id="our-work"><OurWork data={props} /></Anchor>
export const PuckWhyMiduvaSection = (props: WhyMiduvaData) => <Anchor id="why-miduva"><WhyMiduva data={props} /></Anchor>
export const PuckParallaxSection = (props: ParallaxData) => <Anchor id="parallax"><ParallaxSection data={props} /></Anchor>
export const PuckServicesSection = (props: ServicesData) => <Anchor id="services"><Services data={props} /></Anchor>
export const PuckGrowthOsSection = (props: GrowthOsData) => <Anchor id="growth-os"><SystemRibbon data={props} /></Anchor>
export const PuckFaqSection = (props: FaqData) => <Anchor id="faq"><FaqSection data={props} /></Anchor>

export function PuckFreeOfferSection(props: FreeOfferData) {
  const { theme } = useLandingContext()
  return <Anchor id="free-offer"><div className="h-4 md:h-20" /><FreeOffer theme={theme} data={props} /></Anchor>
}

export const PuckContactSection = (props: ContactData) => <Anchor id="contact"><ContactSection data={props} /></Anchor>
export const PuckFooterSection = (props: FooterData) => <Anchor id="footer"><CinematicFooter data={props} /></Anchor>
