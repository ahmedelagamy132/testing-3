import { readFile } from 'node:fs/promises'
import { getMediaFile } from '@/lib/puck/storage'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    return new Response('Not found', { status: 404 })
  }
  const media = await getMediaFile(id)
  if (!media) return new Response('Not found', { status: 404 })
  try {
    const data = await readFile(media.filePath)
    return new Response(data, {
      headers: {
        'Content-Type': media.mimeType,
        'Content-Length': String(data.byteLength),
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch {
    return new Response('Not found', { status: 404 })
  }
}
