import * as React from "react"
import { Button } from "#/shared/components/ui/button"
import { useFormContext } from "#/shared/lib/form"

type SubmitButtonProps = React.ComponentProps<typeof Button> & {
  label?: string
}

export function SubmitButton({ label = "Submit", disabled, loading, ...props }: SubmitButtonProps) {
  const form = useFormContext()
  return (
    <form.Subscribe selector={(state) => [state.isSubmitting, state.canSubmit]}>
      {([isSubmitting, canSubmit]) => (
        <Button type="submit" disabled={!canSubmit || isSubmitting || disabled} loading={isSubmitting || loading || disabled} {...props}>
          {label}
        </Button>
      )}
    </form.Subscribe>
  )
}

export function ResetButton({ label = "Reset", ...props }: SubmitButtonProps) {
  const form = useFormContext()
  return (
    <Button type="button" variant="outline" onClick={() => form.reset()} {...props}>
      {label}
    </Button>
  )
}
