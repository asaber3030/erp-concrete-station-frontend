import { Button } from "#/shared/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "#/shared/components/ui/dialog"
import { useAppForm } from "#/shared/hooks/useAppForm"
import { useUpdateSupplierMutation } from "../hooks/use-suppliers"
import { updateSupplierSchema } from "../model/schema"
import type { Supplier } from "../model/types"

type UpdateSupplierModalProps = {
  supplier: Supplier | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UpdateSupplierModal({ supplier, open, onOpenChange }: UpdateSupplierModalProps) {
  const updateMutation = useUpdateSupplierMutation()

  const form = useAppForm({
    defaultValues: {
      id: supplier?.id ?? "",
      name: supplier?.name ?? "",
      code: supplier?.code ?? "",
      contactInfo: supplier?.contactInfo ?? "",
      isActive: supplier?.isActive ?? true,
    },
    validators: {
      onSubmit: updateSupplierSchema,
    },
    onSubmit: ({ value }) => {
      if (!supplier) return
      updateMutation.mutate(
        { ...value, id: supplier.id },
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
          <DialogTitle>تعديل بيانات المورد</DialogTitle>
          <DialogDescription>أدخل بيانات المورد المعدلة ثم اضغط حفظ.</DialogDescription>
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
