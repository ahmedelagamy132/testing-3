"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useInView, AnimatePresence } from "motion/react"
import {
  Mail,
  Building2,
  MessageSquare,
  User,
  ChevronDown,
  ArrowRight,
  CheckCircle2,
  Send,
} from "lucide-react"
import type { ContactData } from "@/lib/types"

const EASE_FLUID  = [0.32, 0.72, 0, 1] as const
const EASE_SMOOTH = [0.22, 1, 0.36, 1] as const

const DEFAULT_SERVICE_OPTIONS = [
  { value: "",                  label: "Select a service..." },
  { value: "growth-marketing",  label: "Growth & Marketing" },
  { value: "conversion-funnels",label: "Conversion & Funnels" },
  { value: "websites-dev",      label: "Websites & Development" },
  { value: "ecommerce",         label: "E-Commerce" },
  { value: "ai-automation",     label: "AI & Automation" },
  { value: "data-analytics",    label: "Data & Analytics" },
  { value: "full-system",       label: "Full Growth System" },
]

const DEFAULT_TRUST_ITEMS = [
  { stat: "4.8×",    label: "Average ROAS" },
  { stat: "+312%",   label: "Lead Volume" },
  { stat: "14 days", label: "Time to Launch" },
  { stat: "94%",     label: "Client Retention" },
]

const ICON_BY_NAME = { mail: Mail, building: Building2 } as const

const DEFAULT_CONTACT_INFO: { icon: keyof typeof ICON_BY_NAME; label: string }[] = [
  { icon: "mail",      label: "hello@miduva.com" },
  { icon: "building",  label: "Available Worldwide · Remote-First" },
]

function useIsDark() {
  const [isDark, setIsDark] = useState(true)
  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains("dark"))
    check()
    const observer = new MutationObserver(check)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    return () => observer.disconnect()
  }, [])
  return isDark
}

type FormState  = { name: string; email: string; company: string; service: string; message: string }
type FormErrors = Partial<Record<keyof FormState, string>>

const INITIAL_STATE: FormState = { name: "", email: "", company: "", service: "", message: "" }

function validate(v: FormState): FormErrors {
  const e: FormErrors = {}
  if (!v.name.trim())    e.name    = "Name is required"
  if (!v.email.trim())   e.email   = "Email is required"
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) e.email = "Enter a valid email"
  if (!v.service)        e.service = "Please select a service"
  if (!v.message.trim()) e.message = "Message is required"
  else if (v.message.trim().length < 20) e.message = "Please write at least 20 characters"
  return e
}

function inputStyle(isFocused: boolean, isDark: boolean): React.CSSProperties {
  return {
    width: "100%",
    background: isDark ? "rgba(255,255,255,0.04)" : "rgba(15,35,73,0.03)",
    border: isFocused
      ? "1px solid rgba(43,200,183,0.55)"
      : isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid var(--line)",
    borderRadius: 12,
    padding: "13px 16px 13px 42px",
    color: isDark ? "#F0F4FF" : "var(--ink)",
    fontSize: 14,
    fontFamily: "var(--font-jakarta)",
    outline: "none",
    boxShadow: isFocused
      ? "0 0 0 3px rgba(43,200,183,0.12), 0 0 20px rgba(43,200,183,0.07)"
      : "none",
    transition: "border-color 0.22s ease, box-shadow 0.22s ease",
  }
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="mono"
      style={{
        fontSize: 10,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: "var(--teal-500)",
        marginBottom: 7,
      }}
    >
      {children}
    </div>
  )
}

function FieldError({ message }: { message?: string }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          style={{ fontSize: 11, color: "#f87171", margin: "6px 0 0", padding: 0 }}
        >
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  )
}

