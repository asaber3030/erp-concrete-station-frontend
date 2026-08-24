import type { Role } from "#/features/roles/model/types"
import type { Station } from "#/features/stations/model/types"
import { Button } from "#/shared/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "#/shared/components/ui/dialog"
import { useAppForm } from "#/shared/hooks/useAppForm"
import { useUpdateUserMutation } from "../hooks/use-users"
import { updateUserSchema } from "../model/schema"
import type { User } from "../model/types"

type UpdateUserModalProps = {
  user: User | null
  open: boolean
  onOpenChange: (open: boolean) => void
  roles: Role[]
  stations: Station[]
}

export function UpdateUserModal({ user, open, onOpenChange, roles, stations }: UpdateUserModalProps) {
  const updateMutation = useUpdateUserMutation()

  const defaultRoleId = user ? (typeof user.role === "object" ? String(user.role?.id ?? "") : user.roleId ? String(user.roleId) : "none") : "none"
  const defaultStationId = user?.stationId ? String(user.stationId) : "none"

  const form = useAppForm({
    defaultValues: {
      id: user?.id ?? "",
      name: user?.name ?? "",
      email: user?.email ?? "",
      password: "",
      roleId: defaultRoleId,
      stationId: defaultStationId,
      isActive: user?.isActive ?? true,
    },
    validators: {
      onSubmit: updateUserSchema,
    },
    onSubmit: ({ value }) => {
      if (!user) return

      const payload = {
        id: user.id,
        name: value.name,
        email: value.email,
        password: value.password || undefined,
        roleId: value.roleId && value.roleId !== "none" ? value.roleId : undefined,
        stationId: value.stationId && value.stationId !== "none" ? value.stationId : undefined,
        isActive: value.isActive,
      }

      updateMutation.mutate(payload, {
        onSuccess: () => {
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
          <DialogTitle>تعديل بيانات المستخدم</DialogTitle>
          <DialogDescription>قم بتعديل بيانات المستخدم ثم اضغط حفظ.</DialogDescription>
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

          <form.AppField name="password">{(field) => <field.TextField label="كلمة المرور (اتركها فارغة للتعديل لاحقاً)" type="password" placeholder="••••••••" />}</form.AppField>

          <form.AppField name="roleId">{(field) => <field.SelectField label="الدور (Role)" placeholder="اختر الدور" options={roleOptions} />}</form.AppField>

          <form.AppField name="stationId">{(field) => <field.SelectField label="المحطة (Station)" placeholder="اختر المحطة" options={stationOptions} />}</form.AppField>

          <form.AppField name="isActive">{(field) => <field.SwitchField label="الحالة (نشط)" />}</form.AppField>

          <DialogFooter className="mt-2">
            <form.AppForm>
              <form.SubmitButton label="حفظ" loading={updateMutation.isPending} disabled={updateMutation.isPending} />
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
