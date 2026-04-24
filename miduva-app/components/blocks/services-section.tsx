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
    items: [
      "Paid Ads",
      "Social Media Ads",
      "Retargeting",
      "SEO",
      "Content Marketing",
      "AI Visibility (GEO)",
      "Advanced Growth Strategies",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2815&auto=format&fit=crop",
  },
  {
    id: "conversion-funnels",
    title: "Conversion & Funnels",
    count: 6,
    items: [
      "Landing Pages",
      "Sales Funnels",
      "CRO",
      "A/B Testing",
      "UX Optimization",
      "Personalization Systems",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=2076&auto=format&fit=crop",
  },
  {
    id: "websites-dev",
    title: "Websites & Development",
    count: 6,
    items: [
      "Landing Pages",
      "E-Commerce",
      "Performance Optimization",
      "CMS",
      "Web Apps",
      "SaaS Development",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=2064&auto=format&fit=crop",
  },
  {
    id: "ecommerce",
    title: "E-Commerce",
    count: 5,
    items: [
      "Shopify",
      "WooCommerce",
      "Custom Platforms",
      "Marketing Integration",
      "Conversion Optimization",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: "ai-automation",
    title: "AI & Automation",
    count: 7,
    items: [
      "WhatsApp & Website Chatbots",
      "CRM Automation",
      "Email Automation",
      "Lead Management",
      "AI Sales Agents",
      "n8n Workflows",
      "Custom AI",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?q=80&w=2832&auto=format&fit=crop",
  },
  {
    id: "data-analytics",
    title: "Data & Analytics",
    count: 6,
    items: [
      "GA4 / Meta Setup",
      "Conversion Tracking",
      "Dashboards",
      "Reporting",
      "Attribution Modeling",
      "Revenue Forecasting",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
  },
]

/** Reads active slide from context and renders the details overlay */
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

export function HoverSliderDemo() {
  return (
    <HoverSlider className="min-h-svh grid place-content-center p-6 md:px-12 bg-[#faf9f5] text-[#3d3929]">
      <h3 className="mb-6 text-xs font-medium capitalize tracking-wide text-[#c96442]">
        / our services
      </h3>

      <div className="flex flex-wrap items-center justify-evenly gap-6 md:gap-12">
        {/* Left — service titles */}
        <div className="flex flex-col space-y-2 md:space-y-4">
          {SLIDES.map((slide, index) => (
            <TextStaggerHover
              key={slide.id}
              index={index}
              className="cursor-pointer text-4xl font-bold uppercase tracking-tighter"
              text={slide.title}
            />
          ))}
        </div>

        {/* Right — stacked images (direct children) + single overlay outside the grid */}
        <div className="relative w-[340px] h-[400px] md:w-[420px] md:h-[480px]">
          <HoverSliderImageWrap
            className="size-full rounded-2xl overflow-hidden"
            style={{ backgroundColor: "#faf9f5" }}
          >
            {SLIDES.map((slide, index) => (
              <HoverSliderImage
                key={slide.id}
                index={index}
                imageUrl={slide.imageUrl}
                src={slide.imageUrl}
                alt={slide.title}
                className="size-full object-cover"
                style={{ backgroundColor: "#faf9f5" }}
                loading="eager"
                decoding="async"
              />
            ))}
          </HoverSliderImageWrap>

          {/* Single overlay driven by context — no stacking issue */}
          <ActiveOverlay />
        </div>
      </div>
    </HoverSlider>
  )
}
