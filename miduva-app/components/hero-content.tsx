"use client"

import { SplineScene } from "@/components/ui/splite"
import { Spotlight } from "@/components/ui/spotlight"

export default function HeroContent() {
  return (
    <div className="w-full h-full relative overflow-hidden flex">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />

      {/* Left content */}
      <div className="flex-1 p-8 relative z-10 flex flex-col justify-center">
        <h1 className="text-4xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
          We build custom <br /> growth systems.
        </h1>
        <p className="mt-4 text-neutral-300 max-w-lg text-base md:text-lg">
          Engineered to generate leads, drive sales, and scale your business.
          No generic services — tailored systems using ads, funnels, automation,
          and data. Owned by you.
        </p>
      </div>

      {/* Right content */}
      <div className="flex-1 relative">
        <SplineScene
          scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
          className="w-full h-full"
        />
      </div>
    </div>
  )
}
