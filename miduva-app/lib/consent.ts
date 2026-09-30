export type ConsentChoice = 'granted' | 'denied'

const CONSENT_COOKIE = 'miduva_consent'
const CONSENT_MAX_AGE = 60 * 60 * 24 * 180 // 180 days
export const CONSENT_CHANGE_EVENT = 'miduva:consent-change'
export const CONSENT_OPEN_EVENT = 'miduva:consent-open'

export function readConsent(): ConsentChoice | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp(`(?:^|; )${CONSENT_COOKIE}=(granted|denied)`))
  return (match?.[1] as ConsentChoice | undefined) ?? null
}

export function writeConsent(choice: ConsentChoice) {
  const secure = window.location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${CONSENT_COOKIE}=${choice}; Max-Age=${CONSENT_MAX_AGE}; Path=/; SameSite=Lax${secure}`
  window.dispatchEvent(new CustomEvent<ConsentChoice>(CONSENT_CHANGE_EVENT, { detail: choice }))
}

export function openConsentSettings() {
  window.dispatchEvent(new Event(CONSENT_OPEN_EVENT))
}

// Removes cookies set by GA4 (_ga, _ga_*, _gid) and the Meta Pixel (_fbp, _fbc) after consent is withdrawn.
export function clearTrackingCookies() {
  const names = document.cookie.split('; ').map((pair) => pair.split('=')[0])
  const host = window.location.hostname
  const domains = ['', host, `.${host}`, `.${host.split('.').slice(-2).join('.')}`]
  for (const name of names) {
    if (!/^(_ga|_gid|_gat|_fbp|_fbc)/.test(name)) continue
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; Path=/${domain ? `; Domain=${domain}` : ''}`
    }
  }
}
