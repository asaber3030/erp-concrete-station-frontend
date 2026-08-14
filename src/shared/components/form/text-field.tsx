import * as React from "react"

import { Field, FieldDescription, FieldError, FieldLabel } from "#/shared/components/ui/field"
import { Input } from "#/shared/components/ui/input"

import { useFieldContext } from "#/shared/lib/form"
import { useFieldError } from "#/shared/hooks/useFieldError"

type TextFieldProps = Omit<
  React.ComponentProps<typeof Input>,
  "id" | "name" | "value" | "onChange" | "onBlur"
> & {
  label: string
  description?: string
}

export function TextField({ label, description, ...inputProps }: TextFieldProps) {
  const field = useFieldContext<string>()
  const { isInvalid, errors } = useFieldError(field)

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Input
        id={field.name}
        name={field.name}
        value={field.state.value ?? ""}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        aria-invalid={isInvalid}
        {...inputProps}
      />
      {description && <FieldDescription>{description}</FieldDescription>}
      {isInvalid && <FieldError errors={errors} />}
    </Field>
  )
}