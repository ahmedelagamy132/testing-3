"use client"

import { useCallback, useRef, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import {
  Mail,
  Building2,
  ArrowRight,
  CheckCircle2,
  Check,
  CalendarCheck,
} from "lucide-react"
import type { ContactData } from "@/lib/types"
import { trackLead } from "@/lib/analytics"
import { useFrameInView, useFrameIsDark } from "@/components/puck/frame-runtime"
import { FormDots, GlobeWireframe } from "@/components/ui/globe-wireframe"
import { BookingModal, safeBookingUrl } from "@/components/booking-modal"

const EASE_FLUID  = [0.32, 0.72, 0, 1] as const
const EASE_SMOOTH = [0.22, 1, 0.36, 1] as const

const ICON_BY_NAME = { mail: Mail, building: Building2 } as const

const DEFAULT_CONTACT_INFO: { icon: keyof typeof ICON_BY_NAME; label: string }[] = [
  { icon: "mail",      label: "hello@miduva.com" },
  { icon: "building",  label: "Available Worldwide · Remote-First" },
]

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MESSAGE_MIN_LENGTH = 20

type FormState  = { name: string; email: string; company: string; service: string; message: string }
type FormErrors = Partial<Record<keyof FormState, string>>
type SubmitStatus = "idle" | "error"

const INITIAL_STATE: FormState = { name: "", email: "", company: "", service: "", message: "" }

type ValidationMessages = {
  nameRequired: string; emailRequired: string; emailInvalid: string
  messageRequired: string; messageTooShort: string
}

function validate(v: FormState, messages: ValidationMessages): FormErrors {
  const e: FormErrors = {}
  if (!v.name.trim())    e.name    = messages.nameRequired
  if (!v.email.trim())   e.email   = messages.emailRequired
  else if (!EMAIL_RE.test(v.email)) e.email = messages.emailInvalid
  if (!v.message.trim()) e.message = messages.messageRequired
  else if (v.message.trim().length < MESSAGE_MIN_LENGTH) e.message = messages.messageTooShort
  return e
}

function controlStyle(isFocused: boolean, hasError: boolean, isDark: boolean): React.CSSProperties {
  return {
    display: "block",
    width: "100%",
    borderRadius: 12,
    padding: "11px 16px",
    fontSize: 14,
    fontFamily: "var(--font-jakarta)",
    color: isDark ? "#F0F4FF" : "var(--ink)",
    outline: "none",
    background: isDark ? "rgba(255,255,255,0.035)" : "rgba(15,35,73,0.025)",
    border: `1px solid ${hasError
      ? "rgba(248,113,113,0.55)"
      : isFocused
        ? "rgba(43,200,183,0.6)"
        : isDark ? "rgba(255,255,255,0.09)" : "rgba(15,35,73,0.10)"}`,
    boxShadow: isFocused
      ? `0 0 0 3px ${hasError ? "rgba(248,113,113,0.10)" : "rgba(43,200,183,0.10)"}`
      : "none",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
  }
}

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label
      htmlFor={htmlFor}
      className="mono"
      style={{
        display: "block",
        fontSize: 10.5,
        fontWeight: 600,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        color: "var(--muted)",
        marginBottom: 8,
      }}
    >
      {children}
    </label>
  )
}

function FieldError({ message }: { message?: string }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          style={{ fontSize: 12, color: "#f87171", margin: 0, padding: "7px 2px 0", overflow: "hidden" }}
        >
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  )
}

function ContactInput({
  id, label, type = "text", value, onChange, onBlur, error, placeholder, isDark, autoComplete,
}: {
  id: string; label: string; type?: string; value: string; onChange: (v: string) => void
  onBlur?: () => void; error?: string; placeholder?: string; isDark: boolean; autoComplete?: string
}) {
  const [isFocused, setIsFocused] = useState(false)
  return (
    <div>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => { setIsFocused(false); onBlur?.() }}
        className="contact-field"
        style={controlStyle(isFocused, !!error, isDark)}
      />
      <FieldError message={error} />
    </div>
  )
}

