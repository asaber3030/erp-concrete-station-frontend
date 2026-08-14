"use client"

import { toast } from "sonner"
import * as z from "zod"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "#/shared/components/ui/card"
import { Field, FieldGroup } from "#/shared/components/ui/field"
import { useAppForm } from "#/shared/hooks/useAppForm"


const languageOptions = [
  { label: "English", value: "en" },
  { label: "Spanish", value: "es" },
  { label: "Arabic", value: "ar" },
  { label: "French", value: "fr" },
]

const countryOptions = [
  { label: "Egypt", value: "eg" },
  { label: "United States", value: "us" },
  { label: "United Kingdom", value: "uk" },
  { label: "Germany", value: "de" },
]

const notificationOptions = [
  { id: "product", label: "Product updates" },
  { id: "security", label: "Security alerts" },
  { id: "marketing", label: "Marketing emails" },
]

const planOptions = [
  { id: "starter", title: "Starter", description: "For everyday use." },
  { id: "pro", title: "Pro", description: "For advanced usage." },
]

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  bio: z.string().max(160, "Bio must be at most 160 characters."),
  age: z.number().min(18, "You must be at least 18.").max(120, "Enter a realistic age."),
  birthDate: z.date({ message: "Please pick a date." }),
  vacation: z
    .object({ from: z.date().optional(), to: z.date().optional() })
    .optional(),
  language: z.string().min(1, "Please select a language."),
  country: z.string().min(1, "Please select a country."),
  notifications: z.array(z.string()).min(1, "Pick at least one notification type."),
  plan: z.string().min(1, "Please choose a plan."),
  marketingEmails: z.boolean(),
  twoFactor: z.boolean(),
})

export function ExampleForm() {
  const form = useAppForm({
    defaultValues: {
      name: "",
      bio: "",
      age: 18,
      birthDate: undefined as Date | undefined,
      vacation: undefined as { from?: Date; to?: Date } | undefined,
      language: "",
      country: "",
      notifications: [] as string[],
      plan: "",
      marketingEmails: false,
      twoFactor: false,
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      toast.success("Form submitted")
      console.log(value)
    },
  })

  return (
    <Card className="w-full sm:max-w-lg">
      <CardHeader>
        <CardTitle>Complete Profile</CardTitle>
        <CardDescription>
          One field of every type, wired up with Zod validation.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="example-form"
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <FieldGroup>
            <form.AppField name="name">
              {(field) => (
                <field.TextField label="Full name" placeholder="Ada Lovelace" autoComplete="name" />
              )}
            </form.AppField>

            <form.AppField name="bio">
              {(field) => (
                <field.TextareaField
                  label="Bio"
                  placeholder="Tell us about yourself..."
                  maxLength={160}
                />
              )}
            </form.AppField>

            <form.AppField name="age">
              {(field) => (
                <field.NumberField label="Age" min={0} max={120} description="Must be 18 or older." />
              )}
            </form.AppField>

            <form.AppField name="birthDate">
              {(field) => <field.DateField label="Date of birth" />}
            </form.AppField>

            <form.AppField name="vacation">
              {(field) => (
                <field.DateRangeField
                  label="Next vacation"
                  description="Optional — pick a start and end date."
                />
              )}
            </form.AppField>

            <form.AppField name="language">
              {(field) => (
                <field.SelectField
                  label="Spoken language"
                  description="For best results, pick the language you speak."
                  options={languageOptions}
                />
              )}
            </form.AppField>

            <form.AppField name="country">
              {(field) => (
                <field.ComboboxField
                  label="Country"
                  placeholder="Select country"
                  options={countryOptions}
                />
              )}
            </form.AppField>

            <form.AppField name="notifications" mode="array">
              {(field) => (
                <field.CheckboxGroupField
                  legend="Notifications"
                  description="Choose what you want to hear about."
                  options={notificationOptions}
                />
              )}
            </form.AppField>

            <form.AppField name="plan">
              {(field) => (
                <field.RadioGroupField
                  legend="Plan"
                  description="You can change this later."
                  options={planOptions}
                />
              )}
            </form.AppField>

            <form.AppField name="marketingEmails">
              {(field) => (
                <field.SwitchField
                  label="Marketing emails"
                  description="Occasional product news, no spam."
                />
              )}
            </form.AppField>

            <form.AppField name="twoFactor">
              {(field) => (
                <field.CheckboxField
                  label="Enable two-factor authentication"
                  description="Recommended for all accounts."
                />
              )}
            </form.AppField>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <form.AppForm>
            <form.ResetButton />
            <form.SubmitButton label="Save profile" form="example-form" />
          </form.AppForm>
        </Field>
      </CardFooter>
    </Card>
  )
}