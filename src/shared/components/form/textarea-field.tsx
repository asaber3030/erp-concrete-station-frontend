import * as React from "react";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "#/shared/components/ui/field";
import { Textarea } from "#/shared/components/ui/textarea";

import { useFieldContext } from "#/shared/lib/form";
import { useFieldError } from "#/shared/hooks/useFieldError";

type TextareaFieldProps = Omit<
  React.ComponentProps<typeof Textarea>,
  "id" | "name" | "value" | "onChange" | "onBlur"
> & {
  label: string;
  description?: string;
  maxLength?: number;
};

export function TextareaField({
  label,
  description,
  maxLength,
  ...textareaProps
}: TextareaFieldProps) {
  const field = useFieldContext<string>();
  const { isInvalid, errors } = useFieldError(field);
  const value: string = field.state.value ?? "";

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Textarea
        id={field.name}
        name={field.name}
        value={value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        aria-invalid={isInvalid}
        maxLength={maxLength}
        {...textareaProps}
      />
      {(description || maxLength) && (
        <FieldDescription>
          {description}
          {description && maxLength && " "}
          {maxLength && (
            <span className="tabular-nums">
              {value.length}/{maxLength} characters
            </span>
          )}
        </FieldDescription>
      )}
      {isInvalid && <FieldError errors={errors} />}
    </Field>
  );
}
