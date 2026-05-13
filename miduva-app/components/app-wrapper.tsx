"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import type { LandingPageData } from "@/lib/types"
import Nav from "./nav"
import SvgMaskHero from "./svg-mask-hero"
import HeroContent from "./hero-content"
import Dashboard from "./dashboard"
import Services from "./services"
import ParallaxSection from "./parallax-section"
import SystemRibbon from "./system-ribbon"
import SystemsZoomSection from "./systems-zoom-section"
import ProblemSolution from "./problem-solution"
import HowItWorks from "./how-it-works"
import ResultsStats from "./results-stats"
import WhyMiduva from "./why-miduva"
import FaqSection from "./faq-section"
import FreeOffer from "./free-offer"
import ContactSection from "./contact-section"
import { CinematicFooter } from "@/components/ui/motion-footer"

interface AppWrapperProps {
  data?: LandingPageData
}

export function AppWrapper({ data = {} }: AppWrapperProps) {
  const [theme, setTheme] = useState<"dark" | "light">("dark")
  const [heroRevealed, setHeroRevealed] = useState(true)
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const root = document.documentElement
    if (theme === "dark") root.classList.add("dark")
    else root.classList.remove("dark")
  }, [theme])

  const onRevealComplete = useCallback(() => setHeroRevealed(true), [])
  const onRevealReverse = useCallback(() => setHeroRevealed(false), [])

  return (
    <div className="relative min-h-screen overflow-x-clip">
      <Nav ref={navRef} theme={theme} setTheme={setTheme} heroRevealed={heroRevealed} data={data.nav} branding={data.branding} />
      <main>
        <div id="anchor-hero" className="preview-anchor">
          <SvgMaskHero
            theme={theme}
            onRevealComplete={onRevealComplete}
            onRevealReverse={onRevealReverse}
            scanTarget={navRef}
            illustrationDarkUrl={data.hero?.illustrationDarkUrl}
            illustrationLightUrl={data.hero?.illustrationLightUrl}
          >
            <HeroContent theme={theme} data={data.hero} />
          </SvgMaskHero>
        </div>
        <div id="anchor-systems" className="preview-anchor">
          <SystemsZoomSection data={data.systems} />
        </div>
        <div id="anchor-problem-solution" className="preview-anchor">
          <ProblemSolution data={data.problemSolution} />
        </div>
        <div id="anchor-how-it-works" className="preview-anchor">
          <HowItWorks data={data.howItWorks} />
        </div>
        <div id="anchor-results" className="preview-anchor">
          <ResultsStats data={data.results} />
        </div>
        <div id="anchor-why-miduva" className="preview-anchor">
          <WhyMiduva data={data.whyMiduva} />
        </div>
        <div id="anchor-parallax" className="preview-anchor">
          <ParallaxSection data={data.parallax} />
        </div>
        <div id="anchor-dashboard" className="preview-anchor px-6 py-10 md:py-14">
          <div className="max-w-6xl mx-auto p-3 rounded-[32px] border-2 border-dashed border-[var(--line)]">
            <Dashboard data={data.dashboard} />
          </div>
        </div>
        <div id="anchor-services" className="preview-anchor">
          <Services data={data.services} />
        </div>
        <div id="anchor-growth-os" className="preview-anchor">
          <SystemRibbon data={data.growthOs} />
        </div>
        <div id="anchor-faq" className="preview-anchor">
          <FaqSection data={data.faq} />
        </div>
        <div className="h-12 md:h-20" />
        <div id="anchor-free-offer" className="preview-anchor">
          <FreeOffer theme={theme} data={data.freeOffer} />
        </div>
        <div id="anchor-contact" className="preview-anchor">
          <ContactSection data={data.contact} />
        </div>
      </main>
      <div id="anchor-footer" className="preview-anchor">
        <CinematicFooter data={data.footer} />
      </div>
    </div>
  )
}
