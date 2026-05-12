import type { GlobalConfig } from 'payload'

export const landingPage: GlobalConfig = {
  slug: 'landing-page',
  label: 'Landing Page',
  admin: {
    description: 'All content for the Miduva landing page.',
  },
  fields: [
    // ── Navigation ──────────────────────────────────────────────────────────
    {
      name: 'nav',
      type: 'group',
      label: 'Navigation',
      fields: [
        {
          name: 'leftLinks',
          type: 'array',
          label: 'Left links',
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'href', type: 'text', required: true },
          ],
        },
        {
          name: 'rightLinks',
          type: 'array',
          label: 'Right links',
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'href', type: 'text', required: true },
          ],
        },
      ],
    },

    // ── KPI Strip ───────────────────────────────────────────────────────────
    {
      name: 'kpis',
      type: 'array',
      label: 'KPI Strip (metrics bar below hero)',
      fields: [
        { name: 'key', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
      ],
    },

    // ── Hero ────────────────────────────────────────────────────────────────
    {
      name: 'hero',
      type: 'group',
      label: 'Hero Section',
      fields: [
        { name: 'headline', type: 'text' },
        { name: 'tagline', type: 'text' },
        { name: 'body', type: 'textarea' },
        {
          name: 'phrases',
          type: 'array',
          label: 'Rotating phrases',
          fields: [{ name: 'phrase', type: 'text', required: true }],
        },
        {
          name: 'primaryCta',
          type: 'group',
          label: 'Primary CTA',
          fields: [
            { name: 'label', type: 'text' },
            { name: 'href', type: 'text' },
          ],
        },
        {
          name: 'secondaryCta',
          type: 'group',
          label: 'Secondary CTA',
          fields: [
            { name: 'label', type: 'text' },
            { name: 'href', type: 'text' },
          ],
        },
      ],
    },

    // ── Systems Section ─────────────────────────────────────────────────────
    {
      name: 'systems',
      type: 'group',
      label: 'Systems Section',
      fields: [
        { name: 'eyebrow', type: 'text' },
        { name: 'headline', type: 'text' },
        { name: 'headlineAccent', type: 'text' },
        {
          name: 'systems',
          type: 'array',
          label: 'System cards',
          fields: [
            { name: 'id', type: 'text', required: true },
            { name: 'num', type: 'text', required: true },
            { name: 'label', type: 'text', required: true },
            { name: 'title', type: 'text', required: true },
            { name: 'description', type: 'textarea' },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              label: 'Card image',
            },
          ],
        },
      ],
    },

    // ── Problem / Solution ──────────────────────────────────────────────────
    {
      name: 'problemSolution',
      type: 'group',
      label: 'Problem / Solution Section',
      fields: [
        { name: 'problemEyebrow', type: 'text' },
        { name: 'problemHeadline', type: 'text' },
        {
          name: 'problems',
          type: 'array',
          label: 'Problem cards',
          fields: [
            { name: 'id', type: 'text', required: true },
            { name: 'num', type: 'text', required: true },
            { name: 'label', type: 'text', required: true },
            { name: 'title', type: 'text', required: true },
            { name: 'detail', type: 'textarea' },
            {
              name: 'icon',
              type: 'select',
              required: true,
              options: [
                { label: 'Close (X)', value: 'close' },
                { label: 'Alert (!)', value: 'alert' },
              ],
            },
          ],
        },
        {
          name: 'solution',
          type: 'group',
          label: 'Solution panel',
          fields: [
            { name: 'headline', type: 'text' },
            { name: 'headlineAccent', type: 'text' },
            { name: 'subheadline', type: 'text' },
            {
              name: 'bullets',
              type: 'array',
              label: 'Bullet points',
              fields: [{ name: 'text', type: 'text', required: true }],
            },
            { name: 'ctaLabel', type: 'text' },
            { name: 'ctaHref', type: 'text' },
            { name: 'bottomNote', type: 'text' },
          ],
        },
      ],
    },

    // ── Results / Stats ─────────────────────────────────────────────────────
    {
      name: 'results',
      type: 'group',
      label: 'Results Section',
      fields: [
        { name: 'eyebrow', type: 'text' },
        { name: 'headline', type: 'text' },
        { name: 'subheadline', type: 'textarea' },
        {
          name: 'stats',
          type: 'array',
          label: 'Stat cards',
          fields: [
            { name: 'id', type: 'text', required: true },
            { name: 'value', type: 'number', required: true },
            { name: 'suffix', type: 'text', required: true },
            { name: 'label', type: 'text', required: true },
            { name: 'sub', type: 'text', required: true },
          ],
        },
        { name: 'trustNote', type: 'text' },
        { name: 'ctaLabel', type: 'text' },
        { name: 'ctaHref', type: 'text' },
      ],
    },

    // ── Parallax Section ────────────────────────────────────────────────────
    {
      name: 'parallax',
      type: 'group',
      label: 'Parallax / Miduva Difference Section',
      fields: [
        { name: 'eyebrow', type: 'text' },
        { name: 'headline', type: 'text' },
        { name: 'description', type: 'textarea' },
        { name: 'pipelineLabel', type: 'text' },
        { name: 'pipelineValue', type: 'text' },
        { name: 'pipelineDelta', type: 'text' },
        { name: 'bottomLabel', type: 'text' },
        { name: 'bottomDescription', type: 'textarea' },
      ],
    },

    // ── Why Miduva ──────────────────────────────────────────────────────────
    {
      name: 'whyMiduva',
      type: 'group',
      label: 'Why Miduva Section',
      fields: [
        { name: 'eyebrow', type: 'text' },
        {
          name: 'differentiators',
          type: 'array',
          label: 'Differentiator cards',
          fields: [
            { name: 'id', type: 'text', required: true },
            { name: 'num', type: 'text', required: true },
            { name: 'title', type: 'text', required: true },
            { name: 'subtitle', type: 'text', required: true },
            { name: 'oldWay', type: 'text', required: true },
            { name: 'newWay', type: 'text', required: true },
          ],
        },
      ],
    },

    // ── How It Works ────────────────────────────────────────────────────────
    {
      name: 'howItWorks',
      type: 'group',
      label: 'How It Works Section',
      fields: [
        { name: 'eyebrow', type: 'text' },
        { name: 'headline', type: 'text' },
        {
          name: 'steps',
          type: 'array',
          label: 'Steps',
          fields: [
            { name: 'id', type: 'text', required: true },
            { name: 'num', type: 'text', required: true },
            { name: 'title', type: 'text', required: true },
            { name: 'description', type: 'textarea' },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              label: 'Step background image',
            },
          ],
        },
      ],
    },

    // ── Services ────────────────────────────────────────────────────────────
    {
      name: 'services',
      type: 'group',
      label: 'Services Section',
      fields: [
        { name: 'eyebrow', type: 'text' },
        { name: 'headline', type: 'text' },
        { name: 'headlineAccent', type: 'text' },
        { name: 'ctaLabel', type: 'text' },
        { name: 'ctaHref', type: 'text' },
        {
          name: 'categories',
          type: 'array',
          label: 'Service categories',
          fields: [
            { name: 'id', type: 'text', required: true },
            { name: 'title', type: 'text', required: true },
            {
              name: 'items',
              type: 'array',
              label: 'Service items',
              fields: [{ name: 'item', type: 'text', required: true }],
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              label: 'Category image',
            },
          ],
        },
      ],
    },
  ],
}
