import type { Supplier } from "#/features/suppliers/model/types"
import { Button } from "#/shared/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "#/shared/components/ui/dialog"
import { useAppForm } from "#/shared/hooks/useAppForm"
import { useUpdateInvoiceMutation } from "../hooks/use-invoices"
import { updateInvoiceSchema } from "../model/schema"
import type { Invoice } from "../model/types"

type UpdateInvoiceModalProps = {
  invoice: Invoice | null
  open: boolean
  onOpenChange: (open: boolean) => void
  suppliers: Supplier[]
}

export function UpdateInvoiceModal({ invoice, open, onOpenChange, suppliers }: UpdateInvoiceModalProps) {
  const updateMutation = useUpdateInvoiceMutation()

  const form = useAppForm({
    defaultValues: {
      id: invoice?.id ?? "",
      invoiceNumber: invoice?.invoiceNumber ?? "",
      type: (invoice?.type ?? "purchase") as "purchase" | "sales",
      supplierId: invoice?.supplierId ? String(invoice.supplierId) : "none",
      partyName: invoice?.partyName ?? "",
      totalAmount: invoice?.totalAmount ?? 0,
    },
    validators: {
      onSubmit: updateInvoiceSchema,
    },
    onSubmit: ({ value }) => {
      if (!invoice) return
      const selectedSupplierId = value.supplierId && value.supplierId !== "none" ? value.supplierId : undefined

      updateMutation.mutate(
        {
          id: invoice.id,
          invoiceNumber: value.invoiceNumber,
          type: value.type,
          supplierId: selectedSupplierId,
          partyName: value.partyName,
          totalAmount: Number(value.totalAmount),
        },
        {
          onSuccess: () => {
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
          <DialogTitle>تعديل الفاتورة</DialogTitle>
          <DialogDescription>أدخل بيانات الفاتورة المعدلة ثم اضغط حفظ.</DialogDescription>
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