function ContactInput({
  label, type = "text", value, onChange, onBlur, error, placeholder,
  index, isDark, icon: Icon, isInView,
}: {
  label: string; type?: string; value: string; onChange: (v: string) => void
  onBlur?: () => void; error?: string; placeholder?: string
  index: number; isDark: boolean; icon: React.ElementType; isInView: boolean
}) {
  const [isFocused, setIsFocused] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
      animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 20, filter: "blur(6px)" }}
      transition={{ duration: 0.55, delay: 0.30 + index * 0.08, ease: EASE_FLUID }}
    >
      <FieldLabel>{label}</FieldLabel>
      <div style={{ position: "relative" }}>
        <Icon
          style={{
            position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
            width: 15, height: 15,
            color: isFocused ? "var(--teal-500)" : "rgba(110,133,168,0.7)",
            transition: "color 0.22s ease", pointerEvents: "none",
          }}
          strokeWidth={1.8}
        />
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => { setIsFocused(false); onBlur?.() }}
          style={inputStyle(isFocused, isDark)}
        />
      </div>
      <FieldError message={error} />
    </motion.div>
  )
}

function ContactSelect({
  label, value, onChange, error, options, index, isDark, isInView,
}: {
  label: string; value: string; onChange: (v: string) => void; error?: string
  options: { value: string; label: string }[]; index: number; isDark: boolean; isInView: boolean
}) {
  const [isFocused, setIsFocused] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
      animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 20, filter: "blur(6px)" }}
      transition={{ duration: 0.55, delay: 0.30 + index * 0.08, ease: EASE_FLUID }}
    >
      <FieldLabel>{label}</FieldLabel>
      <div style={{ position: "relative" }}>
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={{
            ...inputStyle(isFocused, isDark),
            appearance: "none",
            WebkitAppearance: "none",
            cursor: "pointer",
          }}
        >
          {options.map(o => (
            <option
              key={o.value}
              value={o.value}
              style={{ background: isDark ? "#060E1E" : "white", color: isDark ? "#F0F4FF" : "var(--ink)" }}
            >
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown
          style={{
            position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
            width: 15, height: 15,
            color: isFocused ? "var(--teal-500)" : "rgba(110,133,168,0.7)",
            transition: "color 0.22s ease", pointerEvents: "none",
          }}
          strokeWidth={1.8}
        />
      </div>
      <FieldError message={error} />
    </motion.div>
  )
}

function ContactTextarea({
  label, value, onChange, onBlur, error, placeholder, index, isDark, isInView,
}: {
  label: string; value: string; onChange: (v: string) => void
  onBlur?: () => void; error?: string; placeholder?: string
  index: number; isDark: boolean; isInView: boolean
}) {
  const [isFocused, setIsFocused] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
      animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 20, filter: "blur(6px)" }}
      transition={{ duration: 0.55, delay: 0.30 + index * 0.08, ease: EASE_FLUID }}
    >
      <FieldLabel>{label}</FieldLabel>
      <div style={{ position: "relative" }}>
        <MessageSquare
          style={{
            position: "absolute", left: 14, top: 14,
            width: 15, height: 15,
            color: isFocused ? "var(--teal-500)" : "rgba(110,133,168,0.7)",
            transition: "color 0.22s ease", pointerEvents: "none",
          }}
          strokeWidth={1.8}
        />
        <textarea
          value={value}
          rows={5}
          placeholder={placeholder}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => { setIsFocused(false); onBlur?.() }}
          style={{
            ...inputStyle(isFocused, isDark),
            padding: "13px 16px 13px 42px",
            resize: "none",
            lineHeight: 1.6,
          }}
        />
      </div>
      <FieldError message={error} />
    </motion.div>
  )
}

function SuccessState({ isDark, onReset }: { isDark: boolean; onReset: () => void }) {
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
        Message Sent.
      </motion.h3>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35, ease: EASE_SMOOTH }}
        style={{ fontSize: 15, color: "var(--muted)", margin: 0, maxWidth: 320, lineHeight: 1.6 }}
      >
        We&apos;ll be in touch within 24 hours with a tailored plan — not a sales pitch.
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
        Send another message
      </motion.button>
    </motion.div>
  )
}

