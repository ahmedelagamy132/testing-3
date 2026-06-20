'use client'

import { useRowLabel } from '@payloadcms/ui'

const SECTION_LABEL: Record<string, string> = {
  hero: 'Hero',
  systems: 'Systems',
  'problem-solution': 'Problem & Solution',
  'how-it-works': 'How It Works',
  results: 'Results',
  'our-work': 'Our Work',
  'why-miduva': 'Why Miduva',
  parallax: 'The Difference (Parallax)',
  dashboard: 'Dashboard',
  services: 'Services',
  'growth-os': 'Growth OS',
  faq: 'FAQ',
  'free-offer': 'Free Offer',
  contact: 'Contact',
  footer: 'Footer',
}

type RowData = { sectionId?: string; visible?: boolean }

export const SectionRowLabel = () => {
  const { data, rowNumber } = useRowLabel<RowData>()
  const id = data?.sectionId ?? ''
  const label = SECTION_LABEL[id] ?? id ?? `Section ${String(rowNumber ?? 1).padStart(2, '0')}`
  const hidden = data?.visible === false
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <strong style={{ opacity: hidden ? 0.5 : 1 }}>{label}</strong>
      {hidden ? (
        <span
          style={{
            fontSize: 11,
            padding: '1px 6px',
            borderRadius: 4,
            background: 'rgba(220, 50, 50, 0.15)',
            color: 'rgb(220, 50, 50)',
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
            fontWeight: 600,
          }}
        >
          hidden
        </span>
      ) : null}
    </span>
  )
}

export default SectionRowLabel
