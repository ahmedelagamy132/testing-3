const brands = ["ARVO", "NOVAE", "KILO&CO", "HELIX", "PARTTWO", "LUMEN"]

export default function TrustedLogos() {
  return (
    <div className="mt-16 md:mt-20 max-w-6xl mx-auto px-6 pb-20">
      <div className="dashed-sep h-px w-full mb-8" />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">
          Trusted by operators at
        </div>
        <div className="flex flex-wrap items-center gap-x-10 gap-y-4 opacity-70">
          {brands.map((n) => (
            <span key={n} className="font-extrabold tracking-[0.12em] text-[15px] text-[var(--navy-900)]/80">
              {n}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
