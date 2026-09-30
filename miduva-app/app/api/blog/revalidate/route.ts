import { timingSafeEqual } from 'node:crypto'
import { revalidateTag } from 'next/cache'
import { WORDPRESS_TAG } from '@/lib/wordpress'

// Called by the miduva-headless WordPress plugin whenever a post or category
// changes, so /blog shows edits without waiting for the cache to expire.
export async function POST(request: Request) {
  const secret = process.env.WP_REVALIDATE_SECRET
  const given = request.headers.get('x-revalidate-secret') ?? ''
  const ok = !!secret && given.length === secret.length && timingSafeEqual(Buffer.from(given), Buffer.from(secret))
  if (!ok) return Response.json({ revalidated: false }, { status: 401 })

  revalidateTag(WORDPRESS_TAG, 'max')
  return Response.json({ revalidated: true })
}
