import { redirect } from "next/navigation"
import { PuckLoginForm } from "@/components/puck/login-form"
import { isPuckAdminAuthenticated, isPuckAdminConfigured } from "@/lib/puck/auth"

export const dynamic = "force-dynamic"

// Only return to admin pages after signing in (no open redirects).
function safeNext(value?: string) {
  return value && /^\/admin(\/[a-z-]*)?$/.test(value) ? value : "/admin"
}

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const next = safeNext((await searchParams).next)
  if (await isPuckAdminAuthenticated()) redirect(next)
  return <main className="puck-login-page"><PuckLoginForm configured={isPuckAdminConfigured()} next={next} /></main>
}
