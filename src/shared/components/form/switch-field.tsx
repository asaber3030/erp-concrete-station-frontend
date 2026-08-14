import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "#/shared/components/ui/field"
import { Switch } from "#/shared/components/ui/switch"

import { useFieldContext } from "#/shared/lib/form";
import { useFieldError } from "#/shared/hooks/useFieldError";

type SwitchFieldProps = {
  label: string
  description?: string
}

export function SwitchField({ label, description }: SwitchFieldProps) {
  const field = useFieldContext<boolean>()
  const { isInvalid, errors } = useFieldError(field)

  return (
    <Field orientation="horizontal" data-invalid={isInvalid}>
      <FieldContent>
        <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
        {description && <FieldDescription>{description}</FieldDescription>}
        {isInvalid && <FieldError errors={errors} />}
      </FieldContent>
      <Switch
        id={field.name}
        name={field.name}
        checked={field.state.value}
        onCheckedChange={field.handleChange}
        aria-invalid={isInvalid}
      />
    </Field>
  )
}