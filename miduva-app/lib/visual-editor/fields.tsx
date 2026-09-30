"use client"

import { useState } from "react"
import type { Field } from "./types"
import { pathKey, type PathPart } from "./paths"
import { MediaInput } from "./media-input"
import { Icon } from "./icons"

type UnknownRecord = Record<string, unknown>
type ListField = Extract<Field, { kind: "list" }>

export type FieldContext = {
  onChange: (path: PathPart[], value: unknown) => void
  expanded: ReadonlySet<string>
  toggle: (key: string) => void
}

const str = (value: unknown) => (typeof value === "string" ? value : value == null ? "" : String(value))
const asRecord = (value: unknown): UnknownRecord => (value && typeof value === "object" && !Array.isArray(value) ? (value as UnknownRecord) : {})

function defaultSummary(def: ListField, item: UnknownRecord, index: number) {
  if (def.summary) return def.summary(item, index) || `${def.itemLabel} ${index + 1}`
  const first = def.fields.find((field) => field.kind === "text" || field.kind === "textarea")
  const text = first && "key" in first && first.key ? str(item[first.key]) : ""
  return text || `${def.itemLabel[0].toUpperCase()}${def.itemLabel.slice(1)} ${index + 1}`
}

function emptyItem(fields: Field[]) {
  const item: UnknownRecord = {}
  for (const field of fields) {
    if (field.kind === "group") Object.assign(item, field.key ? { [field.key]: emptyItem(field.fields) } : emptyItem(field.fields))
    else if (field.kind === "number") item[field.key] = field.min ?? 0
    else if (field.kind === "toggle") item[field.key] = false
    else if (field.kind === "select") item[field.key] = field.options[0]?.value
    else if (field.kind === "list" || field.kind === "strings" || field.kind === "numbers") item[field.key] = []
    else if (field.kind === "link") item[field.key] = { label: "", href: "" }
    else item[field.key] = ""
  }
  return item
}

function Label({ label, help, htmlFor }: { label: string; help?: string; htmlFor?: string }) {
  return (
    <span className="ve-label">
      <label htmlFor={htmlFor}>{label}</label>
      {help ? <small>{help}</small> : null}
    </span>
  )
}

function StringsInput({ path, value, ctx }: { path: PathPart[]; value: unknown; ctx: FieldContext }) {
  const items = Array.isArray(value) ? value.map(str) : []
  return (
    <div className="ve-strings">
      {items.map((item, index) => (
        <div className="ve-strings__row" key={index} data-path={pathKey([...path, index])}>
          <input type="text" value={item} aria-label={`Line ${index + 1}`} onChange={(event) => ctx.onChange([...path, index], event.currentTarget.value)} />
          <button type="button" className="ve-icon-button" aria-label={`Remove line ${index + 1}`} onClick={() => ctx.onChange(path, items.filter((_, i) => i !== index))}>
            <Icon name="close" />
          </button>
        </div>
      ))}
      <button type="button" className="ve-add" onClick={() => ctx.onChange(path, [...items, ""])}><Icon name="plus" /> Add line</button>
    </div>
  )
}

function NumbersInput({ id, value, min, max, onChange }: { id: string; value: unknown; min?: number; max?: number; onChange: (value: number[]) => void }) {
  const joined = (Array.isArray(value) ? value.filter((item): item is number => typeof item === "number") : []).join(", ")
  const [text, setText] = useState(joined)
  const [synced, setSynced] = useState(joined)
  const parse = (input: string) => input.split(/[\s,]+/).filter(Boolean).map(Number).filter(Number.isFinite)
    .map((item) => Math.max(min ?? -Infinity, Math.min(max ?? Infinity, item)))
  if (synced !== joined) {
    // Adopt outside changes (undo, history) without fighting the admin's typing.
    setSynced(joined)
    if (parse(text).join(", ") !== joined) setText(joined)
  }
  return (
    <input id={id} type="text" inputMode="decimal" value={text} placeholder="10, 20, 30" onChange={(event) => {
      setText(event.currentTarget.value)
      onChange(parse(event.currentTarget.value))
    }} />
  )
}

