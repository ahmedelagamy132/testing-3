import { existsSync } from "node:fs"
import path from "node:path"
import Image from "next/image"
import { SubscribeForm } from "./subscribe-form"
import styles from "./coming-soon.module.css"

const HAZE_REL = "/coming-soon/atmos-haze.png"

export function ComingSoon() {
  // Re-check on each render so the haze auto-engages once generated, without
  // needing a server restart in dev.
  const HAZE_AVAILABLE = existsSync(path.join(process.cwd(), "public", HAZE_REL))

  return (
    <main className={styles.surface}>
      <div className={styles.floor} aria-hidden="true" />
      <div className={styles.blueprint} aria-hidden="true" />
      <div className={styles.echo} aria-hidden="true" />
      <div className={styles.glow} aria-hidden="true" />

      {/* Atmospheric image layer: haze across the surface + torus on the right.
          Both blend into the dark via masks + screen blending; neither
          intercepts pointer events. */}
      <div className={styles.heroLayer} aria-hidden="true">
        {HAZE_AVAILABLE && (
          <Image
            src={HAZE_REL}
            alt=""
            fill
            priority
            className={styles.haze}
            sizes="100vw"
          />
        )}
        <div className={styles.heroWrap}>
          <Image
            src="/coming-soon/hero-infinity.png"
            alt=""
            fill
            priority
            className={styles.hero}
            sizes="(max-width: 540px) 130vw, (max-width: 1024px) 82vw, 70vw"
          />
        </div>
      </div>

      <div className={styles.grain} aria-hidden="true" />
      <div className={styles.guides} aria-hidden="true" />
      <div className={styles.ticks} aria-hidden="true">
        <span className={`${styles.tick} ${styles.tickTL}`} />
        <span className={`${styles.tick} ${styles.tickTR}`} />
        <span className={`${styles.tick} ${styles.tickBL}`} />
        <span className={`${styles.tick} ${styles.tickBR}`} />
      </div>

      <div className={styles.shell}>
        {/* Head row: machine label + status */}
        <header className={styles.head}>
          <div className={`${styles.label} ${styles.enter} ${styles.enter0}`}>
            <span className={styles.dot} aria-hidden="true" />
            <span>Miduva / V0.NEXT — Calibrating</span>
          </div>
          <div className={`${styles.headTrailing} ${styles.enter} ${styles.enter0}`}>
            Coming soon
          </div>
        </header>

        {/* Main composition */}
        <section className={styles.main} aria-labelledby="cs-heading">
          <div className={`${styles.wordmarkWrap} ${styles.enter} ${styles.enter1}`}>
            <Image
              src="/assets/miduva-logo-white.png"
              alt="Miduva"
              width={520}
              height={120}
              priority
              className={styles.wordmark}
              sizes="(max-width: 540px) 70vw, (max-width: 1024px) 50vw, 520px"
            />
          </div>

          <h1
            id="cs-heading"
            className={`${styles.headline} ${styles.enter} ${styles.enter2}`}
          >
            A new kind of growth agency.{" "}
            <span className={styles.headlineAccent}>Almost</span> ready.
          </h1>

          <div className={styles.formRow}>
            <p className={`${styles.timing} ${styles.enter} ${styles.enter3}`}>
              Launching May 2026
            </p>
            <SubscribeForm />
          </div>
        </section>

        {/* Foot row: contact */}
        <footer className={styles.foot}>
          <div className={`${styles.footLeft} ${styles.enter} ${styles.enter5}`}>
            // Built with care
          </div>
          <a
            href="mailto:business@miduva.com"
            className={`${styles.footLink} ${styles.enter} ${styles.enter5}`}
          >
            business@miduva.com
          </a>
        </footer>
      </div>
    </main>
  )
}
