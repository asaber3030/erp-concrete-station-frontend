import { Button } from "#/shared/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "#/shared/components/ui/dialog"
import { useAppForm } from "#/shared/hooks/useAppForm"
import { useCreateCategoryMutation } from "../hooks/use-categories"
import { createCategorySchema } from "../model/schema"

type CreateCategoryModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateCategoryModal({ open, onOpenChange }: CreateCategoryModalProps) {
  const createMutation = useCreateCategoryMutation()

  const form = useAppForm({
    defaultValues: {
      name: "",
      code: "",
      isActive: true,
    },
    validators: {
      onSubmit: createCategorySchema,
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
          <DialogTitle>إضافة تصنيف جديد</DialogTitle>
          <DialogDescription>أدخل بيانات التصنيف ثم اضغط حفظ.</DialogDescription>
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
          <form.AppField name="name">{(field) => <field.TextField label="اسم التصنيف" placeholder="اسم التصنيف" />}</form.AppField>

          <form.AppField name="code">{(field) => <field.TextField label="الكود" placeholder="كود التصنيف" />}</form.AppField>

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
