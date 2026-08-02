"use client"
/* eslint-disable @next/next/no-img-element -- Editor thumbnails must support arbitrary validated media URLs without Next image host configuration. */

import { useRef, useState } from "react"
import { FieldLabel } from "@puckeditor/core"
import type { CustomFieldRender } from "@puckeditor/core"
import type { PuckMedia } from "@/lib/puck/types"

export const MediaField: CustomFieldRender<string> = ({ field, value, onChange, readOnly }) => {
  const [open, setOpen] = useState(false)
  const [media, setMedia] = useState<PuckMedia[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  async function toggleLibrary() {
    const nextOpen = !open
    setOpen(nextOpen)
    if (!nextOpen || media.length) return
    setLoading(true)
    setError("")
    try {
      const response = await fetch("/api/puck/media")
      const result = (await response.json()) as { media?: PuckMedia[]; error?: string }
      if (!response.ok || !result.media) throw new Error(result.error || "Could not load the media library")
      setMedia(result.media)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not load the media library")
    } finally {
      setLoading(false)
    }
  }

  async function upload(file: File) {
    setLoading(true)
    setError("")
    const form = new FormData()
    form.set("file", file)
    try {
      const response = await fetch("/api/puck/media", { method: "POST", body: form })
      const result = (await response.json()) as { media?: PuckMedia; error?: string }
      if (!response.ok || !result.media) throw new Error(result.error || "Upload failed")
      setMedia((current) => [result.media!, ...current])
      onChange(result.media.url)
      setOpen(true)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Upload failed")
    } finally {
      setLoading(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  return (
    <FieldLabel label={field.label || "Image"} readOnly={readOnly}>
      <div className="miduva-media-field">
        <input
          className="miduva-media-field__url"
          type="url"
          value={value || ""}
          onChange={(event) => onChange(event.currentTarget.value)}
          placeholder="/assets/image.jpg or https://…"
          disabled={readOnly}
        />
        {value ? <img className="miduva-media-field__preview" src={value} alt="Selected media preview" /> : null}
        <div className="miduva-media-field__actions">
          <button type="button" onClick={() => void toggleLibrary()} disabled={readOnly}>
            {open ? "Close library" : "Choose media"}
          </button>
          <label aria-disabled={readOnly || loading}>
            Upload image
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              disabled={readOnly || loading}
              onChange={(event) => {
                const file = event.currentTarget.files?.[0]
                if (file) void upload(file)
              }}
            />
          </label>
        </div>
        {error ? <p className="miduva-media-field__error" role="alert">{error}</p> : null}
        {open ? (
          <div className="miduva-media-field__library" aria-busy={loading}>
            {loading && !media.length ? <p>Loading media…</p> : null}
            {media.map((item) => (
              <button
                type="button"
                key={`${item.source}-${item.id}`}
                className={item.url === value ? "is-selected" : ""}
                title={item.originalName}
                onClick={() => onChange(item.url)}
              >
                <img src={item.url} alt="" loading="lazy" />
                <span>{item.originalName}</span>
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </FieldLabel>
  )
}
