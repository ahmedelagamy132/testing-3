import type { ArrayField, GlobalConfig, UploadField } from 'payload'

const rowLabel: NonNullable<NonNullable<ArrayField['admin']>['components']>['RowLabel'] =
  '@/payload/components/array-row-label#ArrayRowLabel'

const largeImageField: NonNullable<NonNullable<UploadField['admin']>['components']>['Field'] =
  '@/payload/components/large-image-field#LargeImageField'

// Helper that injects our custom Field renderer into any upload field's admin block.
// Cast to `any` because Payload's UploadField['admin'] is a discriminated union over
// `relationTo` / `hasMany` and the spread widens to a shape the union can't narrow cleanly.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const largeImageAdmin = (extra: Record<string, any> = {}): any => ({
  ...extra,
  components: { ...(extra.components ?? {}), Field: largeImageField },
})

export const landingPage: GlobalConfig = {
  slug: 'landing-page',
  label: 'Landing Page',
  admin: {
    description:
      'Every section of the public landing page. Use the tabs below — they follow the order sections appear on the page, top to bottom.',
    components: {
      elements: {
        // Renders a button in the document header that pops the live preview
        // out into its own window. The in-pane preview is hidden via CSS in
        // app/(payload)/admin/layout.tsx so the editor takes the full width.
        beforeDocumentControls: [
          '@/payload/components/open-preview-button#OpenPreviewButton',
        ],
      },
    },
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        // ── Page Layout ──────────────────────────────────────────────────────
        {
          label: 'Layout',
          description:
            'Pick which sections appear on the public landing page and in what order. Drag rows to reorder. Untick to hide a section. Branding & Nav is always at the top.',
          fields: [
            {
              name: 'layout',
              type: 'group',
              label: 'Page sections',
              fields: [
                {
                  name: 'sections',
                  type: 'array',
                  label: 'Sections (top → bottom)',
                  minRows: 1,
                  admin: {
                    initCollapsed: false,
                    className: 'compact-array',
                    description: 'Drag the handle on the left to reorder. Each row is one section on the public page.',
                    components: {
                      RowLabel: '@/payload/components/section-row-label#SectionRowLabel',
                    },
                  },
                  // Field is named `sectionId` (not `id`) to avoid colliding with
                  // Payload's auto-generated row primary key. When the user-defined
                  // field is named `id` AND `type: 'select'`, the sqlite adapter
                  // mistakenly types the column as INTEGER PK, which then rejects
                  // string values like 'hero'.
                  defaultValue: [
                    { sectionId: 'hero', visible: true },
                    { sectionId: 'systems', visible: true },
                    { sectionId: 'problem-solution', visible: true },
                    { sectionId: 'how-it-works', visible: true },
                    { sectionId: 'results', visible: true },
                    { sectionId: 'why-miduva', visible: true },
                    { sectionId: 'parallax', visible: true },
                    { sectionId: 'dashboard', visible: true },
                    { sectionId: 'services', visible: true },
                    { sectionId: 'growth-os', visible: true },
                    { sectionId: 'faq', visible: true },
                    { sectionId: 'free-offer', visible: true },
                    { sectionId: 'contact', visible: true },
                    { sectionId: 'footer', visible: true },
                  ],
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'sectionId',
                          type: 'select',
                          required: true,
                          label: 'Section',
                          admin: { width: '70%' },
                          options: [
                            { label: 'Hero', value: 'hero' },
                            { label: 'Systems', value: 'systems' },
                            { label: 'Problem & Solution', value: 'problem-solution' },
                            { label: 'How It Works', value: 'how-it-works' },
                            { label: 'Results', value: 'results' },
                            { label: 'Why Miduva', value: 'why-miduva' },
                            { label: 'The Difference (Parallax)', value: 'parallax' },
                            { label: 'Dashboard', value: 'dashboard' },
                            { label: 'Services', value: 'services' },
                            { label: 'Growth OS', value: 'growth-os' },
                            { label: 'FAQ', value: 'faq' },
                            { label: 'Free Offer', value: 'free-offer' },
                            { label: 'Contact', value: 'contact' },
                            { label: 'Footer', value: 'footer' },
                          ],
                        },
                        {
                          name: 'visible',
                          type: 'checkbox',
                          label: 'Show on site',
                          defaultValue: true,
                          admin: { width: '30%' },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },

        // ── Branding & Navigation ────────────────────────────────────────────
        {
          label: 'Branding & Nav',
          description: 'Logos and the top navigation bar.',
          fields: [
            {
              name: 'branding',
              type: 'group',
              label: 'Logos',
              admin: {
                description:
                  'Transparent PNGs. The light version is used on dark sections, the dark version on light sections.',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'logoDark',
                      type: 'upload',
                      relationTo: 'media',
                      label: 'Dark logo (for light backgrounds)',
                      admin: largeImageAdmin({ width: '50%' }),
                    },
                    {
                      name: 'logoLight',
                      type: 'upload',
                      relationTo: 'media',
                      label: 'Light logo (for dark backgrounds)',
                      admin: largeImageAdmin({ width: '50%' }),
                    },
                  ],
                },
              ],
            },
            {
              name: 'nav',
              type: 'group',
              label: 'Navigation links',
              admin: {
                description:
                  'Links shown in the top bar. Left links sit beside the logo; right links sit on the opposite side.',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'leftLinks',
                      type: 'array',
                      label: 'Left links',
                      admin: {
                        width: '50%',
                        initCollapsed: false,
                        className: 'compact-array',
                        components: { RowLabel: rowLabel },
                      },
                      fields: [
                        {
                          type: 'row',
                          fields: [
                            { name: 'label', type: 'text', required: true, admin: { width: '50%' } },
                            { name: 'href', type: 'text', required: true, admin: { width: '50%' } },
                          ],
                        },
                      ],
                    },
                    {
                      name: 'rightLinks',
                      type: 'array',
                      label: 'Right links',
                      admin: {
                        width: '50%',
                        initCollapsed: false,
                        className: 'compact-array',
                        components: { RowLabel: rowLabel },
                      },
                      fields: [
                        {
                          type: 'row',
                          fields: [
                            { name: 'label', type: 'text', required: true, admin: { width: '50%' } },
                            { name: 'href', type: 'text', required: true, admin: { width: '50%' } },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },

        // ── Hero ─────────────────────────────────────────────────────────────
        {
          label: 'Hero',
          description: 'The first thing visitors see — headline, taglines, and CTAs.',
          fields: [
            {
              name: 'hero',
              type: 'group',
              label: 'Hero content',
              fields: [
                { name: 'headline', type: 'text', admin: { description: 'Main headline above the rotating phrases.' } },
                { name: 'tagline', type: 'text', admin: { description: 'Short line under the headline.' } },
                { name: 'body', type: 'textarea', admin: { description: 'Paragraph below the tagline. Keep it to 1–2 sentences.' } },
                {
                  name: 'phrases',
                  type: 'array',
                  label: 'Rotating phrases',
                  admin: {
                    description: 'Words that cycle through inside the headline. Order matters.',
                    initCollapsed: false,
                    className: 'compact-array compact-array--no-labels',
                    components: { RowLabel: rowLabel },
                  },
                  fields: [{ name: 'phrase', type: 'text', required: true }],
                },
                {
                  type: 'collapsible',
                  label: 'Call-to-action buttons',
                  admin: { initCollapsed: true },
                  fields: [
                    {
                      name: 'primaryCta',
                      type: 'group',
                      label: 'Primary CTA',
                      fields: [
                        {
                          type: 'row',
                          fields: [
                            { name: 'label', type: 'text', admin: { width: '50%' } },
                            { name: 'href', type: 'text', admin: { width: '50%' } },
                          ],
                        },
                      ],
                    },
                    {
                      name: 'secondaryCta',
                      type: 'group',
                      label: 'Secondary CTA',
                      fields: [
                        {
                          type: 'row',
                          fields: [
                            { name: 'label', type: 'text', admin: { width: '50%' } },
                            { name: 'href', type: 'text', admin: { width: '50%' } },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'collapsible',
                  label: 'Background illustrations',
                  admin: { initCollapsed: true },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'illustrationDark',
                          type: 'upload',
                          relationTo: 'media',
                          label: 'Dark-mode background',
                          admin: largeImageAdmin({
                            width: '50%',
                            description: 'Shown behind hero text in dark mode. ~2400×1600px.',
                          }),
                        },
                        {
                          name: 'illustrationLight',
                          type: 'upload',
                          relationTo: 'media',
                          label: 'Light-mode background',
                          admin: largeImageAdmin({
                            width: '50%',
                            description: 'Shown behind hero text in light mode. ~2400×1600px.',
                          }),
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },

        // ── Systems ──────────────────────────────────────────────────────────
        {
          label: 'Systems',
          description: 'The systems showcase section with the zoomable cards.',
          fields: [
            {
              name: 'systems',
              type: 'group',
              label: 'Systems section',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'eyebrow', type: 'text', admin: { width: '34%', description: 'Small caption above the headline.' } },
                    { name: 'headline', type: 'text', admin: { width: '33%' } },
                    { name: 'headlineAccent', type: 'text', admin: { width: '33%', description: 'Part of the headline rendered in accent color.' } },
                  ],
                },
                {
                  name: 'systems',
                  type: 'array',
                  label: 'System cards',
                  admin: {
                    description: 'One card per system. Cards expand on hover/zoom.',
                    initCollapsed: true,
                    components: { RowLabel: rowLabel },
                  },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        { name: 'num', type: 'text', required: true, label: 'Number', admin: { width: '20%' } },
                        { name: 'id', type: 'text', required: true, label: 'ID (internal)', admin: { width: '30%' } },
                        { name: 'label', type: 'text', required: true, admin: { width: '50%' } },
                      ],
                    },
                    { name: 'title', type: 'text', required: true },
                    { name: 'description', type: 'textarea' },
                    {
                      name: 'image',
                      type: 'upload',
                      relationTo: 'media',
                      label: 'Card image',
                      admin: largeImageAdmin({ description: 'Recommended 800×600px. Shows when the card is expanded.' }),
                    },
                  ],
                },
                {
                  name: 'backgroundImages',
                  type: 'array',
                  label: 'Decorative zoom backgrounds',
                  admin: {
                    description:
                      'The 6 images that zoom out behind the section on scroll. Order matches the on-screen position/scale, so reordering will visibly rearrange the composition.',
                    initCollapsed: true,
                    components: { RowLabel: rowLabel },
                  },
                  minRows: 6,
                  maxRows: 6,
                  fields: [
                    {
                      name: 'image',
                      type: 'upload',
                      relationTo: 'media',
                      required: true,
                      label: 'Image',
                      admin: largeImageAdmin(),
                    },
                  ],
                },
              ],
            },
          ],
        },

        // ── Problem & Solution ───────────────────────────────────────────────
        {
          label: 'Problem & Solution',
          description: 'The pain-points list on the left and the solution panel on the right.',
          fields: [
            {
              name: 'problemSolution',
              type: 'group',
              label: 'Problem / Solution',
              fields: [
                {
                  type: 'collapsible',
                  label: 'Problem side',
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        { name: 'problemEyebrow', type: 'text', admin: { width: '40%' } },
                        { name: 'problemHeadline', type: 'text', admin: { width: '60%' } },
                      ],
                    },
                    {
                      name: 'problems',
                      type: 'array',
                      label: 'Problem cards',
                      admin: {
                        initCollapsed: true,
                        components: { RowLabel: rowLabel },
                      },
                      fields: [
                        {
                          type: 'row',
                          fields: [
                            { name: 'num', type: 'text', required: true, label: 'Number', admin: { width: '20%' } },
                            { name: 'id', type: 'text', required: true, label: 'ID', admin: { width: '30%' } },
                            { name: 'label', type: 'text', required: true, admin: { width: '50%' } },
                          ],
                        },
                        { name: 'title', type: 'text', required: true },
                        { name: 'detail', type: 'textarea' },
                        {
                          name: 'icon',
                          type: 'select',
                          required: true,
                          admin: { description: 'Icon shown on the card.' },
                          options: [
                            { label: 'Close (X)', value: 'close' },
                            { label: 'Alert (!)', value: 'alert' },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  name: 'solution',
                  type: 'group',
                  label: 'Solution panel',
                  admin: { description: 'The bright panel on the right that answers the problems.' },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        { name: 'headline', type: 'text', admin: { width: '50%' } },
                        { name: 'headlineAccent', type: 'text', admin: { width: '50%' } },
                      ],
                    },
                    { name: 'subheadline', type: 'text' },
                    {
                      name: 'bullets',
                      type: 'array',
                      label: 'Bullet points',
                      admin: {
                        initCollapsed: false,
                        className: 'compact-array compact-array--no-labels',
                        components: { RowLabel: rowLabel },
                      },
                      fields: [{ name: 'text', type: 'text', required: true }],
                    },
                    {
                      type: 'row',
                      fields: [
                        { name: 'ctaLabel', type: 'text', admin: { width: '50%' } },
                        { name: 'ctaHref', type: 'text', admin: { width: '50%' } },
                      ],
                    },
                    { name: 'bottomNote', type: 'text', admin: { description: 'Small line under the CTA button.' } },
                  ],
                },
              ],
            },
          ],
        },

        // ── Results ──────────────────────────────────────────────────────────
        {
          label: 'Results',
          description: 'The animated stat counters and the trust note.',
          fields: [
            {
              name: 'results',
              type: 'group',
              label: 'Results section',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'eyebrow', type: 'text', admin: { width: '40%' } },
                    { name: 'headline', type: 'text', admin: { width: '60%' } },
                  ],
                },
                { name: 'subheadline', type: 'textarea' },
                {
                  name: 'stats',
                  type: 'array',
                  label: 'Stat cards',
                  admin: {
                    description: 'Each card animates from 0 up to the value.',
                    initCollapsed: true,
                    components: { RowLabel: rowLabel },
                  },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        { name: 'id', type: 'text', required: true, label: 'ID', admin: { width: '25%' } },
                        { name: 'value', type: 'number', required: true, admin: { width: '25%' } },
                        { name: 'suffix', type: 'text', required: true, admin: { width: '20%', description: 'e.g. %, x, +' } },
                        { name: 'label', type: 'text', required: true, admin: { width: '30%' } },
                      ],
                    },
                    { name: 'sub', type: 'text', required: true, label: 'Sub-label', admin: { description: 'Tiny line under the big number.' } },
                  ],
                },
                { name: 'trustNote', type: 'text', admin: { description: 'Small note above the CTA (e.g. "Trusted by…").' } },
                {
                  type: 'row',
                  fields: [
                    { name: 'ctaLabel', type: 'text', admin: { width: '50%' } },
                    { name: 'ctaHref', type: 'text', admin: { width: '50%' } },
                  ],
                },
              ],
            },
          ],
        },

        // ── Parallax / Difference ────────────────────────────────────────────
        {
          label: 'The Difference',
          description: 'The parallax "Miduva Difference" panel and the pipeline metric.',
          fields: [
            {
              name: 'parallax',
              type: 'group',
              label: 'Parallax section',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'eyebrow', type: 'text', admin: { width: '40%' } },
                    { name: 'headline', type: 'text', admin: { width: '60%' } },
                  ],
                },
                { name: 'description', type: 'textarea' },
                {
                  type: 'collapsible',
                  label: 'Pipeline metric (animated number)',
                  admin: { initCollapsed: false },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        { name: 'pipelineLabel', type: 'text', label: 'Label', admin: { width: '40%' } },
                        { name: 'pipelineValue', type: 'text', label: 'Value', admin: { width: '30%' } },
                        { name: 'pipelineDelta', type: 'text', label: 'Delta (e.g. +12%)', admin: { width: '30%' } },
                      ],
                    },
                  ],
                },
                {
                  type: 'collapsible',
                  label: 'Bottom strip',
                  admin: { initCollapsed: true },
                  fields: [
                    { name: 'bottomLabel', type: 'text' },
                    { name: 'bottomDescription', type: 'textarea' },
                  ],
                },
              ],
            },
            {
              name: 'whyMiduva',
              type: 'group',
              label: 'Why Miduva — differentiator cards',
              admin: { description: 'The old-way / new-way comparison cards.' },
              fields: [
                { name: 'eyebrow', type: 'text' },
                {
                  name: 'differentiators',
                  type: 'array',
                  label: 'Differentiator cards',
                  admin: {
                    initCollapsed: true,
                    components: { RowLabel: rowLabel },
                  },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        { name: 'num', type: 'text', required: true, label: 'Number', admin: { width: '20%' } },
                        { name: 'id', type: 'text', required: true, label: 'ID', admin: { width: '30%' } },
                        { name: 'title', type: 'text', required: true, admin: { width: '50%' } },
                      ],
                    },
                    { name: 'subtitle', type: 'text', required: true },
                    {
                      type: 'row',
                      fields: [
                        { name: 'oldWay', type: 'text', required: true, label: 'Old way', admin: { width: '50%' } },
                        { name: 'newWay', type: 'text', required: true, label: 'New way (Miduva)', admin: { width: '50%' } },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },

        // ── How It Works ─────────────────────────────────────────────────────
        {
          label: 'How It Works',
          description: 'The step-by-step process section.',
          fields: [
            {
              name: 'howItWorks',
              type: 'group',
              label: 'How it works',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'eyebrow', type: 'text', admin: { width: '40%' } },
                    { name: 'headline', type: 'text', admin: { width: '60%' } },
                  ],
                },
                {
                  name: 'steps',
                  type: 'array',
                  label: 'Steps',
                  admin: {
                    description: 'Listed in order. Each step has a background image.',
                    initCollapsed: true,
                    components: { RowLabel: rowLabel },
                  },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        { name: 'num', type: 'text', required: true, label: 'Number', admin: { width: '20%' } },
                        { name: 'id', type: 'text', required: true, label: 'ID', admin: { width: '30%' } },
                        { name: 'title', type: 'text', required: true, admin: { width: '50%' } },
                      ],
                    },
                    { name: 'description', type: 'textarea' },
                    {
                      name: 'image',
                      type: 'upload',
                      relationTo: 'media',
                      label: 'Step background image',
                      admin: largeImageAdmin({ description: 'Recommended 800×600px.' }),
                    },
                  ],
                },
              ],
            },
          ],
        },

        // ── Services ─────────────────────────────────────────────────────────
        {
          label: 'Services',
          description: 'Service categories shown as cards with item lists.',
          fields: [
            {
              name: 'services',
              type: 'group',
              label: 'Services section',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'eyebrow', type: 'text', admin: { width: '34%' } },
                    { name: 'headline', type: 'text', admin: { width: '33%' } },
                    { name: 'headlineAccent', type: 'text', admin: { width: '33%' } },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'ctaLabel', type: 'text', admin: { width: '50%' } },
                    { name: 'ctaHref', type: 'text', admin: { width: '50%' } },
                  ],
                },
                {
                  name: 'categories',
                  type: 'array',
                  label: 'Service categories',
                  admin: {
                    initCollapsed: true,
                    components: { RowLabel: rowLabel },
                  },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        { name: 'id', type: 'text', required: true, label: 'ID', admin: { width: '30%' } },
                        { name: 'title', type: 'text', required: true, admin: { width: '70%' } },
                      ],
                    },
                    {
                      name: 'image',
                      type: 'upload',
                      relationTo: 'media',
                      label: 'Category image',
                      admin: largeImageAdmin({ description: 'Recommended 800×600px.' }),
                    },
                    {
                      name: 'items',
                      type: 'array',
                      label: 'Service items',
                      admin: {
                        initCollapsed: true,
                        components: { RowLabel: rowLabel },
                      },
                      fields: [{ name: 'item', type: 'text', required: true }],
                    },
                  ],
                },
              ],
            },
          ],
        },

        // ── Dashboard mockup ─────────────────────────────────────────────────
        {
          label: 'Dashboard',
          description: 'The stylised dashboard mockup. Edit visible text & numbers — chart curves stay decorative.',
          fields: [
            {
              name: 'dashboard',
              type: 'group',
              label: 'Dashboard mockup',
              fields: [
                {
                  type: 'collapsible',
                  label: 'Top bar',
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        { name: 'urlLabel', type: 'text', label: 'URL bar text', admin: { width: '60%' } },
                        { name: 'statusLabel', type: 'text', label: 'Live status', admin: { width: '40%' } },
                      ],
                    },
                  ],
                },
                {
                  type: 'collapsible',
                  label: 'Sidebar',
                  fields: [
                    {
                      name: 'navItems',
                      type: 'array',
                      label: 'Navigation items',
                      admin: { initCollapsed: true, components: { RowLabel: rowLabel } },
                      fields: [{ name: 'label', type: 'text', required: true }],
                    },
                    {
                      name: 'clients',
                      type: 'array',
                      label: 'Client list',
                      admin: { initCollapsed: true, components: { RowLabel: rowLabel } },
                      fields: [
                        {
                          type: 'row',
                          fields: [
                            { name: 'initials', type: 'text', required: true, admin: { width: '30%' } },
                            { name: 'name', type: 'text', required: true, admin: { width: '70%' } },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'collapsible',
                  label: 'Header',
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        { name: 'eyebrow', type: 'text', admin: { width: '50%', description: 'Small caption above title.' } },
                        { name: 'title', type: 'text', admin: { width: '50%' } },
                      ],
                    },
                  ],
                },
                {
                  name: 'kpis',
                  type: 'array',
                  label: 'KPI cards (4)',
                  admin: { initCollapsed: true, components: { RowLabel: rowLabel } },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        { name: 'label', type: 'text', required: true, admin: { width: '40%' } },
                        { name: 'value', type: 'text', required: true, admin: { width: '30%' } },
                        { name: 'delta', type: 'text', required: true, admin: { width: '30%' } },
                      ],
                    },
                    {
                      name: 'color',
                      type: 'select',
                      required: true,
                      defaultValue: 'teal',
                      options: [
                        { label: 'Teal', value: 'teal' },
                        { label: 'Navy', value: 'navy' },
                      ],
                    },
                  ],
                },
                {
                  type: 'collapsible',
                  label: 'Bar chart',
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        { name: 'chartTitle', type: 'text', label: 'Title', admin: { width: '50%' } },
                        { name: 'chartSubtitle', type: 'text', label: 'Subtitle', admin: { width: '50%' } },
                      ],
                    },
                  ],
                },
                {
                  type: 'collapsible',
                  label: 'Funnel',
                  fields: [
                    { name: 'funnelTitle', type: 'text', label: 'Title' },
                    {
                      name: 'funnelStages',
                      type: 'array',
                      label: 'Funnel stages',
                      admin: { initCollapsed: true, components: { RowLabel: rowLabel } },
                      fields: [
                        {
                          type: 'row',
                          fields: [
                            { name: 'name', type: 'text', required: true, admin: { width: '60%' } },
                            { name: 'value', type: 'text', required: true, admin: { width: '40%' } },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },

        // ── Growth OS (system ribbon) ────────────────────────────────────────
        {
          label: 'Growth OS',
          description: 'The "six modules" bento grid section.',
          fields: [
            {
              name: 'growthOs',
              type: 'group',
              label: 'Growth OS section',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'eyebrow', type: 'text', admin: { width: '34%' } },
                    { name: 'headline', type: 'text', admin: { width: '33%' } },
                    { name: 'headlineAccent', type: 'text', admin: { width: '33%' } },
                  ],
                },
                { name: 'description', type: 'textarea' },
                {
                  type: 'row',
                  fields: [
                    { name: 'ctaLabel', type: 'text', admin: { width: '50%' } },
                    { name: 'ctaHref', type: 'text', admin: { width: '50%' } },
                  ],
                },
                {
                  name: 'modules',
                  type: 'array',
                  label: 'Module cards (6)',
                  admin: { initCollapsed: true, components: { RowLabel: rowLabel } },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        { name: 'name', type: 'text', required: true, admin: { width: '50%' } },
                        { name: 'tag', type: 'text', required: true, admin: { width: '50%' } },
                      ],
                    },
                    { name: 'description', type: 'textarea', required: true },
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'color',
                          type: 'select',
                          required: true,
                          defaultValue: 'teal',
                          options: [
                            { label: 'Teal', value: 'teal' },
                            { label: 'Navy', value: 'navy' },
                          ],
                          admin: { width: '33%' },
                        },
                        {
                          name: 'span',
                          type: 'select',
                          required: true,
                          defaultValue: '1',
                          options: [
                            { label: '1 column', value: '1' },
                            { label: '2 columns', value: '2' },
                          ],
                          admin: { width: '33%' },
                        },
                        {
                          name: 'visual',
                          type: 'select',
                          required: true,
                          defaultValue: 'bars',
                          options: [
                            { label: 'Bars', value: 'bars' },
                            { label: 'Funnel', value: 'funnel' },
                            { label: 'Nodes', value: 'nodes' },
                            { label: 'Grid', value: 'grid' },
                            { label: 'Rings', value: 'rings' },
                            { label: 'Spark', value: 'spark' },
                          ],
                          admin: { width: '34%', description: 'Chooses which SVG animation appears on the card.' },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },

        // ── Free offer ───────────────────────────────────────────────────────
        {
          label: 'Free offer',
          description: 'The full-screen "Free Growth Strategy" CTA block.',
          fields: [
            {
              name: 'freeOffer',
              type: 'group',
              label: 'Free offer section',
              fields: [
                { name: 'eyebrow', type: 'text' },
                {
                  type: 'row',
                  fields: [
                    { name: 'headlineLine1', type: 'text', admin: { width: '34%', description: 'e.g. "Get a Free"' } },
                    { name: 'headlineAccent', type: 'text', admin: { width: '33%', description: 'Accent middle line (e.g. "Growth Strategy")' } },
                    { name: 'headlineLine3', type: 'text', admin: { width: '33%', description: 'e.g. "for Your Business."' } },
                  ],
                },
                {
                  name: 'includes',
                  type: 'array',
                  label: 'Include pills',
                  admin: { initCollapsed: true, components: { RowLabel: rowLabel } },
                  fields: [{ name: 'label', type: 'text', required: true }],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'ctaLabel', type: 'text', admin: { width: '50%' } },
                    { name: 'ctaHref', type: 'text', admin: { width: '50%' } },
                  ],
                },
                { name: 'trustNote', type: 'text', label: 'Trust line' },
              ],
            },
          ],
        },

        // ── Contact ──────────────────────────────────────────────────────────
        {
          label: 'Contact',
          description: 'The "Get in touch" section with the form.',
          fields: [
            {
              name: 'contact',
              type: 'group',
              label: 'Contact section',
              fields: [
                {
                  type: 'collapsible',
                  label: 'Left column — copy',
                  fields: [
                    { name: 'eyebrow', type: 'text' },
                    {
                      type: 'row',
                      fields: [
                        { name: 'headline', type: 'text', admin: { width: '50%' } },
                        { name: 'headlineAccent', type: 'text', admin: { width: '50%' } },
                      ],
                    },
                    { name: 'body', type: 'textarea' },
                    {
                      name: 'contactInfo',
                      type: 'array',
                      label: 'Contact info rows',
                      admin: { initCollapsed: true, components: { RowLabel: rowLabel } },
                      maxRows: 2,
                      fields: [
                        {
                          type: 'row',
                          fields: [
                            {
                              name: 'icon',
                              type: 'select',
                              required: true,
                              defaultValue: 'mail',
                              options: [
                                { label: 'Mail', value: 'mail' },
                                { label: 'Building', value: 'building' },
                              ],
                              admin: { width: '30%' },
                            },
                            { name: 'label', type: 'text', required: true, admin: { width: '70%' } },
                          ],
                        },
                      ],
                    },
                    {
                      name: 'trustStats',
                      type: 'array',
                      label: 'Trust KPI mini-cards (4)',
                      admin: { initCollapsed: true, components: { RowLabel: rowLabel } },
                      fields: [
                        {
                          type: 'row',
                          fields: [
                            { name: 'stat', type: 'text', required: true, admin: { width: '40%' } },
                            { name: 'label', type: 'text', required: true, admin: { width: '60%' } },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'collapsible',
                  label: 'Right column — form card',
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        { name: 'formHeadline', type: 'text', admin: { width: '50%' } },
                        { name: 'formSubheadline', type: 'text', admin: { width: '50%' } },
                      ],
                    },
                    {
                      name: 'serviceOptions',
                      type: 'array',
                      label: 'Service select options',
                      admin: { initCollapsed: true, components: { RowLabel: rowLabel } },
                      fields: [
                        {
                          type: 'row',
                          fields: [
                            { name: 'value', type: 'text', required: true, admin: { width: '40%' } },
                            { name: 'label', type: 'text', required: true, admin: { width: '60%' } },
                          ],
                        },
                      ],
                    },
                    { name: 'submitLabel', type: 'text', label: 'Submit button label' },
                    { name: 'finePrint', type: 'text', label: 'Trust fine print under the button' },
                  ],
                },
              ],
            },
          ],
        },

        // ── Footer ───────────────────────────────────────────────────────────
        {
          label: 'Footer',
          description: 'The cinematic footer.',
          fields: [
            {
              name: 'footer',
              type: 'group',
              label: 'Footer',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'giantBgText', type: 'text', label: 'Giant background text', admin: { width: '50%' } },
                    { name: 'heading', type: 'text', label: 'Main heading', admin: { width: '50%' } },
                  ],
                },
                {
                  name: 'marqueeItems',
                  type: 'array',
                  label: 'Marquee phrases',
                  admin: { initCollapsed: true, components: { RowLabel: rowLabel }, description: 'Cycle of phrases scrolling across the top.' },
                  fields: [{ name: 'phrase', type: 'text', required: true }],
                },
                {
                  name: 'primaryCtas',
                  type: 'array',
                  label: 'Primary CTAs (2)',
                  admin: { initCollapsed: true, components: { RowLabel: rowLabel } },
                  maxRows: 2,
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        { name: 'label', type: 'text', required: true, admin: { width: '50%' } },
                        { name: 'href', type: 'text', required: true, admin: { width: '50%' } },
                      ],
                    },
                  ],
                },
                {
                  name: 'secondaryLinks',
                  type: 'array',
                  label: 'Secondary links',
                  admin: { initCollapsed: true, components: { RowLabel: rowLabel } },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        { name: 'label', type: 'text', required: true, admin: { width: '50%' } },
                        { name: 'href', type: 'text', required: true, admin: { width: '50%' } },
                      ],
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'copyright', type: 'text', admin: { width: '60%' } },
                    { name: 'createdByLabel', type: 'text', label: '"Created by" label', admin: { width: '40%' } },
                  ],
                },
              ],
            },
          ],
        },

        // ── FAQ ──────────────────────────────────────────────────────────────
        {
          label: 'FAQ',
          description: 'Frequently asked questions accordion.',
          fields: [
            {
              name: 'faq',
              type: 'group',
              label: 'FAQ',
              fields: [
                {
                  name: 'items',
                  type: 'array',
                  label: 'FAQ items',
                  admin: {
                    description: 'Questions appear in the order listed here.',
                    initCollapsed: true,
                    components: { RowLabel: rowLabel },
                  },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        { name: 'num', type: 'text', required: true, label: 'Number', admin: { width: '20%' } },
                        { name: 'id', type: 'text', required: true, label: 'ID', admin: { width: '30%' } },
                        { name: 'question', type: 'text', required: true, admin: { width: '50%' } },
                      ],
                    },
                    { name: 'answer', type: 'textarea', required: true },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
