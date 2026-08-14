import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "#/shared/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/shared/components/ui/select"

import { useFieldContext } from "#/shared/lib/form"
import { useFieldError } from "#/shared/hooks/useFieldError"

export type SelectFieldOption = {
  label: string
  value: string
  disabled?: boolean
}

type SelectFieldProps = {
  label: string
  description?: string
  placeholder?: string
  options: SelectFieldOption[]
  /** Lay the label/description beside the control instead of above it. */
  orientation?: "vertical" | "horizontal" | "responsive"
}

export function SelectField({
  label,
  description,
  placeholder = "Select",
  options,
  orientation = "responsive",
}: SelectFieldProps) {
  const field = useFieldContext<string>()
  const { isInvalid, errors } = useFieldError(field)

  return (
    <Field orientation={orientation} data-invalid={isInvalid}>
      <FieldContent>
        <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
        {description && <FieldDescription>{description}</FieldDescription>}
        {isInvalid && <FieldError errors={errors} />}
      </FieldContent>
      <Select
        name={field.name}
        value={field.state.value}
        onValueChange={field.handleChange}
      >
        <SelectTrigger id={field.name} aria-invalid={isInvalid} className="min-w-[160px]">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent position="item-aligned">
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  )
}