function ListInput({ def, path, value, ctx }: { def: ListField; path: PathPart[]; value: unknown; ctx: FieldContext }) {
  const items = Array.isArray(value) ? (value as UnknownRecord[]) : []
  const fixed = def.min !== undefined && def.min === def.max
  const canAdd = !fixed && (def.max === undefined || items.length < def.max)
  const canRemove = !fixed && items.length > (def.min ?? 0)

  function move(index: number, direction: -1 | 1) {
    const next = [...items]
    ;[next[index], next[index + direction]] = [next[index + direction], next[index]]
    ctx.onChange(path, next)
  }

  function add() {
    const item = def.newItem ? def.newItem() : emptyItem(def.fields)
    if (def.idPrefix) item.id = `${def.idPrefix}-${Date.now().toString(36)}`
    ctx.onChange(path, [...items, item])
    ctx.toggle(pathKey([...path, items.length]))
  }

  return (
    <div className="ve-list" data-path={pathKey(path)}>
      <div className="ve-list__head">
        <span>{def.label}</span>
        <small>{fixed ? `${items.length} items` : `${items.length}${def.max ? ` of ${def.max}` : ""}`}</small>
      </div>
      {def.help ? <p className="ve-help">{def.help}</p> : null}
      {items.map((item, index) => {
        const itemPath = [...path, index]
        const key = pathKey(itemPath)
        const open = ctx.expanded.has(key)
        const summary = defaultSummary(def, item, index)
        return (
          <div className={`ve-item${open ? " is-open" : ""}`} key={str(item.id) || index} data-path={key}>
            <div className="ve-item__head">
              <button type="button" className="ve-item__toggle" aria-expanded={open} onClick={() => ctx.toggle(key)}>
                <Icon name="chevron" />
                <span>{summary}</span>
              </button>
              <div className="ve-item__actions">
                <button type="button" className="ve-icon-button" aria-label="Move up" disabled={index === 0} onClick={() => move(index, -1)}><Icon name="up" /></button>
                <button type="button" className="ve-icon-button" aria-label="Move down" disabled={index === items.length - 1} onClick={() => move(index, 1)}><Icon name="down" /></button>
                {canRemove ? (
                  <button
                    type="button"
                    className="ve-icon-button is-danger"
                    aria-label={`Delete ${def.itemLabel}`}
                    onClick={() => window.confirm(`Delete “${summary}”?`) && ctx.onChange(path, items.filter((_, i) => i !== index))}
                  >
                    <Icon name="trash" />
                  </button>
                ) : null}
              </div>
            </div>
            {open ? <div className="ve-item__body"><FieldList fields={def.fields} value={item} path={itemPath} ctx={ctx} /></div> : null}
          </div>
        )
      })}
      {canAdd ? <button type="button" className="ve-add" onClick={add}><Icon name="plus" /> Add {def.itemLabel}</button> : null}
    </div>
  )
}

function FieldRow({ def, value, path, ctx }: { def: Field; value: UnknownRecord; path: PathPart[]; ctx: FieldContext }) {
  if (def.kind === "group") {
    const groupPath = def.key ? [...path, def.key] : path
    return (
      <fieldset className="ve-group">
        <legend>{def.label}</legend>
        <FieldList fields={def.fields} value={def.key ? asRecord(value[def.key]) : value} path={groupPath} ctx={ctx} />
      </fieldset>
    )
  }

  const fieldPath = [...path, def.key]
  const key = pathKey(fieldPath)
  const id = `ve-${key}`
  const current = value[def.key]
  const set = (next: unknown) => ctx.onChange(fieldPath, next)

  if (def.kind === "list") return <ListInput def={def} path={fieldPath} value={current} ctx={ctx} />

  if (def.kind === "toggle") {
    return (
      <div className="ve-field" data-path={key}>
        <label className="ve-toggle">
          <input id={id} type="checkbox" checked={current === true} onChange={(event) => set(event.currentTarget.checked)} />
          <span>{def.label}</span>
        </label>
        {def.help ? <p className="ve-help">{def.help}</p> : null}
      </div>
    )
  }

  let control: React.ReactNode
  switch (def.kind) {
    case "text":
      control = <input id={id} type="text" value={str(current)} placeholder={def.placeholder} onChange={(event) => set(event.currentTarget.value)} />
      break
    case "textarea":
      control = <textarea id={id} value={str(current)} placeholder={def.placeholder} rows={Math.min(8, Math.max(3, Math.ceil(str(current).length / 42)))} onChange={(event) => set(event.currentTarget.value)} />
      break
    case "number":
      control = <input id={id} type="number" min={def.min} max={def.max} value={typeof current === "number" ? current : ""} onChange={(event) => set(event.currentTarget.value === "" ? 0 : Number(event.currentTarget.value))} />
      break
    case "select":
      control = (
        <select id={id} value={str(current)} onChange={(event) => set(def.options.find((option) => String(option.value) === event.currentTarget.value)?.value)}>
          {def.options.map((option) => <option key={String(option.value)} value={String(option.value)}>{option.label}</option>)}
        </select>
      )
      break
    case "image":
      control = <MediaInput id={id} value={str(current)} onChange={set} />
      break
    case "strings":
      control = <StringsInput path={fieldPath} value={current} ctx={ctx} />
      break
    case "numbers":
      control = <NumbersInput id={id} value={current} min={def.min} max={def.max} onChange={set} />
      break
    case "link": {
      const link = asRecord(current)
      control = (
        <div className="ve-link">
          <input id={id} type="text" aria-label={`${def.label} text`} placeholder="Button text" value={str(link.label)} data-path={pathKey([...fieldPath, "label"])} onChange={(event) => set({ ...link, label: event.currentTarget.value })} />
          <input type="text" aria-label={`${def.label} link`} placeholder="#contact or https://…" value={str(link.href)} data-path={pathKey([...fieldPath, "href"])} onChange={(event) => set({ ...link, href: event.currentTarget.value })} />
        </div>
      )
      break
    }
  }

  return (
    <div className="ve-field" data-path={key}>
      <Label label={def.label} help={def.help} htmlFor={def.kind === "strings" ? undefined : id} />
      {control}
    </div>
  )
}

export function FieldList({ fields, value, path, ctx }: { fields: Field[]; value: unknown; path: PathPart[]; ctx: FieldContext }) {
  const record = asRecord(value)
  return (
    <div className="ve-fields">
      {fields.map((def, index) => <FieldRow key={`${def.kind}-${def.key ?? ""}-${index}`} def={def} value={record} path={path} ctx={ctx} />)}
    </div>
  )
}
