import { redirect } from "next/navigation"
import { PuckLoginForm } from "@/components/puck/login-form"
import { isPuckAdminAuthenticated, isPuckAdminConfigured } from "@/lib/puck/auth"

export const dynamic = "force-dynamic"

export default async function AdminLoginPage() {
  if (await isPuckAdminAuthenticated()) redirect("/admin")
  return <main className="puck-login-page"><PuckLoginForm configured={isPuckAdminConfigured()} /></main>
}
