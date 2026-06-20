"use client"

import { useState, useEffect, useCallback, useRef, type ReactNode } from "react"
import type { LandingPageData, SectionId } from "@/lib/types"
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
import OurWork from "./our-work"
import FaqSection from "./faq-section"
import FreeOffer from "./free-offer"
import ContactSection from "./contact-section"
import { CinematicFooter } from "@/components/ui/motion-footer"

interface AppWrapperProps {
  data?: LandingPageData
}

const DEFAULT_ORDER: SectionId[] = [
  "hero", "systems", "problem-solution", "how-it-works", "results",
  "our-work", "why-miduva", "parallax", "dashboard", "services", "growth-os",
  "faq", "free-offer", "contact", "footer",
]

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

  // Each entry is one renderable section. Wrappers (anchor div + className)
  // are added uniformly below so the layout array decides everything except
  // structural wrappers (Nav at top, footer outside main).
  const sectionRenderers: Record<SectionId, () => ReactNode> = {
    hero: () => (
      <div className="relative">
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
    ),
    systems: () => <SystemsZoomSection data={data.systems} />,
    "problem-solution": () => <ProblemSolution data={data.problemSolution} />,
    "how-it-works": () => <HowItWorks data={data.howItWorks} />,
    results: () => <ResultsStats data={data.results} />,
    "our-work": () => <OurWork />,
    "why-miduva": () => <WhyMiduva data={data.whyMiduva} />,
    parallax: () => <ParallaxSection data={data.parallax} />,
    dashboard: () => (
      <div className="hidden px-6 py-10 md:block md:py-14">
        <div className="max-w-6xl mx-auto p-3 rounded-[32px] border-2 border-dashed border-[var(--line)]">
          <Dashboard data={data.dashboard} />
        </div>
      </div>
    ),
    services: () => <Services data={data.services} />,
    "growth-os": () => <SystemRibbon data={data.growthOs} />,
    faq: () => <FaqSection data={data.faq} />,
    "free-offer": () => <FreeOffer theme={theme} data={data.freeOffer} />,
    contact: () => <ContactSection data={data.contact} />,
    footer: () => <CinematicFooter data={data.footer} />,
  }

  // Resolve order from CMS layout array; fall back to the hardcoded default.
  // De-dupe ids (in case an editor accidentally adds the same section twice)
  // and skip rows the editor toggled invisible.
  const layoutSections = data.layout?.sections
  const orderedIds: SectionId[] = (() => {
    if (layoutSections && layoutSections.length > 0) {
      const seen = new Set<SectionId>()
      const out: SectionId[] = []
      for (const row of layoutSections) {
        if (!row.visible) continue
        if (!sectionRenderers[row.id]) continue
        if (seen.has(row.id)) continue
        seen.add(row.id)
        out.push(row.id)
      }
      return out
    }
    return DEFAULT_ORDER
  })()

  // Add the spacer that used to sit between FAQ and Free Offer when both are
  // adjacent in the rendered order (preserves original visual rhythm).
  const renderSection = (id: SectionId, idx: number) => (
    <div key={`${id}-${idx}`} id={`anchor-${id}`} className="preview-anchor">
      {sectionRenderers[id]()}
    </div>
  )

  // Footer keeps its original "outside main" position whenever it appears last.
  const lastIsFooter = orderedIds[orderedIds.length - 1] === "footer"
  const mainIds = lastIsFooter ? orderedIds.slice(0, -1) : orderedIds
  const trailingFooter = lastIsFooter ? "footer" : null

  return (
    <div className="relative min-h-screen overflow-x-clip">
      <div id="anchor-nav" className="preview-anchor preview-nav-backdrop">
        <Nav ref={navRef} theme={theme} setTheme={setTheme} heroRevealed={heroRevealed} data={data.nav} branding={data.branding} />
      </div>
      <main>
        {mainIds.map((id, idx) => {
          const node = renderSection(id, idx)
          // Insert the original spacer just before a Free Offer that sits
          // immediately after FAQ — only when both are in the rendered order.
          if (id === "free-offer" && mainIds[idx - 1] === "faq") {
            return (
              <div key={`spacer-${idx}`}>
                <div className="h-12 md:h-20" />
                {node}
              </div>
            )
          }
          return node
        })}
      </main>
      {trailingFooter ? renderSection(trailingFooter, mainIds.length) : null}
    </div>
  )
}
