import { Button } from "#/shared/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "#/shared/components/ui/dialog"
import { useAppForm } from "#/shared/hooks/useAppForm"
import { useUpdateUnitMutation } from "../hooks/use-units"
import { updateUnitSchema } from "../model/schema"
import type { Unit } from "../model/types"

type UpdateUnitModalProps = {
  unit: Unit | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UpdateUnitModal({ unit, open, onOpenChange }: UpdateUnitModalProps) {
  const updateMutation = useUpdateUnitMutation()

  const form = useAppForm({
    defaultValues: {
      id: unit?.id ?? "",
      name: unit?.name ?? "",
      symbol: unit?.symbol ?? "",
      isActive: unit?.isActive ?? true,
    },
    validators: {
      onSubmit: updateUnitSchema,
    },
    onSubmit: ({ value }) => {
      if (!unit) return
      updateMutation.mutate(
        { ...value, id: unit.id },
        {
          onSuccess: () => {
            onOpenChange(false)
          },
        },
      )
    },
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>تعديل الوحدة</DialogTitle>
          <DialogDescription>أدخل بيانات الوحدة ثم اضغط حفظ.</DialogDescription>
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
          <form.AppField name="name">{(field) => <field.TextField label="اسم الوحدة" placeholder="مثال: طن" />}</form.AppField>

          <form.AppField name="symbol">{(field) => <field.TextField label="الرمز" placeholder="مثال: ton" />}</form.AppField>

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
