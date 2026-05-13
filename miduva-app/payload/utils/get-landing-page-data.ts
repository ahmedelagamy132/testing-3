import type { LandingPageData } from '@/lib/types'
import { getPayload } from './get-payload'
import { transformLandingPage } from './transform-landing-page'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyDoc = Record<string, any>

export async function getLandingPageRawDoc(opts: { draft?: boolean } = {}): Promise<AnyDoc | null> {
  try {
    const payload = await getPayload()
    const doc = (await payload.findGlobal({
      slug: 'landing-page',
      depth: 1,
      draft: opts.draft ?? false,
    })) as AnyDoc | null
    return doc
  } catch (error) {
    console.error('[getLandingPageRawDoc] Failed to fetch from Payload:', error)
    return null
  }
}

export async function getLandingPageData(): Promise<LandingPageData> {
  const doc = await getLandingPageRawDoc()
  return transformLandingPage(doc)
}
