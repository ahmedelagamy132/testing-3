import { defineType, defineField, defineArrayMember } from "sanity"

// ─── Reusable sub-objects ─────────────────────────────────────────────────────

const navLink = defineArrayMember({
  type: "object",
  fields: [
    defineField({ name: "label", type: "string", title: "Label" }),
    defineField({ name: "href", type: "string", title: "Href" }),
  ],
})

const kpiItem = defineArrayMember({
  type: "object",
  fields: [
    defineField({ name: "key", type: "string", title: "Key" }),
    defineField({ name: "value", type: "string", title: "Value" }),
  ],
})

const ctaField = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "object",
    fields: [
      defineField({ name: "label", type: "string", title: "Label" }),
      defineField({ name: "href", type: "string", title: "Href" }),
    ],
  })

// ─── Main document ────────────────────────────────────────────────────────────

export const landingPage = defineType({
  name: "landingPage",
  title: "Landing Page",
  type: "document",
  fields: [
    // ── SEO ──────────────────────────────────────────────────────────────────
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      fields: [
        defineField({ name: "title", type: "string", title: "Page title" }),
        defineField({ name: "description", type: "text", rows: 3, title: "Meta description" }),
      ],
    }),

    // ── Navigation ────────────────────────────────────────────────────────────
    defineField({
      name: "nav",
      title: "Navigation",
      type: "object",
      fields: [
        defineField({ name: "leftLinks", title: "Left links", type: "array", of: [navLink] }),
        defineField({ name: "rightLinks", title: "Right links", type: "array", of: [navLink] }),
      ],
    }),

    // ── KPI strip ─────────────────────────────────────────────────────────────
    defineField({
      name: "kpis",
      title: "KPI Strip (metrics bar below hero)",
      type: "array",
      of: [kpiItem],
    }),

    // ── Hero ──────────────────────────────────────────────────────────────────
    defineField({
      name: "hero",
      title: "Hero Section",
      type: "object",
      fields: [
        defineField({ name: "headline", type: "string", title: "Headline" }),
        defineField({ name: "tagline", type: "string", title: "Tagline (mono uppercase)" }),
        defineField({ name: "body", type: "text", rows: 3, title: "Body copy" }),
        defineField({
          name: "phrases",
          title: "Rotating phrases",
          type: "array",
          of: [{ type: "string" }],
        }),
        ctaField("primaryCta", "Primary CTA"),
        ctaField("secondaryCta", "Secondary CTA"),
      ],
    }),

    // ── Systems section ────────────────────────────────────────────────────────
    defineField({
      name: "systems",
      title: "Systems Section",
      type: "object",
      fields: [
        defineField({ name: "eyebrow", type: "string", title: "Eyebrow" }),
        defineField({ name: "headline", type: "string", title: "Headline" }),
        defineField({ name: "headlineAccent", type: "string", title: "Headline accent (teal span)" }),
        defineField({
          name: "systems",
          title: "System cards",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({ name: "id", type: "string", title: "ID (slug)" }),
                defineField({ name: "num", type: "string", title: "Number (01, 02, 03)" }),
                defineField({ name: "label", type: "string", title: "Label" }),
                defineField({ name: "title", type: "string", title: "Title" }),
                defineField({ name: "description", type: "text", rows: 3, title: "Description" }),
                defineField({ name: "imageUrl", type: "url", title: "Image URL" }),
              ],
            }),
          ],
        }),
      ],
    }),

    // ── Problem / Solution ─────────────────────────────────────────────────────
    defineField({
      name: "problemSolution",
      title: "Problem / Solution Section",
      type: "object",
      fields: [
        defineField({ name: "problemEyebrow", type: "string", title: "Problem eyebrow" }),
        defineField({ name: "problemHeadline", type: "string", title: "Problem headline" }),
        defineField({
          name: "problems",
          title: "Problem cards",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({ name: "id", type: "string", title: "ID" }),
                defineField({ name: "num", type: "string", title: "Number (01, 02, 03)" }),
                defineField({ name: "label", type: "string", title: "Trap label" }),
                defineField({ name: "title", type: "string", title: "Title" }),
                defineField({ name: "detail", type: "text", rows: 2, title: "Detail" }),
                defineField({
                  name: "icon",
                  type: "string",
                  title: "Icon",
                  options: { list: ["close", "alert"] },
                }),
              ],
            }),
          ],
        }),
        defineField({
          name: "solution",
          title: "Solution panel",
          type: "object",
          fields: [
            defineField({ name: "headline", type: "string", title: "Headline" }),
            defineField({ name: "headlineAccent", type: "string", title: "Headline accent" }),
            defineField({ name: "subheadline", type: "string", title: "Subheadline" }),
            defineField({ name: "bullets", title: "Bullets", type: "array", of: [{ type: "string" }] }),
            defineField({ name: "ctaLabel", type: "string", title: "CTA label" }),
            defineField({ name: "ctaHref", type: "string", title: "CTA href" }),
            defineField({ name: "bottomNote", type: "string", title: "Bottom note (mono)" }),
          ],
        }),
      ],
    }),

    // ── Results / Stats ────────────────────────────────────────────────────────
    defineField({
      name: "results",
      title: "Results Section",
      type: "object",
      fields: [
        defineField({ name: "eyebrow", type: "string", title: "Eyebrow" }),
        defineField({ name: "headline", type: "string", title: "Headline" }),
        defineField({ name: "subheadline", type: "text", rows: 2, title: "Subheadline" }),
        defineField({
          name: "stats",
          title: "Stat cards",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({ name: "id", type: "string", title: "ID" }),
                defineField({ name: "value", type: "number", title: "Number value" }),
                defineField({ name: "suffix", type: "string", title: "Suffix (+, ×, %)" }),
                defineField({ name: "label", type: "string", title: "Label" }),
                defineField({ name: "sub", type: "string", title: "Sub-label" }),
              ],
            }),
          ],
        }),
        defineField({ name: "trustNote", type: "string", title: "Trust note (mono)" }),
        defineField({ name: "ctaLabel", type: "string", title: "CTA label" }),
        defineField({ name: "ctaHref", type: "string", title: "CTA href" }),
      ],
    }),

    // ── Parallax section ───────────────────────────────────────────────────────
    defineField({
      name: "parallax",
      title: "Parallax / Miduva Difference Section",
      type: "object",
      fields: [
        defineField({ name: "eyebrow", type: "string", title: "Eyebrow (The Miduva Difference)" }),
        defineField({ name: "headline", type: "string", title: "Headline (Built as a system.)" }),
        defineField({ name: "description", type: "text", rows: 3, title: "Description" }),
        defineField({ name: "pipelineLabel", type: "string", title: "Pipeline card label" }),
        defineField({ name: "pipelineValue", type: "string", title: "Pipeline card value ($482,120)" }),
        defineField({ name: "pipelineDelta", type: "string", title: "Pipeline delta (▲ 21.4%)" }),
        defineField({ name: "bottomLabel", type: "string", title: "Bottom label (mono)" }),
        defineField({ name: "bottomDescription", type: "text", rows: 2, title: "Bottom description" }),
      ],
    }),

    // ── Why Miduva ─────────────────────────────────────────────────────────────
    defineField({
      name: "whyMiduva",
      title: "Why Miduva Section",
      type: "object",
      fields: [
        defineField({ name: "eyebrow", type: "string", title: "Eyebrow tag" }),
        defineField({
          name: "differentiators",
          title: "Differentiator cards",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({ name: "id", type: "string", title: "ID (custom, data, ai, roi)" }),
                defineField({ name: "num", type: "string", title: "Number (01, 02, 03, 04)" }),
                defineField({ name: "title", type: "string", title: "Title" }),
                defineField({ name: "subtitle", type: "string", title: "Subtitle (mono tag)" }),
                defineField({ name: "oldWay", type: "string", title: "Old way (strikethrough)" }),
                defineField({ name: "newWay", type: "string", title: "New way (teal highlight)" }),
              ],
            }),
          ],
        }),
      ],
    }),

    // ── How It Works ───────────────────────────────────────────────────────────
    defineField({
      name: "howItWorks",
      title: "How It Works Section",
      type: "object",
      fields: [
        defineField({ name: "eyebrow", type: "string", title: "Eyebrow" }),
        defineField({ name: "headline", type: "string", title: "Headline" }),
        defineField({
          name: "steps",
          title: "Steps",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({ name: "id", type: "string", title: "ID" }),
                defineField({ name: "num", type: "string", title: "Number (01–04)" }),
                defineField({ name: "title", type: "string", title: "Title" }),
                defineField({ name: "description", type: "text", rows: 3, title: "Description" }),
                defineField({ name: "imageUrl", type: "url", title: "Image URL" }),
              ],
            }),
          ],
        }),
      ],
    }),

    // ── Services ───────────────────────────────────────────────────────────────
    defineField({
      name: "services",
      title: "Services Section",
      type: "object",
      fields: [
        defineField({ name: "eyebrow", type: "string", title: "Eyebrow" }),
        defineField({ name: "headline", type: "string", title: "Headline" }),
        defineField({ name: "headlineAccent", type: "string", title: "Headline accent (teal)" }),
        defineField({ name: "ctaLabel", type: "string", title: "CTA label" }),
        defineField({ name: "ctaHref", type: "string", title: "CTA href" }),
        defineField({
          name: "categories",
          title: "Service categories",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({ name: "id", type: "string", title: "ID (slug)" }),
                defineField({ name: "title", type: "string", title: "Category name" }),
                defineField({ name: "items", title: "Service items", type: "array", of: [{ type: "string" }] }),
                defineField({ name: "imageUrl", type: "url", title: "Image URL" }),
              ],
            }),
          ],
        }),
      ],
    }),
  ],
})
