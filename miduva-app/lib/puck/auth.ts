import 'server-only'

import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto'
import { cookies, headers } from 'next/headers'

const SESSION_COOKIE = 'miduva_puck_session'
const SESSION_DURATION_SECONDS = 12 * 60 * 60
const MIN_PASSWORD_LENGTH = 16

function getPassword() {
  return process.env.PUCK_ADMIN_PASSWORD ?? ''
}

function getSecret() {
  return process.env.PUCK_SESSION_SECRET ?? ''
}

export function isPuckAdminConfigured() {
  return getPassword().length >= MIN_PASSWORD_LENGTH && getSecret().length >= 32
}

function constantTimeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left)
  const rightBuffer = Buffer.from(right)
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer)
}

function sign(value: string) {
  return createHmac('sha256', getSecret()).update(value).digest('base64url')
}

function createSessionValue() {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS
  const payload = `${expiresAt}.${randomBytes(24).toString('base64url')}`
  return `${payload}.${sign(payload)}`
}

function verifySessionValue(value: string | undefined) {
  if (!value || !isPuckAdminConfigured()) return false
  const parts = value.split('.')
  if (parts.length !== 3) return false
  const [expiresAt, nonce, signature] = parts
  if (!/^\d+$/.test(expiresAt) || !nonce || Number(expiresAt) <= Math.floor(Date.now() / 1000)) return false
  return constantTimeEqual(signature, sign(`${expiresAt}.${nonce}`))
}

export function verifyPuckAdminPassword(password: unknown) {
  return typeof password === 'string' && isPuckAdminConfigured() && constantTimeEqual(password, getPassword())
}

export async function isPuckAdminAuthenticated() {
  const cookieStore = await cookies()
  return verifySessionValue(cookieStore.get(SESSION_COOKIE)?.value)
}

export async function createPuckAdminSession() {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, createSessionValue(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: SESSION_DURATION_SECONDS,
  })
}

export async function destroyPuckAdminSession() {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  })
}

export async function hasValidMutationOrigin(request: Request) {
  const origin = request.headers.get('origin')
  if (!origin) return false
  const headerStore = await headers()
  const forwardedHost = headerStore.get('x-forwarded-host')
  const host = forwardedHost ?? headerStore.get('host')
  if (!host) return false
  const protocol = headerStore.get('x-forwarded-proto') ?? (process.env.NODE_ENV === 'production' ? 'https' : 'http')
  try {
    return new URL(origin).origin === `${protocol}://${host}`
  } catch {
    return false
  }
}

export async function requirePuckAdmin(request?: Request) {
  if (!(await isPuckAdminAuthenticated())) {
    return Response.json({ error: 'Authentication required.' }, { status: 401 })
  }
  if (request && !(await hasValidMutationOrigin(request))) {
    return Response.json({ error: 'Invalid request origin.' }, { status: 403 })
  }
  return null
}
