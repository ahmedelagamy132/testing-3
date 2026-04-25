"use client"

import { useState, useEffect } from "react"
import Nav from "./nav"
import ParallaxHero from "./parallax-hero"
import Dashboard from "./dashboard"
import Services from "./services"
import ParallaxSection from "./parallax-section"
import SystemRibbon from "./system-ribbon"
import TrustedLogos from "./trusted-logos"
import SystemsBento from "./systems-bento"
import ProblemSolution from "./problem-solution"
import HowItWorks from "./how-it-works"
import ResultsStats from "./results-stats"
import WhyMiduva from "./why-miduva"
import FreeOffer from "./free-offer"
import { CinematicFooter } from "@/components/ui/motion-footer"
import { SectionReveal } from "./section-reveal"

function MetaStrip() {
  const items = [
    { k: "Avg. ROAS",        v: "4.8×"  },
    { k: "Lead volume",      v: "+312%" },
    { k: "Time to launch",   v: "14 days" },
    { k: "Client retention", v: "94%"   },
  ]
  return (
    <div className="rise-5 mt-12 mx-auto max-w-3xl grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--line)] rounded-2xl overflow-hidden border border-[var(--line)]">
      {items.map((it, i) => (
        <div key={i} className="bg-[var(--card)]/70 backdrop-blur px-5 py-4 text-center">
          <div className="text-[11px] mono uppercase tracking-[0.14em] text-[var(--muted)]">{it.k}</div>
          <div className="mt-1 text-[22px] font-bold text-[var(--navy-900)] tracking-tight">{it.v}</div>
        </div>
      ))}
    </div>
  )
}

export function AppWrapper() {
  const [theme, setTheme] = useState<"dark" | "light">("dark")

  useEffect(() => {
    const root = document.documentElement
    if (theme === "dark") root.classList.add("dark")
    else root.classList.remove("dark")
  }, [theme])

  return (
    <div className="relative min-h-screen overflow-x-clip">
      <Nav theme={theme} setTheme={setTheme} />
      <main>
        <ParallaxHero theme={theme} />

        <SectionReveal><SystemsBento /></SectionReveal>
        <SectionReveal><ProblemSolution /></SectionReveal>

        <HowItWorks />

        <SectionReveal><ResultsStats /></SectionReveal>
        <SectionReveal><WhyMiduva /></SectionReveal>

        <ParallaxSection />

        <SectionReveal>
          <div className="px-6 py-10 md:py-14">
            <div className="max-w-6xl mx-auto p-3 rounded-[32px] border-2 border-dashed border-[var(--line)]">
              <Dashboard />
            </div>
          </div>
        </SectionReveal>

        <SectionReveal><Services /></SectionReveal>

        <SectionReveal>
          <SystemRibbon />
          <TrustedLogos />
        </SectionReveal>

        <SectionReveal><FreeOffer /></SectionReveal>
      </main>
      <CinematicFooter />
    </div>
  )
}
