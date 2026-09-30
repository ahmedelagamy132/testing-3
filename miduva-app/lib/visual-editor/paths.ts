import type { ElementTarget } from './protocol'

export type PathPart = string | number
type UnknownRecord = Record<string, unknown>

function isRecord(value: unknown): value is UnknownRecord {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

export function pathKey(path: PathPart[]) {
  return path.join('.')
}

export function getAt(source: unknown, path: PathPart[]) {
  return path.reduce<unknown>((value, part) => {
    if (Array.isArray(value) && typeof part === 'number') return value[part]
    if (isRecord(value) && typeof part === 'string') return value[part]
    return undefined
  }, source)
}

/** Immutable update that clones only the branch being changed. */
export function setAt<T>(source: T, path: PathPart[], value: unknown): T {
  if (!path.length) return value as T
  const [head, ...rest] = path
  if (Array.isArray(source) && typeof head === 'number') {
    const copy = [...source]
    copy[head] = setAt(copy[head], rest, value)
    return copy as T
  }
  const base: UnknownRecord = isRecord(source) ? source : {}
  return { ...base, [head]: setAt(base[head as string], rest, value) } as T
}

export function parseControlPath(value: unknown) {
  if (typeof value !== 'string' || !value || value.length > 240) return null
  const parts = value.split('.').filter(Boolean).map((part) => (/^\d+$/.test(part) ? Number(part) : part))
  if (!parts.length || parts.length > 10 || parts.some((part) => typeof part === 'string' && ['__proto__', 'prototype', 'constructor'].includes(part))) return null
  return parts
}

// When a clicked element has no explicit control path, match its visible text,
// image or link against the section's values to find the field it came from.

type Leaf = { path: PathPart[]; value: string | number | boolean }

function flattenLeaves(value: unknown, path: PathPart[] = [], leaves: Leaf[] = []) {
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    leaves.push({ path, value })
  } else if (Array.isArray(value)) {
    value.forEach((item, index) => flattenLeaves(item, [...path, index], leaves))
  } else if (isRecord(value)) {
    Object.entries(value).forEach(([key, item]) => {
      if (key !== 'id') flattenLeaves(item, [...path, key], leaves)
    })
  }
  return leaves
}

const normalize = (value: unknown) => String(value ?? '').replace(/\s+/g, ' ').trim().toLowerCase()

function comparableUrl(value: string) {
  try {
    const url = new URL(value, window.location.origin)
    const optimizedSource = url.pathname === '/_next/image' ? url.searchParams.get('url') : null
    if (optimizedSource) return comparableUrl(decodeURIComponent(optimizedSource))
    return `${url.pathname}${url.search}`
  } catch {
    return value
  }
}

function scoreLeaf(leaf: Leaf, target: ElementTarget) {
  const value = normalize(leaf.value)
  if (!value) return 0
  const key = String(leaf.path.at(-1) ?? '').toLowerCase()
  const texts = [target.directText, target.text, target.ariaLabel, target.alt].map(normalize).filter(Boolean)
  let score = 0

  texts.forEach((text, index) => {
    if (text === value) score = Math.max(score, index === 0 ? 190 : 170)
    else if (value.length >= 2 && text.includes(value)) score = Math.max(score, 70 + Math.min(value.length, 70))
    else if (text.length >= 3 && value.includes(text)) score = Math.max(score, 60 + Math.min(text.length, 60))
  })
  if (typeof leaf.value === 'string' && target.src) {
    const source = comparableUrl(target.src)
    const candidate = comparableUrl(leaf.value)
    if (source === candidate || source.endsWith(candidate)) score = Math.max(score, 210)
  }
  if (typeof leaf.value === 'string' && target.href) {
    const href = comparableUrl(target.href)
    const candidate = comparableUrl(leaf.value)
    if (href === candidate || href.endsWith(candidate)) score = Math.max(score, 180)
  }
  if (target.alt && normalize(target.alt) === value && /alt/.test(key)) score = Math.max(score, 200)
  if (texts.some((text) => text === value) && /(label|title|headline|question|heading)/.test(key)) score += 6
  return score
}

export function resolveTargetPath(props: unknown, target: ElementTarget, basePath: PathPart[] = []): PathPart[] {
  const controlPath = parseControlPath(target.path)
  if (controlPath) {
    const candidate = [...basePath, ...controlPath]
    if (getAt(props, candidate) !== undefined) return candidate
  }
  let bestPath = basePath
  let bestScore = 0
  for (const leaf of flattenLeaves(getAt(props, basePath), basePath)) {
    const score = scoreLeaf(leaf, target)
    if (score > bestScore) {
      bestPath = leaf.path
      bestScore = score
    }
  }
  return bestScore >= 60 ? bestPath : basePath
}
