"use client"

import { LandingPage } from '@/components/puck/landing-page'
import type { LandingContent } from '@/lib/site-editor/content'

export function PublicLandingPage({ content }: { content: LandingContent }) {
  return <LandingPage content={content} />
}
