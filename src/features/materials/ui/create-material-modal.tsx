import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "#/shared/components/ui/dialog"
import { Button } from "#/shared/components/ui/button"

import { useCreateMaterialMutation } from "../hooks/use-materials"
import { useCategoriesQuery } from "#/features/categories/hooks/use-categories"
import { useUnitsQuery } from "#/features/units/hooks/use-units"
import { useAppForm } from "#/shared/hooks/useAppForm"
import { useState } from "react"

import { createMaterialSchema } from "../model/schema"
import { Plus } from "lucide-react"

export function CreateMaterialModal() {
  const { data: categories } = useCategoriesQuery()
  const { data: units } = useUnitsQuery()

  const [open, setOpen] = useState(false)

  const createMutation = useCreateMaterialMutation()

  const form = useAppForm({
    defaultValues: {
      name: "",
      sku: "",
      categoryId: 0,
      unitId: 0,
      unitPrice: 0,
      isActive: true,
    },
    validators: {
      onSubmit: createMaterialSchema,
    },
    onSubmit: ({ value }) => {
      const payload = {
        name: value.name,
        sku: value.sku,
        categoryId: value.categoryId,
        unitId: value.unitId,
        unitPrice: Number(value.unitPrice),
        isActive: value.isActive,
      }

      createMutation.mutate(payload, {
        onSuccess: () => {
          form.reset()
          setOpen(false)
        },
      })
    },
  })

  const categoryOptions = [{ label: "بدون تصنيف", value: "none" }, ...(categories?.data?.map((c) => ({ label: `${c.name} (${c.code})`, value: String(c.id) })) ?? [])]
  const unitOptions = [{ label: "بدون وحدة", value: "none" }, ...(units?.data?.map((u) => ({ label: `${u.name} (${u.symbol})`, value: String(u.id) })) ?? [])]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogTrigger asChild>
          <Button type="button">
            <Plus />
            إضافة مادة
          </Button>
        </DialogTrigger>
        <DialogHeader>
          <DialogTitle>إضافة مادة جديدة</DialogTitle>
          <DialogDescription>أدخل بيانات المادة ثم اضغط حفظ.</DialogDescription>
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
              <form.SubmitButton label="حفظ" loading={createMutation.isPending} disabled={createMutation.isPending} />
            </form.AppForm>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              إلغاء
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
