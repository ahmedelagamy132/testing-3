"use client"
/* eslint-disable @next/next/no-img-element -- Thumbnails show arbitrary admin-chosen URLs. */

import { createContext, useContext, useEffect, useRef, useState } from "react"
import type { EditorBackend, MediaItem } from "./types"
import { Icon } from "./icons"

export const MediaBackendContext = createContext<Pick<EditorBackend, "listMedia" | "uploadMedia">>({})

function MediaLibrary({ value, onPick, onClose }: { value: string; onPick: (url: string) => void; onClose: () => void }) {
  const { listMedia, uploadMedia } = useContext(MediaBackendContext)
  const [media, setMedia] = useState<MediaItem[] | null>(listMedia ? null : [])
  const [error, setError] = useState("")
  const [query, setQuery] = useState("")
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const closeRef = useRef(onClose)
  useEffect(() => {
    closeRef.current = onClose
  })

  useEffect(() => {
    listMedia?.().then(setMedia, (reason: Error) => setError(reason.message || "Could not load images"))
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && closeRef.current()
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [listMedia])

  async function upload(file: File) {
    if (!uploadMedia) return
    setUploading(true)
    setError("")
    try {
      onPick((await uploadMedia(file)).url)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  const filtered = (media ?? []).filter((item) => !query || `${item.name} ${item.url}`.toLowerCase().includes(query.toLowerCase()))

  return (
    <div className="ve-modal" role="dialog" aria-modal="true" aria-label="Choose an image" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="ve-modal__card">
        <header>
          <strong>Choose an image</strong>
          {listMedia ? <input type="search" placeholder="Search images" value={query} onChange={(event) => setQuery(event.currentTarget.value)} autoFocus /> : null}
          {uploadMedia ? (
            <>
              <button type="button" className="ve-button is-primary" disabled={uploading} onClick={() => fileRef.current?.click()}>
                <Icon name="upload" /> {uploading ? "Uploading…" : "Upload from computer"}
              </button>
              <input ref={fileRef} type="file" hidden accept="image/*" onChange={(event) => {
                const file = event.currentTarget.files?.[0]
                event.currentTarget.value = ""
                if (file) void upload(file)
              }} />
            </>
          ) : null}
          <button type="button" className="ve-icon-button" aria-label="Close" onClick={onClose}><Icon name="close" /></button>
        </header>
        {error ? <p className="ve-error" role="alert">{error}</p> : null}
        <div className="ve-media-grid" aria-busy={!media}>
          {!media && !error ? <p className="ve-muted">Loading images…</p> : null}
          {media && !filtered.length ? <p className="ve-muted">{listMedia ? "No images found." : "Upload an image to use it here."}</p> : null}
          {filtered.map((item) => (
            <button type="button" key={item.url} className={item.url === value ? "is-selected" : ""} title={item.url} onClick={() => onPick(item.url)}>
              <img src={item.url} alt="" loading="lazy" />
              <span>{item.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export function MediaInput({ id, value, onChange }: { id: string; value: string; onChange: (value: string) => void }) {
  const { listMedia, uploadMedia } = useContext(MediaBackendContext)
  const [open, setOpen] = useState(false)
  const hasLibrary = Boolean(listMedia || uploadMedia)
  return (
    <div className="ve-media">
      <button type="button" className="ve-media__thumb" onClick={() => hasLibrary && setOpen(true)} aria-label={hasLibrary ? "Change image" : "Image preview"}>
        {value ? <img src={value} alt="" /> : <Icon name="image" />}
      </button>
      <div className="ve-media__side">
        {hasLibrary ? <button type="button" className="ve-button" onClick={() => setOpen(true)}>{value ? "Replace image" : "Choose image"}</button> : null}
        <input id={id} type="text" value={value} placeholder="Image address" onChange={(event) => onChange(event.currentTarget.value)} aria-label="Image address" />
      </div>
      {open ? <MediaLibrary value={value} onClose={() => setOpen(false)} onPick={(url) => { onChange(url); setOpen(false) }} /> : null}
    </div>
  )
}
