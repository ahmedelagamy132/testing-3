import path from 'path'
import { getPayload } from 'payload'
import config from '@payload-config'

interface SeedEntry {
  title: string
  alt: string
  filePath: string
}

const ASSETS_DIR = path.resolve(process.cwd(), 'public/assets')

const ENTRIES: SeedEntry[] = [
  {
    title: 'Miduva logo (dark)',
    alt: 'Miduva logo',
    filePath: path.join(ASSETS_DIR, 'miduva-logo.png'),
  },
  {
    title: 'Miduva logo (white)',
    alt: 'Miduva logo',
    filePath: path.join(ASSETS_DIR, 'miduva-logo-white.png'),
  },
  {
    title: 'Hero illustration — dark mode',
    alt: 'Miduva system illustration',
    filePath: path.join(ASSETS_DIR, 'system-dark.png'),
  },
  {
    title: 'Hero illustration — light mode',
    alt: 'Miduva system illustration',
    filePath: path.join(ASSETS_DIR, 'system-light.png'),
  },
]

async function findOrCreate(payload: Awaited<ReturnType<typeof getPayload>>, entry: SeedEntry) {
  const existing = await payload.find({
    collection: 'media',
    where: { title: { equals: entry.title } },
    limit: 1,
  })
  if (existing.docs.length > 0) {
    console.log(`✓ exists: ${entry.title} (id=${existing.docs[0].id})`)
    return existing.docs[0]
  }
  const created = await payload.create({
    collection: 'media',
    data: { title: entry.title, alt: entry.alt },
    filePath: entry.filePath,
  })
  console.log(`+ created: ${entry.title} (id=${created.id})`)
  return created
}

async function run() {
  const payload = await getPayload({ config })

  console.log('🌱 Seeding current site images into Media…')

  const [logoDark, logoLight, illDark, illLight] = await Promise.all(
    ENTRIES.map((e) => findOrCreate(payload, e)),
  )

  // Wire them into the landing-page global only if those fields are empty,
  // so we don't trample anything the client has already changed.
  const current = (await payload.findGlobal({
    slug: 'landing-page',
    depth: 0,
  })) as unknown as Record<string, unknown>

  const branding = (current.branding ?? {}) as Record<string, unknown>
  const hero = (current.hero ?? {}) as Record<string, unknown>

  const patch: Record<string, unknown> = {}
  if (!branding.logoDark) patch.branding = { ...branding, logoDark: logoDark.id }
  if (!branding.logoLight) patch.branding = { ...(patch.branding ?? branding), logoLight: logoLight.id }
  if (!hero.illustrationDark || !hero.illustrationLight) {
    patch.hero = {
      ...hero,
      illustrationDark: hero.illustrationDark ?? illDark.id,
      illustrationLight: hero.illustrationLight ?? illLight.id,
    }
  }

  if (Object.keys(patch).length === 0) {
    console.log('✓ landing-page already references the current images; nothing to wire.')
  } else {
    await payload.updateGlobal({ slug: 'landing-page', data: patch })
    console.log('✓ wired images into landing-page global:', Object.keys(patch).join(', '))
  }

  console.log('✅ Done.')
  process.exit(0)
}

await run().catch((err) => {
  console.error('❌ seed-images failed:', err)
  process.exit(1)
})
