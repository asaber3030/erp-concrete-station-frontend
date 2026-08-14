import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import type { DateRange } from "react-day-picker"

import { cn } from "#/shared/lib/utils"
import { Button } from "#/shared/components/ui/button"
import { Calendar } from "#/shared/components/ui/calendar"
import { Field, FieldDescription, FieldError, FieldLabel } from "#/shared/components/ui/field"
import { Popover, PopoverContent, PopoverTrigger } from "#/shared/components/ui/popover"

import { useFieldContext } from "#/shared/lib/form";
import { useFieldError } from "#/shared/hooks/useFieldError";

type DateRangeFieldProps = {
  label: string
  description?: string
  placeholder?: string
  disabled?: (date: Date) => boolean
}

export function DateRangeField({
  label,
  description,
  placeholder = "Pick a date range",
  disabled,
}: DateRangeFieldProps) {
  const field = useFieldContext<DateRange | undefined>()
  const { isInvalid, errors } = useFieldError(field)
  const [open, setOpen] = React.useState(false)
  const value = field.state.value

  const label_ =
    value?.from && value?.to
      ? `${format(value.from, "LLL d, y")} – ${format(value.to, "LLL d, y")}`
      : value?.from
        ? format(value.from, "LLL d, y")
        : placeholder

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
              !value?.from && "text-muted-foreground"
            )}
          >
            <CalendarIcon />
            {label_}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={value}
            onSelect={field.handleChange}
            disabled={disabled}
            numberOfMonths={2}
            autoFocus
          />
        </PopoverContent>
      </Popover>
      {description && <FieldDescription>{description}</FieldDescription>}
      {isInvalid && <FieldError errors={errors} />}
    </Field>
  )
}