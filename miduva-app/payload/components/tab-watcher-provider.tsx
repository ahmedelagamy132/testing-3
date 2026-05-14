'use client'

import { useEffect } from 'react'

// Tab labels (defined in payload/globals/landing-page.ts) → anchor IDs in the live preview.
const TAB_TO_ANCHOR: Record<string, string> = {
  Layout: '__exit__',
  'Branding & Nav': 'nav',
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
      // The sentinel '__exit__' is mapped from tabs that should show the whole
      // page (e.g. Layout). Translate it to a null anchor so the wrapper exits
      // focus mode rather than trying to scroll to a non-existent section.
      const payload =
        anchor === '__exit__'
          ? { type: 'miduva:focus-section', anchor: null }
          : { type: 'miduva:focus-section', anchor }
      let delivered = false
      for (const f of iframes) {
        if (!f.contentWindow) continue
        f.contentWindow.postMessage(payload, '*')
        delivered = true
      }
      return delivered
    }

    const checkActiveTab = () => {
      // Payload renders tabs as <button class="tabs-field__tab-button"> with an
      // "--active" modifier — there is no role="tab" or aria-selected.
      const activeTab =
        document.querySelector('.tabs-field__tab-button--active') ??
        // Fallback selectors in case Payload renames classes in a minor release.
        document.querySelector('button.tabs-field__tab-button[aria-selected="true"]') ??
        document.querySelector('[role="tab"][aria-selected="true"]')
      if (!activeTab) return
      // The button may contain extra elements (error pill etc.) — read only the
      // tab's own label text, ignoring nested numeric/icon children.
      const label = (activeTab.childNodes[0]?.textContent ?? activeTab.textContent ?? '')
        .replace(/\s+/g, ' ')
        .trim()
      if (!label) return
      const anchor = TAB_TO_ANCHOR[label]
      if (anchor) broadcast(anchor)
    }

    // Initial attempt — may quietly fail if the live-preview iframe isn't mounted yet.
    checkActiveTab()

    // Payload toggles a CSS class on the active tab button, so watch for class
    // mutations (and childList for when tabs first mount).
    const observer = new MutationObserver(() => checkActiveTab())
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class', 'aria-selected'],
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
