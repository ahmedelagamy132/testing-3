import { ConsentManager } from '@/components/consent-manager'

const ID_PATTERN = /^[A-Za-z0-9-]+$/

function readId(value: string | undefined) {
  return value && ID_PATTERN.test(value) ? value : null
}

// IDs are read at request time so they can be set in docker-compose without rebuilding.
// Trackers only load after the visitor accepts cookies in the consent banner.
export function Analytics() {
  return <ConsentManager gaId={readId(process.env.GA_MEASUREMENT_ID)} pixelId={readId(process.env.META_PIXEL_ID)} />
}
