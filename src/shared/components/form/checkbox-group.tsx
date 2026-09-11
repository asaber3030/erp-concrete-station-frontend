import { Checkbox } from "#/shared/components/ui/checkbox"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "#/shared/components/ui/field"

import { useFieldContext } from "#/shared/lib/form"
import { useFieldError } from "#/shared/hooks/useFieldError"

export type CheckboxGroupOption = {
  id: string
  label: string
}

type CheckboxGroupFieldProps = {
  legend: string
  description?: string
  options: CheckboxGroupOption[]
}

/**
 * Use with `mode="array"` on the surrounding `<form.AppField>`, and a
 * `string[]` default value (the array of selected option ids).
 */
export function CheckboxGroupField({ legend, description, options }: CheckboxGroupFieldProps) {
  const field = useFieldContext<string[]>()
  const { isInvalid, errors } = useFieldError(field)
  const value = field.state.value ?? []

  return (
    <FieldSet>
      <FieldLegend variant="label">{legend}</FieldLegend>
      {description && <FieldDescription>{description}</FieldDescription>}
      <FieldGroup data-slot="checkbox-group" className="grid grid-cols-4 gap-4">
        {options.map((option) => (
          <Field key={option.id} orientation="horizontal" data-invalid={isInvalid}>
            <Checkbox
              id={`${field.name}-${option.id}`}
              name={field.name}
              aria-invalid={isInvalid}
              checked={value.includes(option.id)}
              onCheckedChange={(checked) => {
                if (checked) {
                  field.pushValue(option.id)
                } else {
                  const index = value.indexOf(option.id)
                  if (index > -1) field.removeValue(index)
                }
              }}
            />
            <FieldLabel htmlFor={`${field.name}-${option.id}`} className="font-normal">
              {option.label}
            </FieldLabel>
          </Field>
        ))}
      </FieldGroup>
      {isInvalid && <FieldError errors={errors} />}
    </FieldSet>
  )
}
