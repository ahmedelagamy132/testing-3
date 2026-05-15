import React from 'react'
import './admin-dashboard.scss'

type EntityType = 'collections' | 'globals'

type NavEntity = {
  label: string | Record<string, string>
  slug: string
  type: EntityType
}

type NavGroup = {
  label: string
  entities: NavEntity[]
}

type Props = {
  navGroups?: NavGroup[]
  user?: { email?: string; [k: string]: unknown }
  [key: string]: unknown
}

// ─── Minimal line icons (single small glyph per section) ────────────────────
// One simple 20×20 stroked icon per section — no decorative illustrations.

const iconProps = {
  viewBox: '0 0 20 20',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
}

function GlobalsIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="10" cy="10" r="7" />
      <path d="M3 10h14M10 3c2 2.2 2 11.8 0 14M10 3c-2 2.2-2 11.8 0 14" />
    </svg>
  )
}

function SystemIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="10" cy="7" r="3" />
      <path d="M4 16c0-3 2.7-5 6-5s6 2 6 5" />
    </svg>
  )
}

function MediaIcon() {
  return (
    <svg {...iconProps}>
      <rect x="3" y="4" width="14" height="12" rx="2" />
      <circle cx="7.5" cy="8.5" r="1.5" />
      <path d="M4 14l4-4 3 3 3-3 2 2" />
    </svg>
  )
}

function LeadsIcon() {
  return (
    <svg {...iconProps}>
      <path d="M4 4v12h12" />
      <path d="M7 12l3-3 2 2 4-5" />
    </svg>
  )
}

// ─── Section config ───────────────────────────────────────────────────────────

type SectionMeta = { icon: () => React.ReactNode; description: string }

const SECTION_META: Record<string, SectionMeta> = {
  Globals: { icon: () => <GlobalsIcon />, description: 'Site-wide content and settings' },
  System: { icon: () => <SystemIcon />, description: 'User accounts and access control' },
  Media: { icon: () => <MediaIcon />, description: 'Images and assets for the site' },
  Leads: { icon: () => <LeadsIcon />, description: 'Signups and incoming leads' },
}

const FALLBACK_META: SectionMeta = { icon: () => <GlobalsIcon />, description: '' }

// ─── Helpers ─────────────────────────────────────────────────────────────────

function resolveLabel(label: string | Record<string, string>): string {
  if (typeof label === 'string') return label
  return Object.values(label)[0] ?? ''
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AdminDashboard({ navGroups = [], user }: Props) {
  const email = (user as { email?: string } | undefined)?.email ?? ''
  const name = email.split('@')[0] ?? 'there'

  return (
    <div className="adash">
      <header className="adash__header">
        <h1 className="adash__title">
          Welcome back, <span className="adash__title-name">{name}</span>
        </h1>
        <p className="adash__subtitle">Miduva CMS &mdash; manage your site content below.</p>
      </header>

      <div className="adash__grid">
        {navGroups.map((group) => {
          const label = resolveLabel(group.label)
          const meta = SECTION_META[label] ?? FALLBACK_META

          return (
            <section key={label} className="adash__card">
              <div className="adash__card-head">
                <span className="adash__card-icon">{meta.icon()}</span>
                <div>
                  <h2 className="adash__card-label">{label}</h2>
                  {meta.description && (
                    <p className="adash__card-desc">{meta.description}</p>
                  )}
                </div>
              </div>

              <ul className="adash__entities">
                {group.entities.map((entity) => {
                  const entityLabel = resolveLabel(entity.label) || entity.slug
                  const isGlobal = entity.type === 'globals'
                  const href = isGlobal
                    ? `/admin/globals/${entity.slug}`
                    : `/admin/collections/${entity.slug}`
                  const createHref = isGlobal ? null : `/admin/collections/${entity.slug}/create`

                  return (
                    <li key={entity.slug} className="adash__entity">
                      <a href={href} className="adash__entity-link">
                        <span className="adash__entity-name">{entityLabel}</span>
                        <svg className="adash__entity-arrow" viewBox="0 0 16 16" fill="none" aria-hidden>
                          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5"
                            strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </a>
                      {createHref && (
                        <a href={createHref} className="adash__entity-new" title={`Create ${entityLabel}`}>
                          <svg viewBox="0 0 16 16" fill="none" aria-hidden>
                            <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                          </svg>
                        </a>
                      )}
                    </li>
                  )
                })}
              </ul>
            </section>
          )
        })}
      </div>
    </div>
  )
}
