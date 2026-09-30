type TrackingWindow = Window & {
  gtag?: (...args: unknown[]) => void
  fbq?: (...args: unknown[]) => void
}

// Fires a lead conversion on whichever trackers are loaded; no-op when none are configured.
export function trackLead(source: string) {
  if (typeof window === 'undefined') return
  const w = window as TrackingWindow
  w.gtag?.('event', 'generate_lead', { form_source: source })
  w.fbq?.('track', 'Lead', { content_name: source })
}
