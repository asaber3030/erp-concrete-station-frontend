import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

import { cn } from "#/shared/lib/utils"
import { Button } from "#/shared/components/ui/button"
import { Calendar } from "#/shared/components/ui/calendar"
import { Field, FieldDescription, FieldError, FieldLabel } from "#/shared/components/ui/field"
import { Popover, PopoverContent, PopoverTrigger } from "#/shared/components/ui/popover"

import { useFieldContext } from "#/shared/lib/form";
import { useFieldError } from "#/shared/hooks/useFieldError";

type DateFieldProps = {
  label: string
  description?: string
  placeholder?: string
  disabled?: (date: Date) => boolean
  displayFormat?: string
}

export function DateField({
  label,
  description,
  placeholder = "Pick a date",
  disabled,
  displayFormat = "PPP",
}: DateFieldProps) {
  const field = useFieldContext<Date | undefined>()
  const { isInvalid, errors } = useFieldError(field)
  const [open, setOpen] = React.useState(false)

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={field.name}
            type="button"
            variant="outline"
            aria-invalid={isInvalid}
            onBlur={field.handleBlur}
            className={cn(
              "w-full justify-start text-left font-normal",
              !field.state.value && "text-muted-foreground"
            )}
          >
            <CalendarIcon />
            {field.state.value ? format(field.state.value, displayFormat) : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={field.state.value}
            onSelect={(date) => {
              field.handleChange(date)
              setOpen(false)
            }}
            disabled={disabled}
            autoFocus
          />
        </PopoverContent>
      </Popover>
      {description && <FieldDescription>{description}</FieldDescription>}
      {isInvalid && <FieldError errors={errors} />}
    </Field>
  )
}