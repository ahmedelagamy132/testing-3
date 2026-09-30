import Link from "next/link"
import Image from "next/image"
import type { ReactNode } from "react"

export function LegalPage({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: "var(--paper)", color: "var(--ink)" }}>
      <header className="mx-auto flex max-w-3xl items-center justify-between px-4 py-6 sm:px-6">
        <Link href="/" aria-label="Miduva home">
          <Image src="/assets/miduva-logo-white.png" alt="Miduva" width={140} height={30} priority />
        </Link>
        <Link href="/#contact" className="text-sm font-semibold" style={{ color: "var(--teal-500)" }}>
          Contact us
        </Link>
      </header>

      <main className="mx-auto max-w-3xl px-4 pb-20 pt-8 sm:px-6">
        <p className="font-mono text-xs uppercase tracking-widest" style={{ color: "var(--teal-500)" }}>/ legal</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">{title}</h1>
        <p className="mt-3 text-sm" style={{ color: "var(--muted)" }}>Last updated {updated}</p>
        <article className="legal-prose mt-10">{children}</article>
      </main>

      <footer className="border-t" style={{ borderColor: "var(--line)" }}>
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-4 px-4 py-6 text-xs sm:px-6" style={{ color: "var(--muted)" }}>
          <span>© {new Date().getFullYear()} Miduva</span>
          <nav className="flex gap-5">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/">Home</Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
