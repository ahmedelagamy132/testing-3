"use client"

import { AnimatePresence, motion } from "motion/react"
import {
  HoverSlider,
  HoverSliderImage,
  HoverSliderImageWrap,
  TextStaggerHover,
  useHoverSliderContext,
} from "@/components/blocks/animated-slideshow"

const SLIDES = [
  {
    id: "growth-marketing",
    title: "Growth & Marketing",
    count: 7,
    items: ["Paid Ads", "Social Media Ads", "Retargeting", "SEO", "Content Marketing", "AI Visibility (GEO)", "Advanced Growth Strategies"],
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=900&auto=format&fit=crop",
  },
  {
    id: "conversion-funnels",
    title: "Conversion & Funnels",
    count: 6,
    items: ["Landing Pages", "Sales Funnels", "CRO", "A/B Testing", "UX Optimization", "Personalization Systems"],
    imageUrl: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=900&auto=format&fit=crop",
  },
  {
    id: "websites-dev",
    title: "Websites & Development",
    count: 6,
    items: ["Landing Pages", "E-Commerce", "Performance Optimization", "CMS", "Web Apps", "SaaS Development"],
    imageUrl: "https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=900&auto=format&fit=crop",
  },
  {
    id: "ecommerce",
    title: "E-Commerce",
    count: 5,
    items: ["Shopify", "WooCommerce", "Custom Platforms", "Marketing Integration", "Conversion Optimization"],
    imageUrl: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=900&auto=format&fit=crop",
  },
  {
    id: "ai-automation",
    title: "AI & Automation",
    count: 7,
    items: ["WhatsApp & Website Chatbots", "CRM Automation", "Email Automation", "Lead Management", "AI Sales Agents", "n8n Workflows", "Custom AI"],
    imageUrl: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?q=80&w=900&auto=format&fit=crop",
  },
  {
    id: "data-analytics",
    title: "Data & Analytics",
    count: 6,
    items: ["GA4 / Meta Setup", "Conversion Tracking", "Dashboards", "Reporting", "Attribution Modeling", "Revenue Forecasting"],
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=900&auto=format&fit=crop",
  },
]

function ActiveOverlay() {
  const { activeSlide } = useHoverSliderContext()
  const slide = SLIDES[activeSlide]

  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/75 via-black/20 to-transparent p-5">
      <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.18em] text-white/50">
        {slide.count} services
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

export default function Services() {
  return (
    <section id="services" className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-14">
          <div className="mono text-[13px] uppercase tracking-[0.22em] text-[var(--teal-500)] mb-4">/ what we do</div>
          <h2 className="text-[52px] md:text-[72px] font-extrabold tracking-[-0.04em] text-[var(--navy-900)] leading-[1.02]">
            Everything you need<br />
            <span className="text-[var(--teal-500)]">to grow.</span>
          </h2>
        </div>

        <HoverSlider className="flex flex-wrap items-center justify-between gap-10 lg:gap-16">
          {/* Left — service titles */}
          <div className="flex flex-col space-y-1 flex-1 min-w-0">
            {SLIDES.map((slide, index) => (
              <TextStaggerHover
                key={slide.id}
                index={index}
                className="cursor-pointer text-[28px] md:text-[38px] font-extrabold tracking-tight text-[var(--navy-900)] py-2 border-b border-[var(--line)] last:border-none"
                text={slide.title}
              />
            ))}

            <div className="pt-8">
              <a
                href="#cta"
                className="inline-flex items-center gap-2.5 text-[13px] font-semibold text-[var(--navy-900)] hover:text-[var(--teal-500)] transition-colors"
              >
                Book a free strategy call
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M5 12h14M13 5l7 7-7 7"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Right — stacked images */}
          <div className="relative w-full lg:w-[380px] xl:w-[440px] flex-shrink-0" style={{ aspectRatio: "3/4" }}>
            <HoverSliderImageWrap className="size-full rounded-[28px] overflow-hidden">
              {SLIDES.map((slide, index) => (
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
            <ActiveOverlay />
          </div>
        </HoverSlider>
      </div>
    </section>
  )
}
