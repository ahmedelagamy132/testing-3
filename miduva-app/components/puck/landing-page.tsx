"use client"

import { createContext, useCallback, useContext, useRef, useState } from "react"
import type { RefObject } from "react"
import type {
  ContactData,
  SocialData,
  FaqData,
  FooterData,
  FreeOfferData,
  GrowthOsData,
  HeroData,
  HowItWorksData,
  OurWorkData,
  ParallaxData,
  ProblemSolutionData,
  ResultsData,
  ServicesData,
  SystemsSectionData,
  WhyMiduvaData,
} from "@/lib/types"
import type { LandingContent, SectionEntry } from "@/lib/site-editor/content"
import type { SectionType } from "@/lib/site-editor/schema"
import Nav from "@/components/nav"
import SvgMaskHero from "@/components/svg-mask-hero"
import HeroContent from "@/components/hero-content"
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
import SocialSection from "@/components/social-section"
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
  if (!value) throw new Error("Landing page sections must render inside LandingPage")
  return value
}

function HeroSection({ data }: { data: HeroData }) {
  const { theme, navRef, onRevealComplete, onRevealReverse } = useLandingContext()
  return (
    <div className="relative">
      <SvgMaskHero
        theme={theme}
        onRevealComplete={onRevealComplete}
        onRevealReverse={onRevealReverse}
        scanTarget={navRef}
        illustrationDarkUrl={data.illustrationDarkUrl}
        illustrationLightUrl={data.illustrationLightUrl}
        illustrationAlt={data.illustrationAlt}
      >
        <HeroContent theme={theme} data={data} />
      </SvgMaskHero>
    </div>
  )
}

function FreeOfferSection({ data }: { data: FreeOfferData }) {
  const { theme } = useLandingContext()
  return <FreeOffer theme={theme} data={data} />
}

/* eslint-disable @typescript-eslint/no-explicit-any -- section props are validated server-side against the schema */
const SECTIONS: Record<SectionType, { anchor: string; render: (data: any) => React.ReactNode }> = {
  HeroSection: { anchor: "hero", render: (data: HeroData) => <HeroSection data={data} /> },
  SystemsSection: { anchor: "systems", render: (data: SystemsSectionData) => <SystemsZoomSection data={data} /> },
  ProblemSolutionSection: { anchor: "problem-solution", render: (data: ProblemSolutionData) => <ProblemSolution data={data} /> },
  HowItWorksSection: { anchor: "how-it-works", render: (data: HowItWorksData) => <HowItWorks data={data} /> },
  ResultsSection: { anchor: "results", render: (data: ResultsData) => <ResultsStats data={data} /> },
  OurWorkSection: { anchor: "our-work", render: (data: OurWorkData) => <OurWork data={data} /> },
  WhyMiduvaSection: { anchor: "why-miduva", render: (data: WhyMiduvaData) => <WhyMiduva data={data} /> },
  ParallaxSection: { anchor: "parallax", render: (data: ParallaxData) => <ParallaxSection data={data} /> },
  ServicesSection: { anchor: "services", render: (data: ServicesData) => <Services data={data} /> },
  GrowthOsSection: { anchor: "growth-os", render: (data: GrowthOsData) => <SystemRibbon data={data} /> },
  FaqSection: { anchor: "faq", render: (data: FaqData) => <FaqSection data={data} /> },
  FreeOfferSection: { anchor: "free-offer", render: (data: FreeOfferData) => <FreeOfferSection data={data} /> },
  ContactSection: { anchor: "contact", render: (data: ContactData) => <ContactSection data={data} /> },
  SocialSection: { anchor: "social", render: (data: SocialData) => <SocialSection data={data} /> },
  FooterSection: { anchor: "footer", render: (data: FooterData) => <CinematicFooter data={data} /> },
}
/* eslint-enable @typescript-eslint/no-explicit-any */

// Sections shown on a bright background to break up the dark page.
const LIGHT_SECTIONS = new Set<SectionType>(["ProblemSolutionSection", "HowItWorksSection", "ServicesSection"])

function Section({ section }: { section: SectionEntry }) {
  const definition = SECTIONS[section.type]
  const light = LIGHT_SECTIONS.has(section.type)
  return (
    <div id={`anchor-${definition.anchor}`} className={`preview-anchor${light ? " theme-light" : ""}`} data-edit-section={section.id}>
      {definition.render(section.props)}
    </div>
  )
}

export function LandingPage({ content }: { content: LandingContent }) {
  const { settings, sections } = content
  // Light mode is disabled for now; the site always renders dark.
  const theme = "dark" as const
  const [heroRevealed, setHeroRevealed] = useState(true)
  const navRef = useRef<HTMLElement>(null)

  const onRevealComplete = useCallback(() => setHeroRevealed(true), [])
  const onRevealReverse = useCallback(() => setHeroRevealed(false), [])

  return (
    <FrameRuntimeProvider className="relative min-h-screen overflow-x-clip">
      <FrameThemeSync theme={theme} />
      <LandingContext.Provider value={{ theme, navRef, onRevealComplete, onRevealReverse }}>
        <div id="anchor-nav" className="preview-anchor preview-nav-backdrop" data-edit-scope="nav" data-edit-section="@settings">
          <Nav
            ref={navRef}
            theme={theme}
            heroRevealed={heroRevealed}
            data={settings.nav}
            branding={settings.branding}
          />
        </div>
        <main>
          {sections.filter((section) => !section.hidden).map((section) => <Section key={section.id} section={section} />)}
        </main>
      </LandingContext.Provider>
    </FrameRuntimeProvider>
  )
}
