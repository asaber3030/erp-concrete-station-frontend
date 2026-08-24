import { Button } from "#/shared/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "#/shared/components/ui/dialog"
import { useAppForm } from "#/shared/hooks/useAppForm"
import { useUpdateStationMutation } from "../hooks/use-stations"
import { updateStationSchema } from "../model/schema"
import type { Station } from "../model/types"

type UpdateStationModalProps = {
  station: Station | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UpdateStationModal({ station, open, onOpenChange }: UpdateStationModalProps) {
  const updateMutation = useUpdateStationMutation()

  const form = useAppForm({
    defaultValues: {
      id: station?.id ?? "",
      name: station?.name ?? "",
      code: station?.code ?? "",
      location: station?.location ?? "",
      isActive: station?.isActive ?? true,
    },
    validators: {
      onSubmit: updateStationSchema,
    },
    onSubmit: ({ value }) => {
      if (!station) return
      updateMutation.mutate(
        { ...value, id: station.id },
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
          <DialogTitle>تعديل بيانات المحطة</DialogTitle>
          <DialogDescription>أدخل بيانات المحطة المعدلة ثم اضغط حفظ.</DialogDescription>
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
          <form.AppField name="name">{(field) => <field.TextField label="اسم المحطة" placeholder="اسم المحطة" />}</form.AppField>

          <form.AppField name="code">{(field) => <field.TextField label="الكود" placeholder="كود المحطة" />}</form.AppField>

          <form.AppField name="location">{(field) => <field.TextField label="الموقع" placeholder="موقع المحطة" />}</form.AppField>

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
