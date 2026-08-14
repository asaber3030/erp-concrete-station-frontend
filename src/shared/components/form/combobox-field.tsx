import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "#/shared/lib/utils"
import { Button } from "#/shared/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "#/shared/components/ui/command"
import { Field, FieldDescription, FieldError, FieldLabel } from "#/shared/components/ui/field"
import { Popover, PopoverContent, PopoverTrigger } from "#/shared/components/ui/popover"

import { useFieldContext } from "#/shared/lib/form";
import { useFieldError } from "#/shared/hooks/useFieldError";

export type ComboboxFieldOption = {
  label: string
  value: string
}

type ComboboxFieldProps = {
  label: string
  description?: string
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  options: ComboboxFieldOption[]
}

export function ComboboxField({
  label,
  description,
  placeholder = "Select an option",
  searchPlaceholder = "Search...",
  emptyText = "No results found.",
  options,
}: ComboboxFieldProps) {
  const field = useFieldContext<string>()
  const { isInvalid, errors } = useFieldError(field)
  const [open, setOpen] = React.useState(false)

  const selected = options.find((option) => option.value === field.state.value)

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={field.name}
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-invalid={isInvalid}
            onBlur={field.handleBlur}
            className="w-full justify-between font-normal"
          >
            {selected ? selected.label : <span className="text-muted-foreground">{placeholder}</span>}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList>
              <CommandEmpty>{emptyText}</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    onSelect={() => {
                      field.handleChange(option.value)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        field.state.value === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {description && <FieldDescription>{description}</FieldDescription>}
      {isInvalid && <FieldError errors={errors} />}
    </Field>
  )
}