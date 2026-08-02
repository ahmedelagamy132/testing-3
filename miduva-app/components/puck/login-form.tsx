"use client"

import { FormEvent, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"

export function PuckLoginForm({ configured }: { configured: boolean }) {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError("")
    try {
      const response = await fetch("/api/puck/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })
      const result = (await response.json()) as { error?: string }
      if (!response.ok) throw new Error(result.error || "Could not sign in")
      router.replace("/admin")
      router.refresh()
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not sign in")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="puck-login-card" onSubmit={submit}>
      <Image
        alt="Miduva"
        className="puck-login-logo"
        height={39}
        priority
        src="/assets/miduva-logo-white.png"
        width={182}
      />
      <p className="puck-login-eyebrow">Secure publishing console</p>
      <h1>Miduva Editor</h1>
      <p className="puck-login-copy">Sign in to edit drafts, manage media, review revisions, and publish the public site.</p>
      <label>
        <span>Admin password</span>
        <span className="puck-password-field">
          <input
            autoComplete="current-password"
            autoFocus
            disabled={!configured || loading}
            onChange={(event) => setPassword(event.currentTarget.value)}
            required
            type={showPassword ? "text" : "password"}
            value={password}
          />
          <button
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            className="puck-password-toggle"
            disabled={!configured || loading}
            onClick={() => setShowPassword((visible) => !visible)}
            type="button"
          >
            {showPassword ? (
              <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
                <path d="m3 3 18 18M10.6 10.7a2 2 0 0 0 2.7 2.7M9.9 4.2A10.8 10.8 0 0 1 12 4c5.2 0 8.5 4.5 9.3 5.8a4 4 0 0 1 0 4.4 16 16 0 0 1-2 2.6M6.6 6.7a16.3 16.3 0 0 0-3.9 3.1 4 4 0 0 0 0 4.4C3.5 15.5 6.8 20 12 20c1.1 0 2.1-.2 3-.5" />
              </svg>
            ) : (
              <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
                <path d="M2.7 9.8a4 4 0 0 0 0 4.4C3.5 15.5 6.8 20 12 20s8.5-4.5 9.3-5.8a4 4 0 0 0 0-4.4C20.5 8.5 17.2 4 12 4S3.5 8.5 2.7 9.8Z" /><circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </span>
      </label>
      {!configured ? (
        <p className="puck-login-error" role="alert">Set a PUCK_ADMIN_PASSWORD of at least 16 characters and a PUCK_SESSION_SECRET of at least 32 characters.</p>
      ) : null}
      {error ? <p className="puck-login-error" role="alert">{error}</p> : null}
      <button disabled={!configured || loading} type="submit">{loading ? "Signing in…" : "Open editor"}</button>
    </form>
  )
}