function ContactTextarea({
  id, label, value, onChange, onBlur, error, placeholder, isDark,
}: {
  id: string; label: string; value: string; onChange: (v: string) => void
  onBlur?: () => void; error?: string; placeholder?: string; isDark: boolean
}) {
  const [isFocused, setIsFocused] = useState(false)
  const length = value.trim().length
  const isEnough = length >= MESSAGE_MIN_LENGTH
  return (
    <div>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <div style={{ position: "relative" }}>
        <textarea
          id={id}
          value={value}
          rows={5}
          placeholder={placeholder}
          aria-invalid={!!error}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => { setIsFocused(false); onBlur?.() }}
          className="contact-field"
          style={{ ...controlStyle(isFocused, !!error, isDark), resize: "none", lineHeight: 1.6, paddingBottom: 26 }}
        />
        <span
          aria-hidden
          className="mono"
          style={{
            position: "absolute", right: 12, bottom: 9,
            display: "inline-flex", alignItems: "center", gap: 4,
            fontSize: 10, letterSpacing: "0.08em",
            color: isEnough ? "var(--teal-500)" : "var(--muted)",
            opacity: length === 0 ? 0 : 1,
            transition: "opacity 0.2s ease, color 0.2s ease",
          }}
        >
          {isEnough
            ? <Check style={{ width: 12, height: 12 }} strokeWidth={2.6} />
            : `${length}/${MESSAGE_MIN_LENGTH}`}
        </span>
      </div>
      <FieldError message={error} />
    </div>
  )
}

function SuccessState({ isDark, onReset, headline, body, resetLabel }: { isDark: boolean; onReset: () => void; headline: string; body: string; resetLabel: string }) {
  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.92, filter: "blur(8px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.96, filter: "blur(4px)" }}
      transition={{ duration: 0.6, ease: EASE_FLUID }}
      style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", gap: 24, padding: "clamp(60px,8vw,100px) 40px",
        textAlign: "center",
      }}
    >
      <div style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
        {/* Pulsing ring */}
        <motion.div
          aria-hidden
          style={{
            position: "absolute", inset: -14, borderRadius: "50%",
            border: "1px solid rgba(43,200,183,0.3)",
          }}
          animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Icon circle */}
        <motion.div
          style={{
            width: 80, height: 80, borderRadius: "50%",
            background: "rgba(43,200,183,0.12)",
            border: "1px solid rgba(43,200,183,0.30)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
        >
          <CheckCircle2 style={{ width: 36, height: 36, color: "var(--teal-500)" }} strokeWidth={1.5} />
        </motion.div>
      </div>

      <motion.h3
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25, ease: EASE_SMOOTH }}
        style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.03em",
          color: isDark ? "white" : "var(--ink)", margin: 0 }}
      >
        {headline}
      </motion.h3>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35, ease: EASE_SMOOTH }}
        style={{ fontSize: 15, color: "var(--muted)", margin: 0, maxWidth: 320, lineHeight: 1.6 }}
      >
        {body}
      </motion.p>

      <motion.button
        onClick={onReset}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        style={{
          background: "none", border: "none", cursor: "pointer",
          fontSize: 13, color: "var(--teal-500)", fontFamily: "var(--font-jakarta)",
          textDecoration: "underline", textUnderlineOffset: 3, padding: 0,
        }}
      >
        {resetLabel}
      </motion.button>
    </motion.div>
  )
}

