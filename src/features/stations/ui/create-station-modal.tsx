import { Button } from "#/shared/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "#/shared/components/ui/dialog"
import { useAppForm } from "#/shared/hooks/useAppForm"
import { useCreateStationMutation } from "../hooks/use-stations"
import { createStationSchema } from "../model/schema"

type CreateStationModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateStationModal({ open, onOpenChange }: CreateStationModalProps) {
  const createMutation = useCreateStationMutation()

  const form = useAppForm({
    defaultValues: {
      name: "",
      code: "",
      location: "",
      isActive: true,
    },
    validators: {
      onSubmit: createStationSchema,
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
          <DialogTitle>إضافة محطة جديدة</DialogTitle>
          <DialogDescription>أدخل بيانات المحطة ثم اضغط حفظ.</DialogDescription>
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
