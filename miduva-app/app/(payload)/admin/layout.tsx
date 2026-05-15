import type React from 'react'
import { RootLayout } from '@payloadcms/next/layouts'
import config from '@payload-config'
import { importMap } from './importMap.js'
import { serverFn } from './server-fn'
import '@payloadcms/next/css'
export { metadata } from '@payloadcms/next/layouts'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RootLayout
      config={config}
      importMap={importMap}
      serverFunction={serverFn}
    >
      {children}
      {/* Fit the live-preview device frame to the pane.

          Payload's DeviceContainer sets `width: 1440px` inline on the device
          wrapper when a breakpoint is selected, which overflows the ~60% pane
          and gets clipped by `.live-preview-window { overflow: hidden }`.

          We cap the wrapper at the pane width with `!important` (overrides
          inline `width: 1440px`). The iframe inside is `width: 100%`, so it
          shrinks too — its internal viewport becomes the pane width, and the
          `PreviewScaler` inside the iframe scales the 1440-design content
          down to fit.

          Selector: the wrapper is the deviceFrame, which sits two levels above
          the iframe: `iframe -> .iframe-loader__container -> deviceFrame`. So
          we target `__main > div > div` (outerFrame > deviceFrame). */}
      <style>{`
        /* Hide Payload's in-pane live preview entirely — we use a popup window
           instead (see payload/components/open-preview-button.tsx). The editor
           expands to fill the space the pane would have used. */
        .live-preview-window { display: none !important; }
        .collection-edit__main--is-live-previewing { width: 100% !important; }
        .collection-edit__main--is-live-previewing:after { display: none !important; }
      `}</style>
    </RootLayout>
  )
}