export default function ContactSection({ data }: { data?: ContactData } = {}) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView   = useFrameInView(sectionRef, { once: true, margin: "-80px" })
  const isDark     = useFrameIsDark()

  const bookingUrl      = safeBookingUrl(data?.bookingUrl)
  const bookingEyebrow  = data?.bookingEyebrow  ?? "/ free offer"
  const bookingHeadline = data?.bookingHeadline ?? "Get a free"
  const bookingAccent   = data?.bookingAccent   ?? "growth strategy."
  const bookingBody     = data?.bookingBody     ?? "A 30-minute call with a strategist. We review your channels, spot the biggest leaks and leave you with a clear plan — whether you work with us or not."
  const bookingCtaLabel = data?.bookingCtaLabel ?? "Book your free call"
  const bookingNote     = data?.bookingNote     ?? "No commitment · No credit card · Just real strategy"
  const [bookingOpen, setBookingOpen] = useState(false)
  const closeBooking = useCallback(() => setBookingOpen(false), [])
  const formRef = useRef<HTMLDivElement>(null)
  const onBook = () => {
    if (bookingUrl) setBookingOpen(true)
    else formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }
  const eyebrow         = data?.eyebrow         ?? "/ get in touch"
  const headline        = data?.headline        ?? "Let's build something"
  const headlineAccent  = data?.headlineAccent  ?? "that actually works."
  const infoHeadline    = data?.infoHeadline    ?? "Talk to a human"
  const infoBody        = data?.infoBody        ?? "Prefer email? Reach us directly — a strategist, not a sales rep, replies within one business day."
  const contactInfo     = data?.contactInfo?.length ? data.contactInfo : DEFAULT_CONTACT_INFO
  const formHeadline    = data?.formHeadline    ?? "Start the conversation"
  const formSubheadline = data?.formSubheadline ?? "We respond within 24 hours · No spam, ever"
  const nameLabel       = data?.nameLabel       ?? "Full Name"
  const namePlaceholder = data?.namePlaceholder ?? "Your name"
  const emailLabel      = data?.emailLabel      ?? "Email Address"
  const emailPlaceholder = data?.emailPlaceholder ?? "you@company.com"
  const companyLabel    = data?.companyLabel    ?? "Company (Optional)"
  const companyPlaceholder = data?.companyPlaceholder ?? "Company name"
  const messageLabel    = data?.messageLabel    ?? "Your Message"
  const messagePlaceholder = data?.messagePlaceholder ?? "Tell us what you need help with..."
  const submitLabel     = data?.submitLabel     ?? "Send Message"
  const submittingLabel = data?.submittingLabel ?? "Sending..."
  const successHeadline = data?.successHeadline ?? "Message Sent."
  const successBody     = data?.successBody ?? "We'll be in touch within 24 hours with a tailored plan — not a sales pitch."
  const resetLabel      = data?.resetLabel ?? "Send another message"
  const errorMessage    = data?.errorMessage ?? "We could not send your message. Please try again."
  const validationMessages: ValidationMessages = {
    nameRequired: data?.nameRequiredMessage ?? "Name is required",
    emailRequired: data?.emailRequiredMessage ?? "Email is required",
    emailInvalid: data?.emailInvalidMessage ?? "Enter a valid email",
    messageRequired: data?.messageRequiredMessage ?? "Message is required",
    messageTooShort: data?.messageTooShortMessage ?? "Please write at least 20 characters",
  }

  const [values,    setValues]    = useState<FormState>(INITIAL_STATE)
  const [errors,    setErrors]    = useState<FormErrors>({})
  const [touched,   setTouched]   = useState<Partial<Record<keyof FormState, boolean>>>({})
  const [submitting,setSubmitting] = useState(false)
  const [submitted, setSubmitted]  = useState(false)
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle")

  const touch = (field: keyof FormState) => {
    setTouched(p => ({ ...p, [field]: true }))
    setErrors(validate(values, validationMessages))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitStatus("idle")
    const allTouched = Object.fromEntries(Object.keys(values).map(k => [k, true]))
    setTouched(allTouched as typeof touched)
    const errs = validate(values, validationMessages)
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setSubmitting(true)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
      const result = (await res.json().catch(() => null)) as { status?: string } | null
      if (!res.ok || result?.status !== "submitted") {
        setSubmitStatus("error")
        return
      }
      setSubmitted(true)
      trackLead("contact-section")
    } catch {
      setSubmitStatus("error")
    } finally {
      setSubmitting(false)
    }
  }

  const reset = () => { setSubmitted(false); setValues(INITIAL_STATE); setTouched({}); setErrors({}); setSubmitStatus("idle") }

  const reveal = (delay: number, y = 20) => ({
    initial: { opacity: 0, y },
    animate: isInView ? { opacity: 1, y: 0 } : { opacity: 0, y },
    transition: { duration: 0.8, delay, ease: EASE_FLUID },
  })

  const sectionBg = isDark ? "#02060F" : "var(--paper)"

  return (
    <section
      id="contact"
      className="grain"
      style={{ background: sectionBg, position: "relative", overflow: "hidden" }}
    >
      {/* Teal top seam */}
      <div
        aria-hidden
        style={{
          position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
          width: "70%", height: 1,
          background: `linear-gradient(90deg, transparent, rgba(43,200,183,${isDark ? "0.45" : "0.35"}), transparent)`,
          pointerEvents: "none",
        }}
      />

      {/* Top glow */}
      <div
        aria-hidden
        style={{
          position: "absolute", top: -260, left: "50%", transform: "translateX(-50%)",
          width: 900, height: 520, borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(43,200,183,0.09) 0%, transparent 65%)",
          filter: "blur(40px)", pointerEvents: "none",
        }}
      />

      <div
        ref={sectionRef}
        className="relative z-10 mx-auto max-w-6xl px-6"
        style={{ paddingTop: "clamp(48px, 6vw, 80px)", paddingBottom: "clamp(72px, 10vw, 128px)" }}
      >
        {/* ── Centered header ── */}
        <div className="mx-auto mb-14 flex max-w-2xl flex-col items-center gap-5 text-center md:mb-16">
          <motion.div
            {...reveal(0, -12)}
            className="mono"
            style={{
              fontSize: 13, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--teal-500)",
            }}
            data-edit-path="eyebrow"
          >
            {eyebrow}
          </motion.div>

          <motion.h2
            {...reveal(0.1)}
            data-edit-path="headline"
            style={{
              fontSize: "clamp(36px, 5.4vw, 64px)", fontWeight: 800,
              letterSpacing: "-0.045em", lineHeight: 1.04,
              color: isDark ? "white" : "var(--ink)", margin: 0,
            }}
          >
            {headline}{" "}
            <span className="shine" data-edit-path="headlineAccent">{headlineAccent}</span>
          </motion.h2>

        </div>

        {/* ── Free strategy call (merged Free Offer). id="cta" keeps older "#cta" buttons landing here. ── */}
        <motion.div
          {...reveal(0.18, 24)}
          id="cta"
          className="relative mx-auto mb-14 max-w-5xl overflow-hidden rounded-[24px] p-px md:mb-16"
          style={{ scrollMarginTop: 110, background: "linear-gradient(135deg, rgba(43,200,183,0.65) 0%, rgba(255,255,255,0.08) 35%, rgba(255,255,255,0.04) 65%, rgba(43,200,183,0.35) 100%)", boxShadow: "0 30px 80px -30px rgba(43,200,183,0.35)" }}
        >
          <div className="relative overflow-hidden rounded-[23px] px-6 py-9 md:px-12 md:py-11" style={{ background: "linear-gradient(140deg, #0B1A34 0%, #060F20 60%, #030812 100%)" }}>
            <div aria-hidden className="pointer-events-none absolute -left-24 -top-32 h-[420px] w-[420px] rounded-full" style={{ background: "radial-gradient(circle, rgba(43,200,183,0.2) 0%, transparent 65%)", filter: "blur(60px)" }} />
            <div className="relative grid items-center gap-8 md:grid-cols-12">
              <div className="md:col-span-7">
                <div className="mono mb-3 text-[12px] uppercase tracking-[0.22em] text-[var(--teal-500)]" data-edit-path="bookingEyebrow">{bookingEyebrow}</div>
                <p className="text-[30px] font-extrabold leading-[1.04] tracking-[-0.04em] text-white md:text-[42px]" data-edit-path="bookingHeadline">
                  {bookingHeadline}<br />
                  <span className="shine" data-edit-path="bookingAccent">{bookingAccent}</span>
                </p>
                <p className="mt-4 max-w-[48ch] text-[15px] leading-[1.6] text-white/60" data-edit-path="bookingBody">{bookingBody}</p>
              </div>
              <div className="flex flex-col items-stretch gap-3 md:col-span-5 md:items-end">
                <button type="button" onClick={onBook} className="site-btn site-btn--solid gap-2.5 md:min-w-[250px]" data-edit-path="bookingCtaLabel">
                  <CalendarCheck style={{ width: 17, height: 17 }} strokeWidth={2} />
                  {bookingCtaLabel}
                </button>
                <p className="mono text-center text-[10.5px] uppercase tracking-[0.14em] text-white/45 md:text-right" data-edit-path="bookingNote">{bookingNote}</p>
              </div>
            </div>
          </div>
        </motion.div>
        {bookingOpen && bookingUrl && <BookingModal url={bookingUrl} onClose={closeBooking} />}

        <div className="mx-auto grid max-w-5xl grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-14">
          {/* ── LEFT: direct contact + globe ── */}
          <motion.div {...reveal(0.25, 28)} className="flex flex-col gap-7 lg:pt-6">
            <div className="flex flex-col gap-2">
              <h3
                data-edit-path="infoHeadline"
                style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em", color: isDark ? "white" : "var(--ink)", margin: 0 }}
              >
                {infoHeadline}
              </h3>
              <p
                data-edit-path="infoBody"
                style={{ fontSize: 14.5, lineHeight: 1.6, color: "var(--muted)", maxWidth: 360, margin: 0 }}
              >
                {infoBody}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {contactInfo.map(({ icon, label }, index) => {
                const Icon = ICON_BY_NAME[icon] ?? Mail
                const href = EMAIL_RE.test(label) ? `mailto:${label}` : undefined
                const Row = href ? motion.a : motion.div
                return (
                  <Row
                    key={label}
                    href={href}
                    data-edit-path={`contactInfo.${index}`}
                    initial={{ opacity: 0, x: -12 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 }}
                    transition={{ duration: 0.5, delay: 0.35 + index * 0.1, ease: EASE_SMOOTH }}
                    className="contact-link group flex w-fit items-center gap-3"
                    style={{ fontSize: 14.5, color: isDark ? "rgba(240,244,255,0.72)" : "var(--muted)" }}
                  >
                    <span
                      className="contact-link-icon flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]"
                      style={{
                        background: isDark ? "rgba(255,255,255,0.04)" : "rgba(15,35,73,0.04)",
                        border: `1px solid ${isDark ? "rgba(255,255,255,0.09)" : "rgba(15,35,73,0.10)"}`,
                      }}
                    >
                      <Icon style={{ width: 15, height: 15 }} strokeWidth={1.7} />
                    </span>
                    {label}
                  </Row>
                )
              })}
            </div>

            {/* Globe — top half, fading into the section */}
            <div className="relative h-60 overflow-hidden sm:h-72" style={{ color: "var(--teal-500)" }}>
              <div
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-[18%] h-2/3 w-2/3 -translate-x-1/2 rounded-full"
                style={{ background: "radial-gradient(circle, rgba(43,200,183,0.16), transparent 70%)", filter: "blur(30px)" }}
              />
              <GlobeWireframe className="absolute left-0 top-0" />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2"
                style={{ background: `linear-gradient(to top, ${sectionBg}, transparent)` }}
              />
            </div>
          </motion.div>

          {/* ── RIGHT: form card ── */}
          <motion.div
            ref={formRef}
            {...reveal(0.35, 28)}
            className="relative scroll-mt-28 overflow-hidden rounded-[22px]"
            style={{
              background: isDark ? "#060E1E" : "white",
              border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "var(--line)"}`,
              boxShadow: isDark
                ? "0 40px 80px -30px rgba(0,0,0,0.7), 0 0 60px -20px rgba(43,200,183,0.16), inset 0 1px 0 rgba(255,255,255,0.05)"
                : "0 40px 80px -40px rgba(15,35,73,0.28)",
            }}
          >
            {/* Top hairline highlight */}
            <div aria-hidden style={{
              position: "absolute", top: 0, left: "12%", right: "12%", height: 1,
              background: "linear-gradient(90deg, transparent, rgba(43,200,183,0.6), transparent)",
              pointerEvents: "none",
            }} />

            <div style={{ padding: "clamp(24px, 3.4vw, 36px)" }}>
              <AnimatePresence mode="wait">
                {submitted ? (
                  <SuccessState key="success" isDark={isDark} onReset={reset} headline={successHeadline} body={successBody} resetLabel={resetLabel} />
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    noValidate
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, filter: "blur(4px)" }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-5"
                  >
                    <div>
                      <h3 data-edit-path="formHeadline" style={{
                        fontSize: 20, fontWeight: 800, letterSpacing: "-0.03em",
                        color: isDark ? "white" : "var(--ink)", margin: "0 0 4px",
                      }}>
                        {formHeadline}
                      </h3>
                      <p style={{ fontSize: 13.5, color: "var(--muted)", margin: 0 }} data-edit-path="formSubheadline">
                        {formSubheadline}
                      </p>
                    </div>

                    <FormDots className={isDark ? "text-white/20" : "text-[rgba(15,35,73,0.25)]"} />

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <ContactInput
                        id="contact-name" label={nameLabel} value={values.name}
                        isDark={isDark} placeholder={namePlaceholder} autoComplete="name"
                        onChange={v => setValues(p => ({ ...p, name: v }))}
                        onBlur={() => touch("name")}
                        error={touched.name ? errors.name : undefined}
                      />
                      <ContactInput
                        id="contact-company" label={companyLabel} value={values.company}
                        isDark={isDark} placeholder={companyPlaceholder} autoComplete="organization"
                        onChange={v => setValues(p => ({ ...p, company: v }))}
                      />
                    </div>

                    <ContactInput
                      id="contact-email" label={emailLabel} type="email" value={values.email}
                      isDark={isDark} placeholder={emailPlaceholder} autoComplete="email"
                      onChange={v => setValues(p => ({ ...p, email: v }))}
                      onBlur={() => touch("email")}
                      error={touched.email ? errors.email : undefined}
                    />

                    <ContactTextarea
                      id="contact-message" label={messageLabel} value={values.message}
                      isDark={isDark} placeholder={messagePlaceholder}
                      onChange={v => setValues(p => ({ ...p, message: v }))}
                      onBlur={() => touch("message")}
                      error={touched.message ? errors.message : undefined}
                    />

                    <AnimatePresence>
                      {submitStatus === "error" && (
                        <motion.p
                          role="alert"
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          style={{
                            color: "#f87171", fontSize: 13, lineHeight: 1.5, margin: 0,
                            padding: "10px 14px", borderRadius: 12,
                            background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.22)",
                          }}
                        >
                          {errorMessage}
                        </motion.p>
                      )}
                    </AnimatePresence>

                    <div className="flex justify-end pt-1">
                      <motion.button
                        type="submit"
                        data-edit-path="submitLabel"
                        disabled={submitting}
                        className="btn-primary group inline-flex h-11 shrink-0 items-center gap-2 rounded-xl px-6"
                        style={{
                          fontSize: 14, fontWeight: 700, letterSpacing: "-0.01em", border: "none",
                          fontFamily: "var(--font-jakarta)",
                          cursor: submitting ? "wait" : "pointer",
                          opacity: submitting ? 0.8 : 1,
                          boxShadow: isDark
                            ? "0 10px 26px -10px rgba(43,200,183,0.6), inset 0 1px 0 rgba(255,255,255,0.35)"
                            : "0 10px 26px -12px rgba(15,35,73,0.55), inset 0 1px 0 rgba(255,255,255,0.15)",
                        }}
                        whileTap={{ scale: 0.97 }}
                      >
                        {submitting ? submittingLabel : submitLabel}
                        {submitting ? (
                          <motion.svg
                            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                            style={{ width: 16, height: 16 }}
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                          >
                            <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                          </motion.svg>
                        ) : (
                          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" strokeWidth={2.4} />
                        )}
                      </motion.button>
                    </div>
                    <p style={{ fontSize: 11.5, color: "var(--muted)", margin: 0, lineHeight: 1.5 }}>
                      By sending this form you agree to our{" "}
                      <a href="/privacy" className="underline underline-offset-2 hover:text-[var(--ink)]">Privacy Policy</a>.
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
