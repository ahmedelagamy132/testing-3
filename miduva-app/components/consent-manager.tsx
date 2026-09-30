"use client"

import { useEffect, useState, useSyncExternalStore } from "react"
import Script from "next/script"
import Link from "next/link"
import {
  CONSENT_CHANGE_EVENT,
  CONSENT_OPEN_EVENT,
  clearTrackingCookies,
  readConsent,
  writeConsent,
  type ConsentChoice,
} from "@/lib/consent"

type ConsentSnapshot = ConsentChoice | "unset" | "pending"

function subscribeToConsent(onChange: () => void) {
  window.addEventListener(CONSENT_CHANGE_EVENT, onChange)
  return () => window.removeEventListener(CONSENT_CHANGE_EVENT, onChange)
}

const getConsentSnapshot = (): ConsentSnapshot => readConsent() ?? "unset"
// The cookie can't be read during SSR, so the banner and trackers wait for the client.
const getServerConsentSnapshot = (): ConsentSnapshot => "pending"

export function ConsentManager({ gaId, pixelId }: { gaId: string | null; pixelId: string | null }) {
  const hasTrackers = Boolean(gaId || pixelId)
  const consent = useSyncExternalStore(subscribeToConsent, getConsentSnapshot, getServerConsentSnapshot)
  const [reopened, setReopened] = useState(false)

  useEffect(() => {
    const onOpen = () => setReopened(true)
    window.addEventListener(CONSENT_OPEN_EVENT, onOpen)
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, onOpen)
  }, [])

  // Trackers still in memory can re-set cookies before the reload finishes, so clean up on every load too.
  useEffect(() => {
    if (consent === "denied") clearTrackingCookies()
  }, [consent])

  const choose = (choice: ConsentChoice) => {
    const wasGranted = consent === "granted"
    writeConsent(choice)
    setReopened(false)
    // Already-loaded trackers can't be unloaded, so withdrawing consent clears their cookies and reloads.
    if (choice === "denied" && wasGranted) {
      if (gaId) (window as unknown as Record<string, unknown>)[`ga-disable-${gaId}`] = true
      clearTrackingCookies()
      window.location.reload()
    }
  }

  const open = consent !== "pending" && (reopened || (hasTrackers && consent === "unset"))
  const trackingAllowed = hasTrackers && consent === "granted"

  return (
    <>
      {trackingAllowed && gaId && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${gaId}');`}
          </Script>
        </>
      )}
      {trackingAllowed && pixelId && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixelId}');fbq('track','PageView');`}
        </Script>
      )}

      {open && (
        <div
          role="dialog"
          aria-live="polite"
          aria-label="Cookie preferences"
          className="fixed inset-x-4 bottom-4 z-[1000] mx-auto max-w-xl rounded-2xl border p-5 shadow-2xl backdrop-blur-xl md:inset-x-auto md:right-6 md:bottom-6"
          style={{ background: "color-mix(in srgb, var(--card) 92%, transparent)", borderColor: "var(--line)", color: "var(--ink)" }}
        >
          {hasTrackers ? (
            <>
              <p className="text-sm font-semibold">We use cookies to measure what works.</p>
              <p className="mt-1.5 text-[13px] leading-relaxed" style={{ color: "var(--muted)" }}>
                With your permission we use Google Analytics and the Meta Pixel to understand traffic and ad performance.
                Nothing loads until you accept. See our{" "}
                <Link href="/privacy#cookies" className="underline underline-offset-2" style={{ color: "var(--teal-500)" }}>
                  Privacy Policy
                </Link>
                .
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => choose("granted")}
                  className="h-10 rounded-xl px-5 text-sm font-bold"
                  style={{ background: "var(--teal-500)", color: "#02060F" }}
                >
                  Accept
                </button>
                <button
                  type="button"
                  onClick={() => choose("denied")}
                  className="h-10 rounded-xl border px-5 text-sm font-semibold"
                  style={{ borderColor: "var(--line)", color: "var(--ink)" }}
                >
                  Decline
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm font-semibold">No optional cookies in use.</p>
              <p className="mt-1.5 text-[13px] leading-relaxed" style={{ color: "var(--muted)" }}>
                This site currently runs no analytics or advertising cookies, so there is nothing to opt in or out of.
              </p>
              <button
                type="button"
                onClick={() => setReopened(false)}
                className="mt-4 h-10 rounded-xl border px-5 text-sm font-semibold"
                style={{ borderColor: "var(--line)", color: "var(--ink)" }}
              >
                Close
              </button>
            </>
          )}
        </div>
      )}
    </>
  )
}
