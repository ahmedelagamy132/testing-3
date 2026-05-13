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

function findPreviewIframe(): HTMLIFrameElement | null {
  const iframes = Array.from(document.querySelectorAll('iframe')) as HTMLIFrameElement[]
  return iframes.find((f) => /\/preview\b/.test(f.src) || /\/preview\b/.test(f.getAttribute('data-src') ?? '')) ?? null
}

export const TabWatcherProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    let lastAnchor: string | null = null

    const sendToIframe = (anchor: string) => {
      if (anchor === lastAnchor) return
      const iframe = findPreviewIframe()
      if (!iframe?.contentWindow) return
      lastAnchor = anchor
      iframe.contentWindow.postMessage({ type: 'miduva:focus-section', anchor }, '*')
    }

    const checkActiveTab = () => {
      const activeTab = document.querySelector('[role="tab"][aria-selected="true"]')
      if (!activeTab) return
      const label = activeTab.textContent?.trim()
      if (!label) return
      const anchor = TAB_TO_ANCHOR[label]
      if (anchor) sendToIframe(anchor)
    }

    checkActiveTab()

    const observer = new MutationObserver(() => checkActiveTab())
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['aria-selected'],
      subtree: true,
      childList: true,
    })

    // Also re-send on iframe load (iframe may mount after our first check).
    const iframeLoadHandler = (e: Event) => {
      const target = e.target as HTMLElement
      if (target?.tagName !== 'IFRAME') return
      if (!lastAnchor) return
      window.setTimeout(checkActiveTab, 300)
    }
    document.addEventListener('load', iframeLoadHandler, true)

    return () => {
      observer.disconnect()
      document.removeEventListener('load', iframeLoadHandler, true)
    }
  }, [])

  return <>{children}</>
}
