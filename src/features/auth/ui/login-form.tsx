import { useAppForm } from "#/shared/hooks/useAppForm"
import { useLoginMutation } from "../hooks/useAuth"
import { loginSchema } from "../model/schema"

export function LoginForm() {
  const loginMutation = useLoginMutation()

  const form = useAppForm({
    defaultValues: { name: "admin", password: "admin123" },
    validators: { onSubmit: loginSchema },
    onSubmit: ({ value }) => {
      loginMutation.mutate(value)
    },
  })

  return (
    <form
      className="grid gap-4 rounded-md border bg-white p-4"
      noValidate
      method="POST"
      onSubmit={(event) => {
        event.preventDefault()
        event.stopPropagation()
        form.handleSubmit()
      }}
    >
      <form.AppField name="name">{(field) => <field.TextField label="اسم المستخدم" autoComplete="username" />}</form.AppField>
      <form.AppField name="password">{(field) => <field.TextField label="كلمة المرور" type="password" autoComplete="current-password" />}</form.AppField>

      <form.AppForm>
        <form.SubmitButton disabled={loginMutation.isPending} label="دخول" className="w-full" />
      </form.AppForm>
    </form>
  )
}
