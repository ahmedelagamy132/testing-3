'use client'

import { useRowLabel } from '@payloadcms/ui'

type RowData = {
  title?: string
  headline?: string
  label?: string
  question?: string
  key?: string
  num?: string
  item?: string
  text?: string
  phrase?: string
  subtitle?: string
}

export const ArrayRowLabel = () => {
  const { data, rowNumber } = useRowLabel<RowData>()

  const fallback = `Item ${String(rowNumber ?? 1).padStart(2, '0')}`
  const prefix = data?.num ? `${data.num} — ` : ''
  const title =
    data?.title ||
    data?.headline ||
    data?.question ||
    data?.label ||
    data?.key ||
    data?.subtitle ||
    data?.item ||
    data?.text ||
    data?.phrase ||
    fallback

  return <span>{`${prefix}${title}`}</span>
}

export default ArrayRowLabel
