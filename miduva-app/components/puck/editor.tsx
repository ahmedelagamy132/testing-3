"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Puck } from "@puckeditor/core"
import { landingPageConfig } from "@/lib/puck/config"
import type { LandingPagePuckData, PuckPageDocument, PuckRevision } from "@/lib/puck/types"

type SaveState = "saved" | "saving" | "publishing" | "error"

export function LandingPageEditor({ initialDocument }: { initialDocument: PuckPageDocument }) {
  const [data, setData] = useState(initialDocument.draft)
  const [editorKey, setEditorKey] = useState(0)
  const [saveState, setSaveState] = useState<SaveState>("saved")
  const [message, setMessage] = useState(initialDocument.draftUpdatedAt ? "Draft loaded" : "Using built-in defaults")
  const [revisions, setRevisions] = useState<PuckRevision[]>([])
  const [showRevisions, setShowRevisions] = useState(false)
  const [loadingRevisions, setLoadingRevisions] = useState(false)
  const versionRef = useRef(initialDocument.version)
  const latestDataRef = useRef(initialDocument.draft)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const queueRef = useRef<Promise<void>>(Promise.resolve())
  const conflictRef = useRef(false)

  const request = useCallback(async (method: "PUT" | "POST", nextData: LandingPagePuckData) => {
    if (conflictRef.current) throw new Error("Reload the editor to resolve the version conflict.")
    setSaveState(method === "POST" ? "publishing" : "saving")
    const response = await fetch("/api/puck/page", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: nextData, version: versionRef.current }),
    })
    const result = (await response.json()) as PuckPageDocument & { error?: string }
    if (!response.ok) {
      if (response.status === 409) conflictRef.current = true
      throw new Error(result.error || "The page could not be saved.")
    }
    versionRef.current = result.version
    setSaveState("saved")
    setMessage(method === "POST" ? "Published to both public routes" : "Draft saved")
  }, [])

  const enqueueDraft = useCallback((nextData: LandingPagePuckData) => {
    queueRef.current = queueRef.current
      .catch(() => undefined)
      .then(() => request("PUT", nextData))
      .catch((reason: Error) => {
        setSaveState("error")
        setMessage(reason.message)
      })
  }, [request])

  function handleChange(nextData: LandingPagePuckData) {
    latestDataRef.current = nextData
    setData(nextData)
    setMessage("Unsaved changes")
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => enqueueDraft(latestDataRef.current), 800)
  }

  async function handlePublish(nextData: LandingPagePuckData) {
    latestDataRef.current = nextData
    if (timerRef.current) clearTimeout(timerRef.current)
    await queueRef.current.catch(() => undefined)
    try {
      await request("POST", nextData)
      await loadRevisions()
    } catch (reason) {
      setSaveState("error")
      setMessage(reason instanceof Error ? reason.message : "Publish failed")
    }
  }

  async function loadRevisions() {
    setLoadingRevisions(true)
    try {
      const response = await fetch("/api/puck/revisions", { cache: "no-store" })
      const result = (await response.json()) as PuckRevision[] | { error: string }
      if (!response.ok || !Array.isArray(result)) throw new Error("error" in result ? result.error : "Could not load revisions")
      setRevisions(result)
    } catch (reason) {
      setSaveState("error")
      setMessage(reason instanceof Error ? reason.message : "Could not load revisions")
    } finally {
      setLoadingRevisions(false)
    }
  }

  async function toggleRevisions() {
    const next = !showRevisions
    setShowRevisions(next)
    if (next) await loadRevisions()
  }

  async function restoreRevision(id: number) {
    if (timerRef.current) clearTimeout(timerRef.current)
    await queueRef.current.catch(() => undefined)
    setSaveState("saving")
    try {
      const response = await fetch("/api/puck/revisions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, version: versionRef.current }),
      })
      const result = (await response.json()) as PuckPageDocument & { error?: string }
      if (!response.ok) throw new Error(result.error || "Could not restore revision")
      versionRef.current = result.version
      latestDataRef.current = result.draft
      setData(result.draft)
      setEditorKey((current) => current + 1)
      setSaveState("saved")
      setMessage("Revision restored to draft — publish when ready")
      setShowRevisions(false)
    } catch (reason) {
      setSaveState("error")
      setMessage(reason instanceof Error ? reason.message : "Could not restore revision")
    }
  }

  async function logout() {
    await fetch("/api/puck/auth/logout", { method: "POST" })
    window.location.assign("/admin/login")
  }

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current)
  }, [])

  return (
    <div className="puck-admin-shell">
      <header className="puck-admin-bar">
        <div>
          <span className={`puck-save-dot is-${saveState}`} />
          <strong>{message}</strong>
        </div>
        <nav aria-label="Editor actions">
          <a href="/" target="_blank" rel="noreferrer">View live</a>
          <button type="button" onClick={() => void toggleRevisions()}>{showRevisions ? "Close revisions" : "Revisions"}</button>
          <button type="button" onClick={() => void logout()}>Sign out</button>
        </nav>
      </header>
      {showRevisions ? (
        <aside className="puck-revisions" aria-label="Published revisions">
          <div>
            <p>Published history</p>
            <span>Restore creates a draft. Nothing goes live until you publish.</span>
          </div>
          {loadingRevisions ? <p>Loading…</p> : null}
          {!loadingRevisions && revisions.length === 0 ? <p>No published revisions yet.</p> : null}
          <ul>
            {revisions.map((revision) => (
              <li key={revision.id}>
                <time dateTime={revision.createdAt}>{new Date(revision.createdAt).toLocaleString()}</time>
                <button type="button" onClick={() => void restoreRevision(revision.id)}>Restore to draft</button>
              </li>
            ))}
          </ul>
        </aside>
      ) : null}
      <Puck
        key={editorKey}
        config={landingPageConfig}
        data={data}
        headerTitle="Miduva landing page"
        headerPath="/admin"
        height="calc(100vh - 48px)"
        iframe={{ enabled: true, syncHostStyles: true, waitForStyles: true }}
        viewports={[
          { width: 360, label: "Mobile", icon: "Smartphone" },
          { width: 768, label: "Tablet", icon: "Tablet" },
          { width: 1280, label: "Desktop", icon: "Monitor" },
          { width: "100%", label: "Full width", icon: "Monitor" },
        ]}
        onChange={handleChange}
        onPublish={(nextData) => void handlePublish(nextData)}
      />
    </div>
  )
}
