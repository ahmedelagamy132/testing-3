"use client"

import Image from "next/image"
import type { CSSProperties } from "react"

type ClientLogo = {
  src: string
  name: string
  category: string
  size?: "wide" | "compact" | "tall"
}

const logos: ClientLogo[] = [
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

const marqueeRows = [logos.slice(0, 9), logos.slice(8)]

function LogoTile({ logo, index }: { logo: ClientLogo; index: number }) {
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

function MarqueeRow({ row, reverse = false }: { row: ClientLogo[]; reverse?: boolean }) {
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

export default function OurWork() {
  return (
    <section id="our-work" className="our-work-section">
      <div className="our-work-copy">
        <p className="mono our-work-kicker">/ our clients</p>
        <h2>Selected client systems.</h2>
      </div>

      <div className="our-work-rails" aria-label="Selected Miduva client logos">
        <MarqueeRow row={marqueeRows[0]} />
        <MarqueeRow row={marqueeRows[1]} reverse />
      </div>
    </section>
  )
}
