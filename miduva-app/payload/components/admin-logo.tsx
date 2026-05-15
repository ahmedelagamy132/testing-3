import React from 'react'
import './admin-logo.scss'

/** Renders nothing — removes the icon from the admin breadcrumb/nav area. */
export function AdminIcon() {
  return null
}

export function AdminLogo() {
  return (
    <span style={{ display: 'contents' }}>
      {/* shown in dark theme (default) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/miduva-logo-white.png"
        alt="Miduva"
        className="admin-logo admin-logo--white"
      />
      {/* shown in light theme */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/miduva-logo.png"
        alt=""
        aria-hidden
        className="admin-logo admin-logo--dark"
      />
    </span>
  )
}
