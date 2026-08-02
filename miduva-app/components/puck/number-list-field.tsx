"use client"

import { FieldLabel } from "@puckeditor/core"
import type { CustomFieldRender } from "@puckeditor/core"

export const NumberListField: CustomFieldRender<number[]> = ({ field, value, onChange, readOnly }) => (
  <FieldLabel label={field.label || "Values"} readOnly={readOnly}>
    <textarea
      className="miduva-string-list-field"
      value={(value || []).join(", ")}
      onChange={(event) => {
        const values = event.currentTarget.value
          .split(/[\s,]+/)
          .map(Number)
          .filter(Number.isFinite)
          .slice(0, 24)
          .map((item) => Math.max(0, Math.min(120, item)))
        onChange(values)
      }}
      rows={3}
      placeholder="42, 58, 51, 64"
      disabled={readOnly}
    />
  </FieldLabel>
)
