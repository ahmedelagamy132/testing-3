'use client'

import { useLivePreviewContext } from '@payloadcms/ui'
import './open-preview-button.scss'

export const OpenPreviewButton = () => {
  const ctx = useLivePreviewContext()
  // The context is also rendered on collections that have no live-preview config.
  // Bail out if live preview isn't enabled for this doc — there's nothing to open.
  if (!ctx || !ctx.isLivePreviewEnabled) return null

  const { isPopupOpen, setIsLivePreviewing, setPreviewWindowType } = ctx
  if (isPopupOpen) return null

  return (
    <button
      type="button"
      className="open-preview-button"
      onClick={(e) => {
        e.preventDefault()
        // Live preview must be ON for Payload to actually send form-state postMessages
        // to the popup. Toggle it before opening.
        setIsLivePreviewing(true)
        // `setPreviewWindowType` here is Payload's `handleWindowChange` which also
        // calls `openPopupWindow()` when type === 'popup'. window.open requires the
        // user gesture from THIS click — happens synchronously, so it goes through.
        setPreviewWindowType('popup')
      }}
    >
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 16 16"
        width="14"
        height="14"
      >
        <path
          d="M9.5 2.5h4v4M13.5 2.5l-6 6M11.5 9v3.5a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Open preview
    </button>
  )
}
