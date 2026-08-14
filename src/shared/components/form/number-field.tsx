import { Minus, Plus } from "lucide-react"

import { Field, FieldDescription, FieldError, FieldLabel } from "#/shared/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/shared/components/ui/input-group"


import { useFieldContext } from "#/shared/lib/form";
import { useFieldError } from "#/shared/hooks/useFieldError";

type NumberFieldProps = {
  label: string
  description?: string
  placeholder?: string
  min?: number
  max?: number
  step?: number
  showStepper?: boolean
}

export function NumberField({
  label,
  description,
  placeholder,
  min,
  max,
  step = 1,
  showStepper = true,
}: NumberFieldProps) {
  const field = useFieldContext<number>()
  const { isInvalid, errors } = useFieldError(field)

  const clamp = (value: number) => {
    let next = value
    if (typeof min === "number") next = Math.max(min, next)
    if (typeof max === "number") next = Math.min(max, next)
    return next
  }

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <InputGroup>
        {showStepper && (
          <InputGroupAddon align="inline-start">
            <InputGroupButton
              type="button"
              variant="ghost"
              size="icon-xs"
              aria-label={`Decrease ${label}`}
              onClick={() =>
                field.handleChange(clamp((field.state.value ?? 0) - step))
              }
            >
              <Minus />
            </InputGroupButton>
          </InputGroupAddon>
        )}
        <InputGroupInput
          id={field.name}
          name={field.name}
          type="number"
          inputMode="numeric"
          value={Number.isFinite(field.state.value) ? field.state.value : ""}
          onBlur={field.handleBlur}
          onChange={(e) => {
            const parsed = e.target.valueAsNumber
            field.handleChange(Number.isNaN(parsed) ? 0 : parsed)
          }}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          aria-invalid={isInvalid}
          className="text-center"
        />
        {showStepper && (
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              type="button"
              variant="ghost"
              size="icon-xs"
              aria-label={`Increase ${label}`}
              onClick={() =>
                field.handleChange(clamp((field.state.value ?? 0) + step))
              }
            >
              <Plus />
            </InputGroupButton>
          </InputGroupAddon>
        )}
      </InputGroup>
      {description && <FieldDescription>{description}</FieldDescription>}
      {isInvalid && <FieldError errors={errors} />}
    </Field>
  )
}