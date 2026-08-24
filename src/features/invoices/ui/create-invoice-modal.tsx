import type { Supplier } from "#/features/suppliers/model/types"
import { Button } from "#/shared/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "#/shared/components/ui/dialog"
import { useAppForm } from "#/shared/hooks/useAppForm"
import { useCreateInvoiceMutation } from "../hooks/use-invoices"
import { createInvoiceSchema } from "../model/schema"

type CreateInvoiceModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  suppliers: Supplier[]
}

export function CreateInvoiceModal({ open, onOpenChange, suppliers }: CreateInvoiceModalProps) {
  const createMutation = useCreateInvoiceMutation()

  const form = useAppForm({
    defaultValues: {
      invoiceNumber: "",
      type: "purchase" as "purchase" | "sales",
      supplierId: "none",
      partyName: "",
      totalAmount: 0,
    },
    validators: {
      onSubmit: createInvoiceSchema,
    },
    onSubmit: ({ value }) => {
      const selectedSupplierId = value.supplierId && value.supplierId !== "none" ? value.supplierId : undefined

      createMutation.mutate(
        {
          invoiceNumber: value.invoiceNumber,
          type: value.type,
          supplierId: selectedSupplierId,
          partyName: value.partyName,
          totalAmount: Number(value.totalAmount),
        },
        {
          onSuccess: () => {
            form.reset()
            onOpenChange(false)
          },
        },
      )
    },
  })

  const supplierOptions = [{ label: "بدون مورد", value: "none" }, ...suppliers.map((s) => ({ label: s.name, value: String(s.id) }))]
  const typeOptions = [
    { label: "مشتريات", value: "purchase" },
    { label: "مبيعات", value: "sales" },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>إضافة فاتورة جديدة</DialogTitle>
          <DialogDescription>أدخل بيانات الفاتورة ثم اضغط حفظ.</DialogDescription>
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
          <form.AppField name="invoiceNumber">{(field) => <field.TextField label="رقم الفاتورة" placeholder="INV-001" />}</form.AppField>

          <form.AppField name="type">{(field) => <field.SelectField label="نوع الفاتورة" placeholder="اختر النوع" options={typeOptions} />}</form.AppField>

          <form.AppField name="partyName">{(field) => <field.TextField label="اسم الطرف / العميل" placeholder="اسم الطرف" />}</form.AppField>

          <form.AppField name="supplierId">{(field) => <field.SelectField label="المورد (اختياري)" placeholder="اختر المورد" options={supplierOptions} />}</form.AppField>

          <form.AppField name="totalAmount">{(field) => <field.NumberField label="الإجمالي" placeholder="0" />}</form.AppField>

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
