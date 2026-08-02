"use client"

import { FieldLabel } from "@puckeditor/core"
import type { CustomFieldRender } from "@puckeditor/core"

export const StringListField: CustomFieldRender<string[]> = ({ field, value, onChange, readOnly }) => (
  <FieldLabel label={field.label || "Items"} readOnly={readOnly}>
    <textarea
      className="miduva-string-list-field"
      value={(value || []).join("\n")}
      onChange={(event) => onChange(event.currentTarget.value.split("\n").map((item) => item.trim()).filter(Boolean))}
      rows={Math.max(3, Math.min(10, value?.length || 3))}
      placeholder="One item per line"
      disabled={readOnly}
    />
  </FieldLabel>
)
