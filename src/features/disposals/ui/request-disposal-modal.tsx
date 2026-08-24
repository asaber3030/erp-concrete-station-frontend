import type { Material } from "#/features/materials/model/types"
import type { Station } from "#/features/stations/model/types"
import { Button } from "#/shared/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "#/shared/components/ui/dialog"
import { useAppForm } from "#/shared/hooks/useAppForm"
import { useRequestDisposalMutation } from "../hooks/use-disposals"
import { requestDisposalSchema } from "../model/schema"

type RequestDisposalModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  materials: Material[]
  stations: Station[]
}

export function RequestDisposalModal({ open, onOpenChange, materials, stations }: RequestDisposalModalProps) {
  const requestMutation = useRequestDisposalMutation()

  const form = useAppForm({
    defaultValues: {
      materialId: materials[0] ? String(materials[0].id) : "",
      stationId: stations[0] ? String(stations[0].id) : "",
      quantity: 0,
      reason: "",
    },
    validators: {
      onSubmit: requestDisposalSchema,
    },
    onSubmit: ({ value }) => {
      requestMutation.mutate(
        {
          materialId: value.materialId,
          stationId: value.stationId,
          quantity: Number(value.quantity),
          reason: value.reason || undefined,
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>تقديم طلب إهلاك مادة</DialogTitle>
          <DialogDescription>أدخل البيانات المطلوبة لإرسال طلب الإهلاك.</DialogDescription>
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

          <form.AppField name="quantity">{(field) => <field.NumberField label="الكمية" placeholder="0" />}</form.AppField>

          <form.AppField name="reason">{(field) => <field.TextField label="سبب الإهلاك" placeholder="تلف أثناء النقل، انتهاء صلاحية، إلخ." />}</form.AppField>

          <DialogFooter className="mt-2">
            <form.AppForm>
              <form.SubmitButton label="إرسال الطلب" loading={requestMutation.isPending} disabled={requestMutation.isPending} />
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
