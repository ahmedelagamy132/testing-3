"use client"

import { useId, useRef, useState } from "react"
import styles from "./coming-soon.module.css"

type Status = "idle" | "submitting" | "subscribed" | "already" | "invalid" | "error"

const COPY: Record<Exclude<Status, "idle" | "submitting">, string> = {
  subscribed: "Got it. You'll hear from me the moment it's live.",
  already: "You're already on the list. Thanks for the patience.",
  invalid: "That doesn't look like a valid email. Try again.",
  error: "Couldn't save that — try again, or email business@miduva.com.",
}

export function SubscribeForm() {
  const id = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [status, setStatus] = useState<Status>("idle")
  const [email, setEmail] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status === "submitting") return

    const trimmed = email.trim()
    if (!trimmed) {
      setStatus("invalid")
      inputRef.current?.focus()
      return
    }

    setStatus("submitting")
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      })
      const data = (await res.json().catch(() => ({}))) as { status?: Status }
      const next: Status =
        data.status === "subscribed" ||
        data.status === "already" ||
        data.status === "invalid"
          ? data.status
          : "error"
      setStatus(next)
    } catch {
      setStatus("error")
    }
  }

  if (status === "subscribed" || status === "already") {
    return (
      <div className={`${styles.successWrap} ${styles.enter} ${styles.enter4}`}>
        <p className={styles.successSub}>{"// Confirmed"}</p>
        <p className={styles.successHead}>{COPY[status]}</p>
      </div>
    )
  }

  const isSubmitting = status === "submitting"
  const hasError = status === "invalid" || status === "error"

  return (
    <div>
      <form
        className={`${styles.form} ${styles.enter} ${styles.enter4}`}
        onSubmit={handleSubmit}
        noValidate
        aria-describedby={hasError ? `${id}-msg` : undefined}
      >
        <label
          htmlFor={`${id}-email`}
          style={{
            position: "absolute",
            width: 1,
            height: 1,
            padding: 0,
            margin: -1,
            overflow: "hidden",
            clip: "rect(0, 0, 0, 0)",
            whiteSpace: "nowrap",
            border: 0,
          }}
        >
          Email address
        </label>
        <input
          ref={inputRef}
          id={`${id}-email`}
          className={styles.input}
          type="email"
          name="email"
          autoComplete="email"
          inputMode="email"
          placeholder="name@company.com"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (hasError) setStatus("idle")
          }}
          disabled={isSubmitting}
          aria-invalid={hasError || undefined}
        />
        <button
          type="submit"
          className={styles.submit}
          disabled={isSubmitting}
          aria-label={isSubmitting ? "Sending" : "Notify me when Miduva launches"}
        >
          {isSubmitting ? "Sending…" : (
            <>
              Notify me <span className={styles.arrow} aria-hidden="true">→</span>
            </>
          )}
        </button>
      </form>

      <p
        id={`${id}-msg`}
        role={hasError ? "alert" : "status"}
        aria-live={hasError ? "assertive" : "polite"}
        className={`${styles.feedback} ${hasError ? styles.feedbackError : ""}`}
        style={{ marginTop: "0.75rem" }}
      >
        {hasError ? COPY[status as "invalid" | "error"] : " "}
      </p>

    </div>
  )
}
