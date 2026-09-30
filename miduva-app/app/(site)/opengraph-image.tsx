import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const alt = 'Miduva — We Build Custom Growth Systems'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OpenGraphImage() {
  const logo = await readFile(join(process.cwd(), 'public/assets/miduva-logo-white.png'), 'base64')

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          background: 'linear-gradient(135deg, #0F2349 0%, #162B57 55%, #1E3A6E 100%)',
          color: '#FFFFFF',
        }}
      >
        <img src={`data:image/png;base64,${logo}`} width={280} height={60} alt="" />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.03em' }}>
            We build custom
          </div>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.03em', color: '#2BC8B7' }}>
            growth systems.
          </div>
          <div style={{ marginTop: 28, fontSize: 30, color: '#8EE5DB', opacity: 0.9 }}>
            Ads · Funnels · Automation · Data — engineered end-to-end, owned by you.
          </div>
        </div>
        <div style={{ display: 'flex', fontSize: 24, color: '#E6FAF7', opacity: 0.7 }}>miduva.com</div>
      </div>
    ),
    size,
  )
}
