import type { Invoice } from "#/features/invoices/model/types"
import type { Material } from "#/features/materials/model/types"
import type { Station } from "#/features/stations/model/types"
import type { Supplier } from "#/features/suppliers/model/types"
import { Button } from "#/shared/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "#/shared/components/ui/dialog"
import { useAppForm } from "#/shared/hooks/useAppForm"
import { useRecordAdjustmentMutation } from "../hooks/use-inventory"
import { recordAdjustmentSchema } from "../model/schema"

type RecordAdjustmentModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  materials: Material[]
  stations: Station[]
  suppliers: Supplier[]
  invoices: Invoice[]
}

export function RecordAdjustmentModal({ open, onOpenChange, materials, stations, suppliers, invoices }: RecordAdjustmentModalProps) {
  const adjustmentMutation = useRecordAdjustmentMutation()

  const form = useAppForm({
    defaultValues: {
      materialId: materials[0] ? String(materials[0].id) : "",
      stationId: stations[0] ? String(stations[0].id) : "",
      quantity: 0,
      type: "incoming" as "incoming" | "outgoing",
      referenceNumber: "",
      supplierId: "none",
      invoiceId: "none",
    },
    validators: {
      onSubmit: recordAdjustmentSchema,
    },
    onSubmit: ({ value }) => {
      const selectedSupplierId = value.supplierId && value.supplierId !== "none" ? value.supplierId : undefined
      const selectedInvoiceId = value.invoiceId && value.invoiceId !== "none" ? value.invoiceId : undefined

      adjustmentMutation.mutate(
        {
          materialId: value.materialId,
          stationId: value.stationId,
          quantity: Number(value.quantity),
          type: value.type,
          referenceNumber: value.referenceNumber,
          supplierId: selectedSupplierId,
          invoiceId: selectedInvoiceId,
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

  const materialOptions = materials.map((m) => ({ label: `${m.name} (${m.sku})`, value: String(m.id) }))
  const stationOptions = stations.map((s) => ({ label: `${s.name} (${s.code})`, value: String(s.id) }))
  const supplierOptions = [{ label: "بدون مورد", value: "none" }, ...suppliers.map((s) => ({ label: s.name, value: String(s.id) }))]
  const invoiceOptions = [{ label: "بدون فاتورة", value: "none" }, ...invoices.map((i) => ({ label: `${i.invoiceNumber} - ${i.partyName}`, value: String(i.id) }))]
  const typeOptions = [
    { label: "وارد (Incoming)", value: "incoming" },
    { label: "صادر (Outgoing)", value: "outgoing" },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>تسجيل تعديل مخزون</DialogTitle>
          <DialogDescription>أدخل تفاصيل الحركة لإضافتها إلى سجل المخزون.</DialogDescription>
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
          <form.AppField name="materialId">{(field) => <field.SelectField label="المادة" placeholder="اختر المادة" options={materialOptions} />}</form.AppField>

          <form.AppField name="stationId">{(field) => <field.SelectField label="المحطة" placeholder="اختر المحطة" options={stationOptions} />}</form.AppField>

          <form.AppField name="type">{(field) => <field.SelectField label="نوع الحركة" placeholder="اختر نوع الحركة" options={typeOptions} />}</form.AppField>

          <form.AppField name="quantity">{(field) => <field.NumberField label="الكمية" placeholder="0" />}</form.AppField>

          <form.AppField name="referenceNumber">{(field) => <field.TextField label="رقم المرجع" placeholder="رقم الفاتورة أو المرجع" />}</form.AppField>

          <form.AppField name="supplierId">{(field) => <field.SelectField label="المورد (اختياري)" placeholder="اختر المورد" options={supplierOptions} />}</form.AppField>

          <form.AppField name="invoiceId">{(field) => <field.SelectField label="الفاتورة (اختياري)" placeholder="اختر الفاتورة" options={invoiceOptions} />}</form.AppField>

          <DialogFooter className="mt-2">
            <form.AppForm>
              <form.SubmitButton label="حفظ" loading={adjustmentMutation.isPending} disabled={adjustmentMutation.isPending} />
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
