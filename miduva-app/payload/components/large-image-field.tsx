'use client'

import { useEffect, useState } from 'react'
import { useField, useListDrawer, useDocumentDrawer, useConfig } from '@payloadcms/ui'
import './large-image-field.scss'

type MediaDoc = {
  id: number | string
  url?: string | null
  alt?: string | null
  filename?: string | null
  mimeType?: string | null
  width?: number | null
  height?: number | null
  filesize?: number | null
}

type FieldValue = number | string | null | undefined

type Props = {
  path: string
  field?: { label?: string; required?: boolean }
}

const fmtBytes = (n?: number | null) => {
  if (!n || n <= 0) return null
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`
  return `${(n / (1024 * 1024)).toFixed(1)} MB`
}

export function LargeImageField({ path, field }: Props) {
  const { value, setValue } = useField<FieldValue>({ path })
  const { config } = useConfig()
  const serverURL = config.serverURL ?? ''

  const [doc, setDoc] = useState<MediaDoc | null>(null)
  const [loading, setLoading] = useState(false)

  const [ListDrawer, , { openDrawer: openList }] = useListDrawer({
    collectionSlugs: ['media'],
    uploads: true,
  })

  const [DocDrawer, , { openDrawer: openEdit }] = useDocumentDrawer({
    collectionSlug: 'media',
    // useDocumentDrawer types id as number | null; Payload accepts string ids too at runtime.
    id: (value ?? null) as number | null,
  })

  useEffect(() => {
    if (!value) {
      setDoc(null)
      return
    }
    let cancelled = false
    setLoading(true)
    fetch(`${serverURL}/api/media/${value}?depth=0`, { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d: MediaDoc | null) => {
        if (!cancelled) setDoc(d)
      })
      .catch(() => {
        if (!cancelled) setDoc(null)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [value, serverURL])

  const label = field?.label ?? path
  const required = field?.required
  const previewUrl = doc?.url ? (doc.url.startsWith('http') ? doc.url : `${serverURL}${doc.url}`) : null
  const dims = doc?.width && doc?.height ? `${doc.width} × ${doc.height}` : null

  return (
    <div className="lif">
      <div className="lif__header">
        <span className="lif__label">
          {label}
          {required ? <span className="lif__required"> *</span> : null}
        </span>
        {doc ? (
          <span className="lif__meta">
            {dims}
            {dims && doc.filesize ? <span className="lif__sep">·</span> : null}
            {fmtBytes(doc.filesize)}
          </span>
        ) : null}
      </div>

      <div className="lif__frame" data-empty={!previewUrl}>
        {previewUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewUrl} alt={doc?.alt ?? ''} className="lif__img" />
            <div className="lif__overlay">
              <button type="button" className="lif__btn lif__btn--primary" onClick={openList}>
                Replace
              </button>
              <button type="button" className="lif__btn" onClick={openEdit}>
                Edit
              </button>
              <button
                type="button"
                className="lif__btn lif__btn--danger"
                onClick={() => setValue(null)}
              >
                Remove
              </button>
            </div>
          </>
        ) : (
          <button type="button" className="lif__empty" onClick={openList}>
            <span className="lif__empty-icon" aria-hidden>
              ＋
            </span>
            <span className="lif__empty-label">
              {loading ? 'Loading…' : 'Choose an image'}
            </span>
            <span className="lif__empty-hint">Click to open the media library</span>
          </button>
        )}
      </div>

      {doc?.filename ? (
        <div className="lif__filename" title={doc.filename}>
          {doc.filename}
        </div>
      ) : null}

      <ListDrawer
        onSelect={({ doc: picked }) => {
          if (picked?.id != null) setValue(picked.id as number | string)
        }}
      />
      {value ? <DocDrawer /> : null}
    </div>
  )
}
