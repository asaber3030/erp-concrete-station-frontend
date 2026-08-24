import { usePermissionsQuery } from "#/features/permissions/hooks/use-permissions"
import { Button } from "#/shared/components/ui/button"
import { useAppForm } from "#/shared/hooks/useAppForm"
import { toast } from "sonner"
import { useCreateRoleMutation } from "../hooks/use-roles"
import { createRoleFormSchema } from "../model/schema"

export function CreateRole() {
  const createMutation = useCreateRoleMutation()
  const permissions = usePermissionsQuery()

  const form = useAppForm({
    defaultValues: {
      name: "",
      label: "",
      permissions: [] as string[],
    },
    validators: {
      onSubmit: createRoleFormSchema,
    },
    onSubmit: ({ value }) => {
      createMutation.mutate(
        {
          name: value.name,
          label: value.label,
          permissions: value.permissions.map(Number),
        },
        {
          onSuccess: () => {
            form.reset()
          },
          onError: (err: Error) => {
            toast.error(err.message || "حدث خطأ أثناء إضافة الدور")
          },
        },
      )
    },
  })

  const permissionOptions = (permissions.data ?? []).map((p) => ({
    id: String(p.id),
    label: p.name,
  }))

  return (
    <form
      className="grid gap-4 py-2"
      noValidate
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        void form.handleSubmit()
      }}
    >
      <form.AppField name="name">{(field) => <field.TextField label="اسم الدور" placeholder="مثال: مدير المحطة" />}</form.AppField>

      <form.AppField name="label">{(field) => <field.TextField label="الوصف" placeholder="وصف مختصر لمسؤوليات هذا الدور" />}</form.AppField>

      <div className="grid grid-cols-6">
        <form.AppField name="permissions" mode="array">
          {(field) => <field.CheckboxGroupField legend="الصلاحيات" options={permissionOptions} />}
        </form.AppField>
      </div>

      <div className="mt-2">
        <form.AppForm>
          <form.SubmitButton label="حفظ" loading={createMutation.isPending} disabled={createMutation.isPending} />
        </form.AppForm>
      </div>
    </form>
  )
}
