"use client"

import { toast } from "sonner"
import { z } from "zod"

import { useAppForm } from "#/shared/hooks/useAppForm"

const exampleSchema = z.object({
  name: z.string().min(2, "الاسم مطلوب"),
})

export function ExampleForm() {
  const form = useAppForm({
    defaultValues: { name: "" },
    validators: { onSubmit: exampleSchema },
    onSubmit: async () => {
      toast.success("تم حفظ النموذج")
    },
  })

  return (
    <form
      className="grid gap-3"
      onSubmit={(event) => {
        event.preventDefault()
        void form.handleSubmit()
      }}
    >
      <form.AppField name="name">
        {(field) => <field.TextField label="الاسم" />}
      </form.AppField>
      <form.AppForm>
        <form.SubmitButton label="حفظ" />
      </form.AppForm>
    </form>
  )
}
