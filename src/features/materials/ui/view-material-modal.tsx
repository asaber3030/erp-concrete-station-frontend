import { Box } from "lucide-react"
import type { Category } from "#/features/categories/model/types"
import type { Unit } from "#/features/units/model/types"
import { Button } from "#/shared/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "#/shared/components/ui/dialog"
import type { Material } from "../model/types"

type ViewMaterialModalProps = {
  material: Material | null
  open: boolean
  onOpenChange: (open: boolean) => void
  categories: Category[]
  units: Unit[]
}

export function ViewMaterialModal({ material, open, onOpenChange, categories, units }: ViewMaterialModalProps) {
  const categoryName = categories.find((c) => String(c.id) === String(material?.categoryId))?.name
  const unitSymbol = units.find((u) => String(u.id) === String(material?.unitId))?.symbol

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Box className="size-5 text-primary" />
            <DialogTitle>بيانات المادة: {material?.name}</DialogTitle>
          </div>
          <DialogDescription>عرض تفاصيل المادة، الرمز SKU، والحد الأدنى لإعادة الطلب.</DialogDescription>
        </DialogHeader>

        {material && (
          <div className="grid gap-3 rounded-lg border bg-slate-50 p-4 text-sm">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-semibold text-muted-foreground">رمز SKU</span>
              <span className="font-mono text-xs font-bold">{material.sku}</span>
            </div>

            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-semibold text-muted-foreground">اسم المادة</span>
              <span className="font-medium">{material.name}</span>
            </div>

            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-semibold text-muted-foreground">التصنيف</span>
              <span className="font-medium">{categoryName || material.categoryId || "غير محدد"}</span>
            </div>

            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-semibold text-muted-foreground">الوحدة</span>
              <span className="font-medium">{unitSymbol || material.unitId || "غير محدد"}</span>
            </div>

            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-semibold text-muted-foreground">حد إعادة الطلب (Reorder Level)</span>
              <span className="font-bold text-amber-700">{material.reorderLevel ?? 0}</span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="font-semibold text-muted-foreground">حالة المادة</span>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${material.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                {material.isActive ? "مادة نشطة" : "مادة غير نشطة"}
              </span>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            إغلاق
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
