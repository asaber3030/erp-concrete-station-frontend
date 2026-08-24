import type { Material } from "#/features/materials/model/types"
import type { Station } from "#/features/stations/model/types"
import { Button } from "#/shared/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "#/shared/components/ui/dialog"
import type { InventoryItem } from "../model/types"

type ViewInventoryModalProps = {
  inventory: InventoryItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
  materials: Material[]
  stations: Station[]
}

export function ViewInventoryModal({ inventory, open, onOpenChange, materials, stations }: ViewInventoryModalProps) {
  const matchedMaterial = materials.find((m) => String(m.id) === String(inventory?.materialId))
  const matchedStation = stations.find((s) => String(s.id) === String(inventory?.stationId))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>تفاصيل المخزون للمادة {matchedMaterial?.name || `#${inventory?.materialId}`}</DialogTitle>
          <DialogDescription>عرض الرصيد المتوفر، المحجوز، والصافي بالمحطة.</DialogDescription>
        </DialogHeader>

        {inventory && (
          <div className="grid gap-3 rounded-lg border bg-slate-50 p-4 text-sm">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-semibold text-muted-foreground">المحطة</span>
              <span className="font-medium">{matchedStation?.name || inventory.stationId}</span>
            </div>

            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-semibold text-muted-foreground">إجمالي الكمية الفعلية</span>
              <span className="text-base font-bold text-primary">{inventory.quantity}</span>
            </div>

            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-semibold text-muted-foreground">الكمية المحجوزة للمهمات</span>
              <span className="font-bold text-amber-600">{inventory.reservedQuantity ?? 0}</span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="font-semibold text-muted-foreground">الصافي المتاح للصرف</span>
              <span className="text-base font-bold text-green-700">{Math.max(0, inventory.quantity - (inventory.reservedQuantity ?? 0))}</span>
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
