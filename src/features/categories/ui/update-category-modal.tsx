import { Button } from "#/shared/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "#/shared/components/ui/dialog"
import { useAppForm } from "#/shared/hooks/useAppForm"
import { useUpdateCategoryMutation } from "../hooks/use-categories"
import { updateCategorySchema } from "../model/schema"
import type { Category } from "../model/types"

type UpdateCategoryModalProps = {
  category: Category | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UpdateCategoryModal({ category, open, onOpenChange }: UpdateCategoryModalProps) {
  const updateMutation = useUpdateCategoryMutation()

  const form = useAppForm({
    defaultValues: {
      id: category?.id ?? "",
      name: category?.name ?? "",
      code: category?.code ?? "",
      isActive: category?.isActive ?? true,
    },
    validators: {
      onSubmit: updateCategorySchema,
    },
    onSubmit: ({ value }) => {
      if (!category) return
      updateMutation.mutate(
        { ...value, id: category.id },
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
          <DialogTitle>تعديل التصنيف</DialogTitle>
          <DialogDescription>أدخل بيانات التصنيف المعدلة ثم اضغط حفظ.</DialogDescription>
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
