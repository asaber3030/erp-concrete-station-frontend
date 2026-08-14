import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "#/shared/components/ui/field"
import { RadioGroup, RadioGroupItem } from "#/shared/components/ui/radio-group"

import { useFieldContext } from "#/shared/lib/form";
import { useFieldError } from "#/shared/hooks/useFieldError";

export type RadioGroupFieldOption = {
  id: string
  title: string
  description?: string
}

type RadioGroupFieldProps = {
  legend: string
  description?: string
  options: RadioGroupFieldOption[]
}

export function RadioGroupField({ legend, description, options }: RadioGroupFieldProps) {
  const field = useFieldContext<string>()
  const { isInvalid, errors } = useFieldError(field)

  return (
    <FieldSet>
      <FieldLegend>{legend}</FieldLegend>
      {description && <FieldDescription>{description}</FieldDescription>}
      <RadioGroup name={field.name} value={field.state.value} onValueChange={field.handleChange}>
        {options.map((option) => (
          <FieldLabel key={option.id} htmlFor={`${field.name}-${option.id}`}>
            <Field orientation="horizontal" data-invalid={isInvalid}>
              <FieldContent>
                <FieldTitle>{option.title}</FieldTitle>
                {option.description && <FieldDescription>{option.description}</FieldDescription>}
              </FieldContent>
              <RadioGroupItem
                value={option.id}
                id={`${field.name}-${option.id}`}
                aria-invalid={isInvalid}
              />
            </Field>
          </FieldLabel>
        ))}
      </RadioGroup>
      {isInvalid && <FieldError errors={errors} />}
    </FieldSet>
  )
}