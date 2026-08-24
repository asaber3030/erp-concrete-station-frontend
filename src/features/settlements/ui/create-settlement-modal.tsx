import type { Material } from "#/features/materials/model/types"
import type { Station } from "#/features/stations/model/types"
import { Button } from "#/shared/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "#/shared/components/ui/dialog"
import { useAppForm } from "#/shared/hooks/useAppForm"
import { useCreateSettlementMutation } from "../hooks/use-settlements"
import { createSettlementSchema } from "../model/schema"

type CreateSettlementModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  materials: Material[]
  stations: Station[]
}

export function CreateSettlementModal({ open, onOpenChange, materials, stations }: CreateSettlementModalProps) {
  const createMutation = useCreateSettlementMutation()

  const form = useAppForm({
    defaultValues: {
      materialId: materials[0] ? String(materials[0].id) : "",
      stationId: stations[0] ? String(stations[0].id) : "",
      type: "positive" as "positive" | "negative",
      quantity: 0,
      previousQty: 0,
      newQty: 0,
      reason: "",
    },
    validators: {
      onSubmit: createSettlementSchema,
    },
    onSubmit: ({ value }) => {
      createMutation.mutate(
        {
          materialId: value.materialId,
          stationId: value.stationId,
          createdById: 1,
          type: value.type,
          quantity: Number(value.quantity),
          previousQty: Number(value.previousQty),
          newQty: Number(value.newQty),
          reason: value.reason,
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
  const typeOptions = [
    { label: "موجبة (Positive)", value: "positive" },
    { label: "سالبة (Negative)", value: "negative" },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>إضافة تسوية جديدة</DialogTitle>
          <DialogDescription>أدخل تفاصيل تسوية الجرد ثم اضغط حفظ.</DialogDescription>
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

          <form.AppField name="type">{(field) => <field.SelectField label="نوع التسوية" placeholder="اختر النوع" options={typeOptions} />}</form.AppField>

          <form.AppField name="quantity">{(field) => <field.NumberField label="كمية التسوية" placeholder="0" />}</form.AppField>

          <form.AppField name="previousQty">{(field) => <field.NumberField label="الكمية السابقة" placeholder="0" />}</form.AppField>

          <form.AppField name="newQty">{(field) => <field.NumberField label="الكمية الجديدة" placeholder="0" />}</form.AppField>

          <form.AppField name="reason">{(field) => <field.TextField label="السبب" placeholder="سبب فرق الجرد..." />}</form.AppField>

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