export default function ContactSection({ data }: { data?: ContactData } = {}) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView   = useInView(sectionRef, { once: true, margin: "-80px" })
  const isDark     = useIsDark()

  const eyebrow         = data?.eyebrow         ?? "/ get in touch"
  const headline        = data?.headline        ?? "Let's build something"
  const headlineAccent  = data?.headlineAccent  ?? "that actually works."
  const body            = data?.body            ?? "Tell us about your business. We'll review your situation and respond with a tailored plan — not a sales pitch."
  const contactInfo     = data?.contactInfo?.length ? data.contactInfo : DEFAULT_CONTACT_INFO
  const trustStats      = data?.trustStats?.length  ? data.trustStats  : DEFAULT_TRUST_ITEMS
  const formHeadline    = data?.formHeadline    ?? "Start the conversation"
  const formSubheadline = data?.formSubheadline ?? "We respond within 24 hours · No spam, ever"
  const serviceOptions  = data?.serviceOptions?.length
    ? [{ value: "", label: "Select a service..." }, ...data.serviceOptions]
    : DEFAULT_SERVICE_OPTIONS
  const submitLabel     = data?.submitLabel     ?? "Send Message"
  const finePrint       = data?.finePrint       ?? "No commitment · No credit card · 100% Confidential"

  const [values,    setValues]    = useState<FormState>(INITIAL_STATE)
  const [errors,    setErrors]    = useState<FormErrors>({})
  const [touched,   setTouched]   = useState<Partial<Record<keyof FormState, boolean>>>({})
  const [submitting,setSubmitting] = useState(false)
  const [submitted, setSubmitted]  = useState(false)

  const touch = (field: keyof FormState) => {
    const next = { ...touched, [field]: true }
    setTouched(next)
    setErrors(validate(values))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const allTouched = Object.fromEntries(Object.keys(values).map(k => [k, true]))
    setTouched(allTouched as typeof touched)
    const errs = validate(values)
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 1200))
    setSubmitting(false)
    setSubmitted(true)
  }

  const reset = () => { setSubmitted(false); setValues(INITIAL_STATE); setTouched({}); setErrors({}) }

  return (
    <section
      id="contact"
      className="grain"
      style={{
        background: isDark ? "#02060F" : "var(--paper)",
        position: "relative",
        overflow: "hidden",
      }}
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

      {/* Grid overlay */}
      <div
        aria-hidden
        style={{
          position: "absolute", inset: 0,
          backgroundImage: `linear-gradient(rgba(43,200,183,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(43,200,183,0.04) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
          pointerEvents: "none",
        }}
      />

      {/* Left radial orb */}
      <div
        aria-hidden
        style={{
          position: "absolute", top: "15%", left: "-8%",
          width: 600, height: 600, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(43,200,183,0.08) 0%, transparent 60%)",
          filter: "blur(80px)", pointerEvents: "none",
        }}
      />

      {/* Right radial orb */}
      <div
        aria-hidden
        style={{
          position: "absolute", bottom: "8%", right: "-6%",
          width: 500, height: 500, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(43,200,183,0.05) 0%, transparent 60%)",
          filter: "blur(70px)", pointerEvents: "none",
        }}
      />

      {/* Content */}
      <div
        ref={sectionRef}
        style={{
          position: "relative", zIndex: 10,
          maxWidth: 1200, margin: "0 auto",
          padding: "clamp(80px, 10vw, 140px) clamp(24px, 5vw, 48px)",
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: "clamp(40px, 6vw, 96px)", alignItems: "center" }}>

          {/* ── LEFT COLUMN ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>

            {/* Eyebrow */}
            <motion.div
              className="mono"
              style={{ fontSize: 13, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--teal-500)" }}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ duration: 0.5, ease: EASE_SMOOTH }}
            >
              {eyebrow}
            </motion.div>

            {/* Headline */}
            <motion.h2
              style={{
                fontSize: "clamp(36px, 5vw, 60px)", fontWeight: 800,
                letterSpacing: "-0.04em", lineHeight: 1.08,
                color: isDark ? "white" : "var(--ink)", margin: 0,
              }}
              initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
              animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 40, filter: "blur(8px)" }}
              transition={{ duration: 0.7, delay: 0.1, ease: EASE_FLUID }}
            >
              {headline}<br />
              <span className="shine">{headlineAccent}</span>
            </motion.h2>

            {/* Body */}
            <motion.p
              style={{
                fontSize: "clamp(15px, 1.4vw, 17px)", lineHeight: 1.65,
                color: "var(--muted)", maxWidth: 440, margin: 0,
              }}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              transition={{ duration: 0.55, delay: 0.22, ease: EASE_SMOOTH }}
            >
              {body}
            </motion.p>

            {/* Contact info */}
            <motion.div
              style={{ display: "flex", flexDirection: "column", gap: 14 }}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.32, ease: EASE_SMOOTH }}
            >
              {contactInfo.map(({ icon, label }) => {
                const Icon = ICON_BY_NAME[icon] ?? Mail
                return (
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                      background: isDark ? "rgba(43,200,183,0.10)" : "rgba(43,200,183,0.07)",
                      border: `1px solid rgba(43,200,183,${isDark ? "0.20" : "0.15"})`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Icon style={{ width: 16, height: 16, color: "var(--teal-500)" }} strokeWidth={1.5} />
                    </div>
                    <span style={{ fontSize: 14, color: isDark ? "rgba(255,255,255,0.60)" : "var(--muted)" }}>
                      {label}
                    </span>
                  </div>
                )
              })}
            </motion.div>

            {/* KPI mini-grid */}
            <motion.div
              className="grid grid-cols-2"
              style={{ gap: 12 }}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              transition={{ duration: 0.55, delay: 0.44, ease: EASE_SMOOTH }}
            >
              {trustStats.map(({ stat, label }) => (
                <div
                  key={label}
                  style={{
                    padding: "16px 20px", borderRadius: 16,
                    background: isDark ? "rgba(255,255,255,0.03)" : "var(--chip)",
                    border: isDark ? "1px solid rgba(255,255,255,0.07)" : "1px solid var(--line)",
                  }}
                >
                  <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.04em", color: isDark ? "white" : "var(--ink)" }}>
                    {stat}
                  </div>
                  <div className="mono" style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--muted)", marginTop: 4 }}>
                    {label}
                  </div>
                </div>
              ))}
            </motion.div>

          </div>

          {/* ── RIGHT COLUMN — Form Card ── */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.96, filter: "blur(8px)" }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" } : { opacity: 0, y: 60, scale: 0.96, filter: "blur(8px)" }}
            transition={{ duration: 0.8, delay: 0.2, ease: EASE_FLUID }}
            style={{}}
          >
            {/* Double-bezel outer */}
            <div style={{
              padding: 5, borderRadius: "2rem",
              background: isDark ? "rgba(255,255,255,0.03)" : "rgba(15,35,73,0.04)",
              boxShadow: isDark ? "0 0 0 1px rgba(255,255,255,0.08)" : "0 0 0 1px var(--line)",
            }}>
              {/* Inner core */}
              <div style={{
                borderRadius: "calc(2rem - 5px)", overflow: "hidden",
                background: isDark ? "#060E1E" : "white",
                boxShadow: isDark
                  ? "inset 0 1px 1px rgba(255,255,255,0.06)"
                  : "inset 0 1px 1px rgba(15,35,73,0.04)",
                padding: "clamp(28px, 4vw, 44px)",
                position: "relative",
                minHeight: "clamp(500px, 60vh, 700px)",
                display: "flex", flexDirection: "column", justifyContent: "center",
              }}>
                {/* Inner teal orb */}
                <div aria-hidden style={{
                  position: "absolute", top: -40, right: -40,
                  width: 200, height: 200, borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(43,200,183,0.10) 0%, transparent 70%)",
                  filter: "blur(40px)", pointerEvents: "none",
                }} />

                <AnimatePresence mode="wait">
                  {submitted ? (
                    <SuccessState key="success" isDark={isDark} onReset={reset} />
                  ) : (
                    <motion.form
                      key="form"
                      onSubmit={handleSubmit}
                      noValidate
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0, filter: "blur(4px)" }}
                      transition={{ duration: 0.3 }}
                      style={{ display: "flex", flexDirection: "column", gap: 0 }}
                    >
                      {/* Card header */}
                      <motion.div
                        style={{ marginBottom: 28 }}
                        initial={{ opacity: 0, y: 16 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                        transition={{ duration: 0.5, delay: 0.35, ease: EASE_SMOOTH }}
                      >
                        <h3 style={{
                          fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em",
                          color: isDark ? "white" : "var(--ink)", margin: "0 0 6px",
                        }}>
                          {formHeadline}
                        </h3>
                        <p style={{ fontSize: 13, color: "var(--muted)", margin: 0 }}>
                          {formSubheadline}
                        </p>
                      </motion.div>

                      {/* Name + Email row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 14, marginBottom: 14 }}>
                        <ContactInput
                          label="Full Name" value={values.name} icon={User} index={0}
                          isDark={isDark} isInView={isInView} placeholder="Ahmed Elagamy"
                          onChange={v => setValues(p => ({ ...p, name: v }))}
                          onBlur={() => touch("name")}
                          error={touched.name ? errors.name : undefined}
                        />
                        <ContactInput
                          label="Email Address" type="email" value={values.email} icon={Mail} index={1}
                          isDark={isDark} isInView={isInView} placeholder="ahmed@company.com"
                          onChange={v => setValues(p => ({ ...p, email: v }))}
                          onBlur={() => touch("email")}
                          error={touched.email ? errors.email : undefined}
                        />
                      </div>

                      {/* Company */}
                      <div style={{ marginBottom: 14 }}>
                        <ContactInput
                          label="Company (Optional)" value={values.company} icon={Building2} index={2}
                          isDark={isDark} isInView={isInView} placeholder="Miduva Inc."
                          onChange={v => setValues(p => ({ ...p, company: v }))}
                        />
                      </div>

                      {/* Service select */}
                      <div style={{ marginBottom: 14 }}>
                        <ContactSelect
                          label="Service Interest" value={values.service}
                          options={serviceOptions} index={3}
                          isDark={isDark} isInView={isInView}
                          onChange={v => {
                            setValues(p => ({ ...p, service: v }))
                            setTouched(p => ({ ...p, service: true }))
                            setErrors(validate({ ...values, service: v }))
                          }}
                          error={touched.service ? errors.service : undefined}
                        />
                      </div>

                      {/* Message */}
                      <div style={{ marginBottom: 26 }}>
                        <ContactTextarea
                          label="Your Message" value={values.message} index={4}
                          isDark={isDark} isInView={isInView}
                          placeholder="Tell us about your business, your goals, and where you're at right now..."
                          onChange={v => setValues(p => ({ ...p, message: v }))}
                          onBlur={() => touch("message")}
                          error={touched.message ? errors.message : undefined}
                        />
                      </div>

                      {/* Submit */}
                      <motion.button
                        type="submit"
                        disabled={submitting}
                        className="btn-primary"
                        style={{
                          width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
                          gap: 10, padding: "15px 28px", borderRadius: 14, fontSize: 15, fontWeight: 700,
                          letterSpacing: "-0.02em", border: "none",
                          cursor: submitting ? "wait" : "pointer",
                          opacity: submitting ? 0.75 : 1,
                          position: "relative", overflow: "hidden",
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ type: "spring", stiffness: 280, damping: 20 }}
                      >
                        {/* Shimmer sweep */}
                        <motion.div
                          aria-hidden
                          style={{
                            position: "absolute", inset: 0,
                            background: "linear-gradient(90deg, transparent 20%, rgba(255,255,255,0.10) 50%, transparent 80%)",
                            backgroundSize: "200% 100%",
                            pointerEvents: "none",
                          }}
                          animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
                          transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
                        />

                        {submitting ? (
                          <>
                            <motion.div
                              style={{ width: 18, height: 18 }}
                              animate={{ rotate: 360 }}
                              transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                            >
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: 18, height: 18 }}>
                                <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                              </svg>
                            </motion.div>
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send style={{ width: 16, height: 16 }} strokeWidth={2} />
                            {submitLabel}
                            <ArrowRight style={{ width: 15, height: 15 }} strokeWidth={2.5} />
                          </>
                        )}
                      </motion.button>

                      {/* Fine print */}
                      <motion.p
                        className="mono"
                        style={{
                          fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase",
                          color: isDark ? "rgba(255,255,255,0.18)" : "rgba(15,35,73,0.25)",
                          textAlign: "center", marginTop: 14, marginBottom: 0,
                        }}
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ duration: 0.5, delay: 0.7 }}
                      >
                        {finePrint}
                      </motion.p>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
