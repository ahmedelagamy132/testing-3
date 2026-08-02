"use client"

import { Render } from '@puckeditor/core'
import { landingPageConfig } from '@/lib/puck/config'
import type { LandingPagePuckData } from '@/lib/puck/types'

export function PublicLandingPage({ data }: { data: LandingPagePuckData }) {
  return <Render config={landingPageConfig} data={data} />
}
