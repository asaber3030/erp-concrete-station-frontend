import type { Role } from "#/features/roles/model/types"
import type { Station } from "#/features/stations/model/types"
import { Button } from "#/shared/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "#/shared/components/ui/dialog"
import { useAppForm } from "#/shared/hooks/useAppForm"
import { useCreateUserMutation } from "../hooks/use-users"
import { createUserSchema } from "../model/schema"

type CreateUserModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  roles: Role[]
  stations: Station[]
}

export function CreateUserModal({ open, onOpenChange, roles, stations }: CreateUserModalProps) {
  const createMutation = useCreateUserMutation()

  const form = useAppForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      roleId: "",
      stationId: "",
      isActive: true,
    },
    validators: {
      onSubmit: createUserSchema,
    },
    onSubmit: ({ value }) => {
      const payload = {
        name: value.name,
        email: value.email,
        password: value.password || undefined,
        roleId: value.roleId && value.roleId !== "none" ? value.roleId : undefined,
        stationId: value.stationId && value.stationId !== "none" ? value.stationId : undefined,
        isActive: value.isActive,
      }

      createMutation.mutate(payload, {
        onSuccess: () => {
          form.reset()
          onOpenChange(false)
        },
      })
    },
  })

  const roleOptions = [{ label: "بدون دور", value: "none" }, ...roles.map((r) => ({ label: r.name, value: String(r.id) }))]

  const stationOptions = [{ label: "بدون محطة", value: "none" }, ...stations.map((st) => ({ label: `${st.name} (${st.code})`, value: String(st.id) }))]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>إضافة مستخدم جديد</DialogTitle>
          <DialogDescription>أدخل بيانات المستخدم الجديدة ثم اضغط حفظ.</DialogDescription>
        </DialogHeader>

        <form
          className="grid gap-4 py-2"
          noValidate
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            void form.handleSubmit()
          }}
        >
          <form.AppField name="name">{(field) => <field.TextField label="الاسم الكامل" placeholder="الاسم" />}</form.AppField>

          <form.AppField name="email">{(field) => <field.TextField label="البريد الإلكتروني" type="email" placeholder="name@example.com" />}</form.AppField>

          <form.AppField name="password">{(field) => <field.TextField label="كلمة المرور" type="password" placeholder="••••••••" />}</form.AppField>

          <form.AppField name="roleId">{(field) => <field.SelectField label="الدور (Role)" placeholder="اختر الدور" options={roleOptions} />}</form.AppField>

          <form.AppField name="stationId">{(field) => <field.SelectField label="المحطة (Station)" placeholder="اختر المحطة" options={stationOptions} />}</form.AppField>

          <form.AppField name="isActive">{(field) => <field.SwitchField label="الحالة (نشط)" />}</form.AppField>

          <DialogFooter className="mt-2">
            <form.AppForm>
              <form.SubmitButton label="حفظ" loading={createMutation.isPending} disabled={createMutation.isPending} />
            </form.AppForm>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              إلغاء
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
