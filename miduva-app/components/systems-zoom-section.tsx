'use client'

/* eslint-disable @next/next/no-img-element -- The editor accepts image URLs from the media library. */

import type { SystemCard, SystemsSectionData } from '@/lib/types'

const DEFAULT_SYSTEMS: SystemCard[] = [
  {
    id: 'lead-gen', num: '01', label: 'Lead Generation System',
    title: 'Consistent leads.\nOn autopilot.',
    description: 'Generate predictable lead flow using ads, funnels & precision conversion systems built for your market.',
    imageUrl: '/assets/system-story/lead-generation-system.webp',
  },
  {
    id: 'website-conversion', num: '02', label: 'Website & Conversion System',
    title: 'Your website,\nactually converting.',
    description: "Turn traffic into revenue with a high-performance site engineered around your buyer's journey.",
    imageUrl: '/assets/system-story/website-conversion-system.webp',
  },
  {
    id: 'automation', num: '03', label: 'Smart Automation System',
    title: 'Sales & follow-ups\nrunning 24/7.',
    description: 'CRM workflows, AI agents, and email sequences that close deals while you sleep, no extra hires.',
    imageUrl: '/assets/system-story/smart-automation-system.webp',
  },
]

const SYSTEM_STEPS = ['Attract', 'Convert', 'Follow up']

function SystemPanel({ system, index, ctaLabel, ctaHref }: {
  system: SystemCard
  index: number
  ctaLabel: string
  ctaHref: string
}) {
  const imageOnRight = index === 1

  return (
    <article
      className="grid items-center gap-8 border-t border-[var(--line)] py-12 sm:gap-10 md:min-h-[70vh] md:grid-cols-2 md:gap-12 md:py-16 lg:gap-20"
      data-edit-path={`systems.${index}`}
    >
      <div
        className={`relative overflow-hidden rounded-[22px] bg-[var(--card)] ${imageOnRight ? 'md:order-2' : ''}`}
        data-miduva-native-id={`system:${system.id}`}
      >
        <img
          src={system.imageUrl || undefined}
          alt={system.imageAlt || system.label}
          data-edit-path={`systems.${index}.imageUrl`}
          className={`aspect-[5/4] w-full object-cover sm:aspect-[4/3] md:aspect-[5/4] ${index === 0 ? 'object-[center_35%]' : index === 2 ? 'object-[center_42%]' : ''}`}
          loading={index === 0 ? 'eager' : 'lazy'}
          decoding="async"
        />
        <div className="pointer-events-none absolute inset-0 rounded-[22px] ring-1 ring-inset ring-white/10" aria-hidden="true" />
      </div>

      <div className={`flex flex-col items-start ${imageOnRight ? 'md:order-1' : ''}`}>
        <div className="mb-8 flex w-full items-center gap-4 text-[var(--teal-500)]">
          <span className="font-mono text-[12px] font-bold tracking-[0.12em]">{system.num}</span>
          <span className="h-px w-8 bg-current opacity-70" aria-hidden="true" />
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em]" data-edit-path={`systems.${index}.label`}>
            {system.label}
          </span>
        </div>

        <h3
          className="max-w-[680px] whitespace-pre-line text-[clamp(2.25rem,4.15vw,4.5rem)] font-extrabold leading-[1.04] tracking-[-0.045em] text-[var(--ink)]"
          data-edit-path={`systems.${index}.title`}
        >
          {system.title}
        </h3>
        <p
          className="mt-6 max-w-[520px] text-[15px] leading-[1.7] text-[var(--muted)] sm:text-[17px]"
          data-edit-path={`systems.${index}.description`}
        >
          {system.description}
        </p>

        <a
          href={ctaHref}
          data-edit-path="ctaLabel"
          className="mt-8 inline-flex min-h-12 items-center gap-5 rounded-full bg-[var(--ink)] py-2 pl-5 pr-2 text-[13px] font-semibold text-[var(--paper)] transition-colors duration-200 hover:bg-[var(--teal-500)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--teal-500)]"
        >
          {ctaLabel}
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 dark:bg-black/10" aria-hidden="true">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14m-6-6 6 6-6 6" />
            </svg>
          </span>
        </a>
      </div>
    </article>
  )
}

export default function SystemsZoomSection({ data }: { data?: SystemsSectionData }) {
  const eyebrow = data?.eyebrow ?? '/ our systems'
  const headline = data?.headline ?? 'Three systems.'
  const headlineAccent = data?.headlineAccent ?? 'One growth machine.'
  const ctaLabel = data?.ctaLabel ?? 'Explore Your System'
  const ctaHref = data?.ctaHref ?? '#cta'
  const systems = data?.systems?.length === 3 ? data.systems : DEFAULT_SYSTEMS

  return (
    <section id="systems" className="bg-[var(--paper)] text-[var(--ink)]">
      <div className="mx-auto max-w-[1500px] px-6 sm:px-10 lg:px-14">
        <header className="grid gap-6 pb-12 pt-20 md:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] md:items-end md:gap-12 md:pb-16 md:pt-28">
          <div>
            <div className="font-mono text-[12px] font-bold uppercase tracking-[0.17em] text-[var(--teal-500)]" data-edit-path="eyebrow">
              {eyebrow}
            </div>
            <p className="mt-4 text-[13px] leading-relaxed text-[var(--muted)]">
              {SYSTEM_STEPS.map((step, index) => (
                <span key={step}>{index > 0 && <span className="mx-2 text-[var(--teal-500)]" aria-hidden="true">/</span>}{step}</span>
              ))}
            </p>
          </div>
          <h2 className="text-[clamp(2.8rem,5vw,5.5rem)] font-extrabold leading-[1.03] tracking-[-0.05em]" data-edit-path="headline">
            {headline}{' '}
            <span className="text-[var(--teal-500)]" data-edit-path="headlineAccent">{headlineAccent}</span>
          </h2>
        </header>

        {systems.map((system, index) => (
          <SystemPanel key={system.id} system={system} index={index} ctaLabel={ctaLabel} ctaHref={ctaHref} />
        ))}
      </div>
    </section>
  )
}
