'use client'

import { useEffect } from 'react'

// Tab labels (defined in payload/globals/landing-page.ts) → anchor IDs in the live preview.
const TAB_TO_ANCHOR: Record<string, string> = {
  'Branding & Nav': 'hero',
  Hero: 'hero',
  Systems: 'systems',
  'Problem & Solution': 'problem-solution',
  Results: 'results',
  'The Difference': 'parallax',
  'How It Works': 'how-it-works',
  Services: 'services',
  Dashboard: 'dashboard',
  'Growth OS': 'growth-os',
  'Free offer': 'free-offer',
  Contact: 'contact',
  Footer: 'footer',
  FAQ: 'faq',
}

function findPreviewIframes(): HTMLIFrameElement[] {
  const all = Array.from(document.querySelectorAll('iframe')) as HTMLIFrameElement[]
  return all.filter((f) => {
    const src = f.src || f.getAttribute('data-src') || ''
    return /\/preview(\b|\?|\/|$)/.test(src)
  })
}

export const TabWatcherProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // Track the most recently selected anchor — even if the iframe wasn't ready when
    // we tried to send it, so we can re-send as soon as the iframe announces itself.
    let pendingAnchor: string | null = null

    const broadcast = (anchor: string) => {
      pendingAnchor = anchor
      const iframes = findPreviewIframes()
      if (iframes.length === 0) return false
      let delivered = false
      for (const f of iframes) {
        if (!f.contentWindow) continue
        f.contentWindow.postMessage({ type: 'miduva:focus-section', anchor }, '*')
        delivered = true
      }
      return delivered
    }

    const checkActiveTab = () => {
      const activeTab = document.querySelector('[role="tab"][aria-selected="true"]')
      if (!activeTab) return
      const label = activeTab.textContent?.trim()
      if (!label) return
      const anchor = TAB_TO_ANCHOR[label]
      if (anchor) broadcast(anchor)
    }

    // Initial attempt — may quietly fail if the live-preview iframe isn't mounted yet.
    checkActiveTab()

    // Re-evaluate whenever a tab's aria-selected flips.
    const observer = new MutationObserver(() => checkActiveTab())
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['aria-selected'],
      subtree: true,
      childList: true,
    })

    // Whenever a preview iframe finishes loading, re-send the pending anchor — its
    // message listener has just mounted and any earlier postMessage was lost.
    const iframeLoadHandler = (e: Event) => {
      const target = e.target as HTMLElement
      if (target?.tagName !== 'IFRAME') return
      // Always re-check on iframe load so the very first focus survives the race.
      window.setTimeout(checkActiveTab, 50)
    }
    document.addEventListener('load', iframeLoadHandler, true)

    // The preview side announces itself when it mounts. Reply with the current focus.
    const handshakeHandler = (event: MessageEvent) => {
      const data = event.data
      if (!data || data.type !== 'miduva:preview-ready') return
      if (pendingAnchor) {
        broadcast(pendingAnchor)
      } else {
        // Pending might be null on first paint — derive it from the current tab now.
        checkActiveTab()
      }
    }
    window.addEventListener('message', handshakeHandler)

    // One last fallback: poll briefly for the iframe to appear, then re-check.
    const pollUntil = Date.now() + 8000
    const pollId = window.setInterval(() => {
      if (Date.now() > pollUntil) {
        window.clearInterval(pollId)
        return
      }
      if (findPreviewIframes().length > 0) {
        checkActiveTab()
        window.clearInterval(pollId)
      }
    }, 250)

    return () => {
      observer.disconnect()
      document.removeEventListener('load', iframeLoadHandler, true)
      window.removeEventListener('message', handshakeHandler)
      window.clearInterval(pollId)
    }
  }, [])

  return <>{children}</>
}
