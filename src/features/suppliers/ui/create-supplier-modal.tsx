import { Button } from "#/shared/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "#/shared/components/ui/dialog"
import { useAppForm } from "#/shared/hooks/useAppForm"
import { useCreateSupplierMutation } from "../hooks/use-suppliers"
import { createSupplierSchema } from "../model/schema"

type CreateSupplierModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateSupplierModal({ open, onOpenChange }: CreateSupplierModalProps) {
  const createMutation = useCreateSupplierMutation()

  const form = useAppForm({
    defaultValues: {
      name: "",
      code: "",
      contactInfo: "",
      isActive: true,
    },
    validators: {
      onSubmit: createSupplierSchema,
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
          <DialogTitle>إضافة مورد جديد</DialogTitle>
          <DialogDescription>أدخل بيانات المورد ثم اضغط حفظ.</DialogDescription>
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
          <form.AppField name="name">{(field) => <field.TextField label="اسم المورد" placeholder="اسم المورد" />}</form.AppField>

          <form.AppField name="code">{(field) => <field.TextField label="الكود" placeholder="كود المورد" />}</form.AppField>

          <form.AppField name="contactInfo">{(field) => <field.TextField label="معلومات الاتصال" placeholder="الهاتف أو البريد الإلكتروني" />}</form.AppField>

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
