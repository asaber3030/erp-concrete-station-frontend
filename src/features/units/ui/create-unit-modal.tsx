import { Button } from "#/shared/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "#/shared/components/ui/dialog"
import { useAppForm } from "#/shared/hooks/useAppForm"
import { useCreateUnitMutation } from "../hooks/use-units"
import { createUnitSchema } from "../model/schema"

type CreateUnitModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateUnitModal({ open, onOpenChange }: CreateUnitModalProps) {
  const createMutation = useCreateUnitMutation()

  const form = useAppForm({
    defaultValues: {
      name: "",
      symbol: "",
      isActive: true,
    },
    validators: {
      onSubmit: createUnitSchema,
    },
    onSubmit: ({ value }) => {
      createMutation.mutate(value, {
        onSuccess: () => {
          form.reset()
          onOpenChange(false)
        },
      })
    },
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>إضافة وحدة جديدة</DialogTitle>
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
