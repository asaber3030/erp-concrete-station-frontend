import { useAllPermissionsQuery } from "#/features/permissions/hooks/use-permissions"
import { useAppForm } from "#/shared/hooks/useAppForm"
import { useUpdateRoleMutation } from "../hooks/use-roles"
import { updateRoleFormSchema } from "../model/schema"
import type { Role } from "../model/types"

type UpdateRoleProps = {
  role: Role | null
}

export function UpdateRole({ role }: UpdateRoleProps) {
  const updateMutation = useUpdateRoleMutation()
  const permissions = useAllPermissionsQuery()

  const permissionOptions = (permissions.data ?? []).map((p) => ({
    id: Number(p.id),
    label: p.name,
  }))

  const form = useAppForm({
    defaultValues: {
      name: role?.name ?? "",
      label: role?.label ?? "",
      permissions: role?.rolePermissions?.map((item) => Number(item.permissionId)) ?? [],
    },
    validators: {
      onSubmit: updateRoleFormSchema,
    },
    onSubmit: ({ value }) => {
      if (!role) return
      updateMutation.mutate(
        {
          data: {
            ...value,
            permissions: value.permissions.map(Number),
          },
          roleId: role.id,
        },
        {
          onSuccess: () => {},
        },
      )
    },
  })

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

      <form.AppField name="permissions" mode="array">
        {(field) => <field.CheckboxGroupField legend="الصلاحيات" options={permissionOptions} />}
      </form.AppField>

      <div className="mt-2">
        <form.AppForm>
          <form.SubmitButton label="حفظ" loading={updateMutation.isPending} disabled={updateMutation.isPending} />
        </form.AppForm>
      </div>
    </form>
  )
}
