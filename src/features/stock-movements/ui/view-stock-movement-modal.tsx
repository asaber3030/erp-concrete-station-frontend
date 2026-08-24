import { ArrowDownLeft, ArrowUpRight } from "lucide-react"
import type { Material } from "#/features/materials/model/types"
import type { Station } from "#/features/stations/model/types"
import { Button } from "#/shared/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "#/shared/components/ui/dialog"
import type { StockMovement } from "../model/types"

type ViewStockMovementModalProps = {
  movement: StockMovement | null
  open: boolean
  onOpenChange: (open: boolean) => void
  materials: Material[]
  stations: Station[]
}

export function ViewStockMovementModal({ movement, open, onOpenChange, materials, stations }: ViewStockMovementModalProps) {
  const matchedMaterial = materials.find((m) => String(m.id) === String(movement?.materialId))
  const matchedStation = stations.find((s) => String(s.id) === String(movement?.stationId))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>تفاصيل حركة المخزون #{movement?.id}</DialogTitle>
          <DialogDescription>عرض شامل لبيانات حركة الوارد / الصادر والمرجع.</DialogDescription>
        </DialogHeader>

        {movement && (
          <div className="grid gap-3 rounded-lg border bg-slate-50 p-4 text-sm">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-semibold text-muted-foreground">نوع الحركة</span>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${movement.type === "incoming" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}
              >
                {movement.type === "incoming" ? <ArrowDownLeft className="size-3" /> : <ArrowUpRight className="size-3" />}
                {movement.type === "incoming" ? "حركة واردة (إضافة للمخزون)" : "حركة صادرة (خصم من المخزون)"}
              </span>
            </div>

            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-semibold text-muted-foreground">المادة</span>
              <span className="font-medium">{matchedMaterial?.name || movement.materialId}</span>
            </div>

            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-semibold text-muted-foreground">المحطة</span>
              <span className="font-medium">{matchedStation?.name || movement.stationId}</span>
            </div>

            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-semibold text-muted-foreground">الكمية المتحركة</span>
              <span className="text-base font-bold text-primary">{movement.quantity}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-semibold text-muted-foreground">رقم المرجع / الفاتورة</span>
              <span className="font-mono text-xs font-medium">{movement.referenceNumber || "غير محدد"}</span>
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
