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
      <Nav ref={navRef} theme={theme} setTheme={setTheme} heroRevealed={heroRevealed} data={data.nav} />
      <main>
        <SvgMaskHero
          theme={theme}
          onRevealComplete={onRevealComplete}
          onRevealReverse={onRevealReverse}
          scanTarget={navRef}
        >
          <HeroContent theme={theme} data={data.hero} />
        </SvgMaskHero>
        <SystemsZoomSection data={data.systems} />
        <ProblemSolution data={data.problemSolution} />
        <HowItWorks data={data.howItWorks} />
        <ResultsStats data={data.results} />
        <WhyMiduva data={data.whyMiduva} />
        <ParallaxSection data={data.parallax} />
        <div className="px-6 py-10 md:py-14">
          <div className="max-w-6xl mx-auto p-3 rounded-[32px] border-2 border-dashed border-[var(--line)]">
            <Dashboard />
          </div>
        </div>
        <Services data={data.services} />
        <SystemRibbon />
        <FaqSection data={data.faq} />
        <div className="h-12 md:h-20" />
        <FreeOffer theme={theme} />
        <ContactSection />
      </main>
      <CinematicFooter />
    </div>
  )
}
