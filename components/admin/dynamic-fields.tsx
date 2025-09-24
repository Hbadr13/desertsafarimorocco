"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, X } from "lucide-react"

interface DynamicField {
  key: string
  value: string
}

interface DynamicFieldsProps {
  label: string
  fields: DynamicField[]
  onChange: (fields: DynamicField[]) => void
  keyPlaceholder?: string
  valuePlaceholder?: string
  valueType?: "input" | "textarea"
  disabled?: boolean
}

export function DynamicFields({
  label,
  fields,
  onChange,
  keyPlaceholder = "Key",
  valuePlaceholder = "Value",
  valueType = "input",
  disabled = false,
}: DynamicFieldsProps) {
  const addField = () => {
    onChange([...fields, { key: "", value: "" }])
  }

  const removeField = (index: number) => {
    onChange(fields.filter((_, i) => i !== index))
  }

  const updateField = (index: number, field: "key" | "value", value: string) => {
    const updatedFields = fields.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    onChange(updatedFields)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <Button type="button" variant="outline" size="sm" onClick={addField} disabled={disabled}>
          <Plus className="h-4 w-4 mr-2" />
          Add {label.slice(0, -1)}
        </Button>
      </div>

      {fields.length === 0 ? (
        <p className="text-sm text-muted-foreground">No {label.toLowerCase()} added yet</p>
      ) : (
        <div className="space-y-3">
          {fields.map((field, index) => (
            <div key={index} className="flex gap-2 items-start">
              <div className="flex-1">
                <Input
                  placeholder={keyPlaceholder}
                  value={field.key}
                  onChange={(e) => updateField(index, "key", e.target.value)}
                  disabled={disabled}
                />
              </div>
              <div className="flex-2">
                {valueType === "textarea" ? (
                  <Textarea
                    placeholder={valuePlaceholder}
                    value={field.value}
                    onChange={(e) => updateField(index, "value", e.target.value)}
                    disabled={disabled}
                    rows={2}
                  />
                ) : (
                  <Input
                    placeholder={valuePlaceholder}
                    value={field.value}
                    onChange={(e) => updateField(index, "value", e.target.value)}
                    disabled={disabled}
                  />
                )}
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removeField(index)}
                disabled={disabled}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
