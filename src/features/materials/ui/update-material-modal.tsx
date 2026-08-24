import type { Category } from "#/features/categories/model/types"
import type { Unit } from "#/features/units/model/types"
import { Button } from "#/shared/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "#/shared/components/ui/dialog"
import { useAppForm } from "#/shared/hooks/useAppForm"
import { useUpdateMaterialMutation } from "../hooks/use-materials"
import { updateMaterialSchema } from "../model/schema"
import type { Material } from "../model/types"

type UpdateMaterialModalProps = {
  material: Material
  open: boolean
  onOpenChange: (open: boolean) => void
  categories: Category[]
  units: Unit[]
}

export function UpdateMaterialModal({ material, open, onOpenChange, categories, units }: UpdateMaterialModalProps) {
  const updateMutation = useUpdateMaterialMutation()

  const defaultCatId = material.categoryId
  const defaultUnitId = material.unitId

  const form = useAppForm({
    defaultValues: {
      name: material.name,
      sku: material.sku,
      categoryId: defaultCatId,
      unitId: defaultUnitId,
      unitPrice: material.unitPrice,
      isActive: material.isActive,
    },
    validators: {
      onSubmit: updateMaterialSchema,
    },
    onSubmit: ({ value }) => {
      const payload = {
        id: material.id,
        name: value.name,
        sku: value.sku,
        categoryId: Number(value.categoryId),
        unitId: Number(value.unitId),
        unitPrice: Number(value.unitPrice),
        isActive: value.isActive,
      }

      updateMutation.mutate(payload, {
        onSuccess: () => {
          onOpenChange(false)
        },
      })
    },
  })

  const categoryOptions = [{ label: "بدون تصنيف", value: "none" }, ...categories.map((c) => ({ label: `${c.name} (${c.code})`, value: String(c.id) }))]
  const unitOptions = [{ label: "بدون وحدة", value: "none" }, ...units.map((u) => ({ label: `${u.name} (${u.symbol})`, value: String(u.id) }))]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>تعديل بيانات المادة</DialogTitle>
          <DialogDescription>أدخل بيانات المادة المعدلة ثم اضغط حفظ.</DialogDescription>
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
          <form.AppField name="name">{(field) => <field.TextField label="اسم المادة" placeholder="اسم المادة" />}</form.AppField>

          <form.AppField name="sku">{(field) => <field.TextField label="رمز SKU" placeholder="رمز SKU" />}</form.AppField>

          <form.AppField name="categoryId">{(field) => <field.SelectField label="التصنيف" placeholder="اختر التصنيف" options={categoryOptions} />}</form.AppField>

          <form.AppField name="unitId">{(field) => <field.SelectField label="الوحدة" placeholder="اختر الوحدة" options={unitOptions} />}</form.AppField>

          <form.AppField name="unitPrice">{(field) => <field.NumberField label="سعر الوحدة" placeholder="0" />}</form.AppField>

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
