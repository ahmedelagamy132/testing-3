import { randomUUID } from 'node:crypto'
import { unlink, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'
import { requirePuckAdmin } from '@/lib/puck/auth'
import { addMedia, listMedia, puckMediaDirectory } from '@/lib/puck/storage'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MAX_FILE_BYTES = 10 * 1024 * 1024
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

export async function GET() {
  const denied = await requirePuckAdmin()
  if (denied) return denied
  return Response.json({ media: await listMedia() }, { headers: { 'Cache-Control': 'no-store' } })
}

export async function POST(request: Request) {
  const denied = await requirePuckAdmin(request)
  if (denied) return denied
  const contentLength = Number(request.headers.get('content-length') ?? 0)
  if (Number.isFinite(contentLength) && contentLength > MAX_FILE_BYTES + 512 * 1024) {
    return Response.json({ error: 'Images must be 10 MB or smaller.' }, { status: 413 })
  }

  let file: FormDataEntryValue | null
  let writtenPath: string | null = null
  try {
    file = (await request.formData()).get('file')
  } catch {
    return Response.json({ error: 'Invalid upload.' }, { status: 400 })
  }
  if (!(file instanceof File)) return Response.json({ error: 'Choose an image to upload.' }, { status: 400 })
  if (!ALLOWED_TYPES.has(file.type)) return Response.json({ error: 'Only JPEG, PNG, and WebP images are accepted.' }, { status: 415 })
  if (file.size <= 0 || file.size > MAX_FILE_BYTES) return Response.json({ error: 'Images must be 10 MB or smaller.' }, { status: 413 })

  try {
    const source = Buffer.from(await file.arrayBuffer())
    const inputMetadata = await sharp(source).metadata()
    if (!inputMetadata.width || !inputMetadata.height || !['jpeg', 'png', 'webp'].includes(inputMetadata.format ?? '')) {
      return Response.json({ error: 'The uploaded file is not a valid supported image.' }, { status: 415 })
    }
    if (inputMetadata.width * inputMetadata.height > 80_000_000) {
      return Response.json({ error: 'The image dimensions are too large.' }, { status: 413 })
    }

    const encoded = await sharp(source)
      .rotate()
      .webp({ quality: 86, effort: 4 })
      .toBuffer({ resolveWithObject: true })
    const id = randomUUID()
    const fileName = `${id}.webp`
    writtenPath = path.join(/*turbopackIgnore: true*/ puckMediaDirectory, fileName)
    await writeFile(writtenPath, encoded.data, { flag: 'wx' })
    const createdAt = new Date().toISOString()
    const media = await addMedia({
      id,
      fileName,
      originalName: file.name.slice(0, 255),
      mimeType: 'image/webp',
      width: encoded.info.width,
      height: encoded.info.height,
      size: encoded.data.byteLength,
      createdAt,
    })
    return Response.json({ media }, { status: 201 })
  } catch {
    if (writtenPath) await unlink(writtenPath).catch(() => undefined)
    return Response.json({ error: 'The image could not be processed.' }, { status: 422 })
  }
}
