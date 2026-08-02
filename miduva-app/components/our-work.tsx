"use client"

import Image from "next/image"
import type { CSSProperties } from "react"
import type { ClientLogoData, OurWorkData } from "@/lib/types"

const DEFAULT_LOGOS: ClientLogoData[] = [
  { src: "/client-logos/19.png", name: "DEZ", category: "B2B systems" },
  { src: "/client-logos/20.png", name: "Dr. Mohamed Hany Mahour", category: "Healthcare" },
  { src: "/client-logos/21.png", name: "Mas Eye Center", category: "Healthcare", size: "wide" },
  { src: "/client-logos/22.png", name: "Grease Monkey", category: "Retail services", size: "wide" },
  { src: "/client-logos/23.png", name: "Radio", category: "Consumer" },
  { src: "/client-logos/24.png", name: "Osama Taha", category: "Healthcare" },
  { src: "/client-logos/25.png", name: "Tag", category: "Personal care", size: "tall" },
  { src: "/client-logos/26.png", name: "GIG Insurance Group", category: "Insurance" },
  { src: "/client-logos/27.png", name: "Shaden Resort", category: "Hospitality", size: "tall" },
  { src: "/client-logos/28.png", name: "Movenpick Hotel & Residences Riyadh", category: "Hospitality", size: "wide" },
  { src: "/client-logos/29.png", name: "Grand Millennium Dubai", category: "Hospitality", size: "tall" },
  { src: "/client-logos/30.png", name: "Sun Stall", category: "Retail" },
  { src: "/client-logos/31.png", name: "Belmazad", category: "Marketplace", size: "wide" },
  { src: "/client-logos/32.png", name: "Porto Vacation Club", category: "Travel" },
  { src: "/client-logos/33.png", name: "ABRO", category: "Automotive", size: "wide" },
  { src: "/client-logos/34.png", name: "Amer Group", category: "Real estate", size: "wide" },
  { src: "/client-logos/35.png", name: "Madinet Masr", category: "Real estate", size: "wide" },
]

function LogoTile({ logo, index }: { logo: ClientLogoData; index: number }) {
  return (
    <figure
      className="our-work-tile group"
      style={{ "--tile-index": index } as CSSProperties}
      aria-label={`${logo.name}, ${logo.category}`}
    >
      <div className="our-work-tile__image">
        <Image
          src={logo.src}
          alt={`${logo.name} logo`}
          width={220}
          height={120}
          className={`our-work-logo our-work-logo--${logo.size ?? "compact"}`}
        />
      </div>
    </figure>
  )
}

function MarqueeRow({ row, reverse = false }: { row: ClientLogoData[]; reverse?: boolean }) {
  const loop = [...row, ...row]
  return (
    <div className="our-work-marquee" data-reverse={reverse}>
      <div className="our-work-marquee__track">
        {loop.map((logo, index) => (
          <LogoTile key={`${logo.src}-${index}`} logo={logo} index={index} />
        ))}
      </div>
    </div>
  )
}

export default function OurWork({ data }: { data?: OurWorkData } = {}) {
  const logos = data?.logos?.length ? data.logos : DEFAULT_LOGOS
  const split = Math.ceil(logos.length / 2)
  const marqueeRows = [logos.slice(0, split), logos.slice(Math.max(0, split - 1))]
  const eyebrow = data?.eyebrow ?? "/ our clients"
  const headline = data?.headline ?? "Selected client systems."
  const ariaLabel = data?.ariaLabel ?? "Selected Miduva client logos"

  return (
    <section id="our-work" className="our-work-section">
      <div className="our-work-copy">
        <p className="mono our-work-kicker">{eyebrow}</p>
        <h2>{headline}</h2>
      </div>

      <div className="our-work-rails" aria-label={ariaLabel}>
        <MarqueeRow row={marqueeRows[0]} />
        <MarqueeRow row={marqueeRows[1]} reverse />
      </div>
    </section>
  )
}
