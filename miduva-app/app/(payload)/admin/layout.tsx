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
    </RootLayout>
  )
}
