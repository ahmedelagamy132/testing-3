import { unstable_cache } from "next/cache"
import { sanityClient } from "./client"
import type { LandingPageData } from "./types"

const LANDING_PAGE_QUERY = `*[_type == "landingPage"][0]{
  seo{ title, description },
  nav{
    leftLinks[]{ label, href },
    rightLinks[]{ label, href }
  },
  kpis[]{ key, value },
  hero{
    headline, tagline, body,
    phrases,
    primaryCta{ label, href },
    secondaryCta{ label, href }
  },
  systems{
    eyebrow, headline, headlineAccent,
    systems[]{
      id, num, label, title, description, imageUrl
    }
  },
  problemSolution{
    problemEyebrow, problemHeadline,
    problems[]{ id, num, label, title, detail, icon },
    solution{
      headline, headlineAccent, subheadline,
      bullets,
      ctaLabel, ctaHref, bottomNote
    }
  },
  results{
    eyebrow, headline, subheadline,
    stats[]{ id, value, suffix, label, sub },
    trustNote, ctaLabel, ctaHref
  },
  parallax{
    eyebrow, headline, description,
    pipelineLabel, pipelineValue, pipelineDelta,
    bottomLabel, bottomDescription
  },
  whyMiduva{
    eyebrow,
    differentiators[]{ id, num, title, subtitle, oldWay, newWay }
  },
  howItWorks{
    eyebrow, headline,
    steps[]{ id, num, title, description, imageUrl }
  },
  services{
    eyebrow, headline, headlineAccent,
    ctaLabel, ctaHref,
    categories[]{ id, title, items, imageUrl }
  }
}`

async function fetchLandingPage(): Promise<LandingPageData | null> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return null
  try {
    return await sanityClient.fetch<LandingPageData>(LANDING_PAGE_QUERY)
  } catch {
    return null
  }
}

export const getLandingPageData =
  process.env.NODE_ENV === "production"
    ? unstable_cache(fetchLandingPage, ["landing-page"], { revalidate: 60, tags: ["landing-page"] })
    : fetchLandingPage
