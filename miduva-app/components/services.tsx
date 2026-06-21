"use client"

import { AnimatePresence, motion } from "motion/react"
import {
  HoverSlider,
  HoverSliderImage,
  HoverSliderImageWrap,
  TextStaggerHover,
  useHoverSliderContext,
} from "@/components/blocks/animated-slideshow"
import type { ServicesData } from "@/lib/types"

// ─── Local slide type ─────────────────────────────────────────────────────────
type Slide = {
  id: string
  title: string
  items: string[]
  imageUrl: string
}

const DEFAULT_SLIDES: Slide[] = [
  {
    id: "growth-marketing",
    title: "Growth & Marketing",
    items: ["Paid Ads", "Social Media Ads", "Retargeting", "SEO", "Content Marketing", "AI Visibility (GEO)", "Advanced Growth Strategies"],
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=900&auto=format&fit=crop",
  },
  {
    id: "conversion-funnels",
    title: "Conversion & Funnels",
    items: ["Landing Pages", "Sales Funnels", "CRO", "A/B Testing", "UX Optimization", "Personalization Systems"],
    imageUrl: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=900&auto=format&fit=crop",
  },
  {
    id: "websites-dev",
    title: "Websites & Development",
    items: ["Landing Pages", "E-Commerce", "Performance Optimization", "CMS", "Web Apps", "SaaS Development"],
    imageUrl: "https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=900&auto=format&fit=crop",
  },
  {
    id: "ecommerce",
    title: "E-Commerce",
    items: ["Shopify", "WooCommerce", "Custom Platforms", "Marketing Integration", "Conversion Optimization"],
    imageUrl: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=900&auto=format&fit=crop",
  },
  {
    id: "ai-automation",
    title: "AI & Automation",
    items: ["WhatsApp & Website Chatbots", "CRM Automation", "Email Automation", "Lead Management", "AI Sales Agents", "n8n Workflows", "Custom AI"],
    imageUrl: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?q=80&w=900&auto=format&fit=crop",
  },
  {
    id: "data-analytics",
    title: "Data & Analytics",
    items: ["GA4 / Meta Setup", "Conversion Tracking", "Dashboards", "Reporting", "Attribution Modeling", "Revenue Forecasting"],
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=900&auto=format&fit=crop",
  },
]

function ActiveOverlay({ slides }: { slides: Slide[] }) {
  const { activeSlide } = useHoverSliderContext()
  const slide = slides[activeSlide] ?? slides[0]

  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/75 via-black/20 to-transparent p-5">
      <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.18em] text-white/50">
        {slide.items.length} services
      </p>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSlide}
          className="flex flex-wrap gap-1.5"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          {slide.items.map((item, i) => (
            <motion.span
              key={item}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.055, duration: 0.3, ease: "easeOut" }}
              className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm"
            >
              {item}
            </motion.span>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function MobileServiceDetail({ slide }: { slide: Slide }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={slide.id}
        className="mt-5 overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--card)] md:hidden"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={slide.imageUrl}
            alt={slide.title}
            className="size-full object-cover"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(2,6,15,0.72)] via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-3">
            <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">
              Active system
            </p>
            <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
              {slide.items.length} services
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 p-4">
          {slide.items.map((item, i) => (
            <motion.span
              key={item}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.035, duration: 0.22, ease: "easeOut" }}
              className="rounded-full border border-[var(--line)] bg-[var(--chip)] px-2.5 py-1 text-[11px] font-semibold text-[var(--navy-700)]"
            >
              {item}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

function ServiceTitles({ slides }: { slides: Slide[] }) {
  const { activeSlide } = useHoverSliderContext()

  return (
    <>
      {slides.map((slide, index) => (
        <div key={slide.id} className="border-b border-[var(--line)] last:border-none md:contents">
          <TextStaggerHover
            index={index}
            tabIndex={0}
            role="button"
            aria-label={`Show ${slide.title}`}
            aria-pressed={activeSlide === index}
            className="cursor-pointer text-[24px] md:text-[38px] font-extrabold tracking-tight text-[var(--navy-900)] py-2.5 md:py-2 md:border-b md:border-[var(--line)] md:last:border-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--teal-500)]"
            text={slide.title}
          />
          <div className="md:hidden">
            {activeSlide === index ? <MobileServiceDetail slide={slide} /> : null}
          </div>
        </div>
      ))}
    </>
  )
}

export default function Services({ data }: { data?: ServicesData }) {
  const eyebrow      = data?.eyebrow      ?? "/ what we do"
  const headline     = data?.headline     ?? "Everything you need"
  const headlineAccent = data?.headlineAccent ?? "to grow."
  const ctaLabel     = data?.ctaLabel     ?? "Book a free strategy call"
  const ctaHref      = data?.ctaHref      ?? "#cta"

  const slides: Slide[] = data?.categories?.length
    ? data.categories.map((s, i) => ({
        ...(s as Slide),
        imageUrl: (s as Slide).imageUrl || DEFAULT_SLIDES[i]?.imageUrl || DEFAULT_SLIDES[0].imageUrl,
      }))
    : DEFAULT_SLIDES

  return (
    <section id="services" className="py-16 md:py-28">
      <div className="max-w-6xl mx-auto px-5 md:px-6">
        {/* Header */}
        <div className="mb-9 md:mb-14">
          <div className="mono text-[13px] uppercase tracking-[0.22em] text-[var(--teal-500)] mb-4">{eyebrow}</div>
          <h2 className="text-[42px] md:text-[72px] font-extrabold tracking-[-0.04em] text-[var(--navy-900)] leading-[1.02]">
            {headline}<br />
            <span className="text-[var(--teal-500)]">{headlineAccent}</span>
          </h2>
        </div>

        <HoverSlider className="grid gap-7 md:flex md:flex-wrap md:items-center md:justify-between md:gap-10 lg:gap-16">
          {/* Left — service titles */}
          <div className="flex flex-col space-y-1 flex-1 min-w-0">
            <ServiceTitles slides={slides} />

            <div className="pt-6 md:pt-8">
              <a
                href={ctaHref}
                className="inline-flex items-center gap-2.5 text-[13px] font-semibold text-[var(--navy-900)] hover:text-[var(--teal-500)] transition-colors"
              >
                {ctaLabel}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M5 12h14M13 5l7 7-7 7"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Right — stacked images */}
          <div className="relative hidden w-full flex-shrink-0 md:block lg:w-[380px] xl:w-[440px]" style={{ aspectRatio: "3/4" }}>
            <HoverSliderImageWrap className="size-full overflow-hidden rounded-lg md:rounded-[28px]">
              {slides.map((slide, index) => (
                <HoverSliderImage
                  key={slide.id}
                  index={index}
                  imageUrl={slide.imageUrl}
                  src={slide.imageUrl}
                  alt={slide.title}
                  className="size-full object-cover"
                  loading={index === 0 ? "eager" : "lazy"}
                  decoding="async"
                />
              ))}
            </HoverSliderImageWrap>
            <ActiveOverlay slides={slides} />
          </div>
        </HoverSlider>
      </div>
    </section>
  )
}
