"use client"

import type { CSSProperties } from "react"
import { openConsentSettings } from "@/lib/consent"

export function CookieSettingsButton({ className, style, label = "Cookie settings" }: { className?: string; style?: CSSProperties; label?: string }) {
  return (
    <button type="button" onClick={openConsentSettings} className={className} style={style}>
      {label}
    </button>
  )
}
