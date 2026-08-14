import type { AnyFieldApi } from "@tanstack/react-form"

/**
 * Every field helper needs the same two things: whether to show an
 * error, and the error list to hand to <FieldError />. Centralizing it
 * means the "isTouched && !isValid" rule only lives in one place.
 */
export function useFieldError(field: AnyFieldApi) {
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
  return {
    isInvalid,
    errors: field.state.meta.errors,
  }
}