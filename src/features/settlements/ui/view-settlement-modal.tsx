import type { Material } from "#/features/materials/model/types"
import type { Station } from "#/features/stations/model/types"
import { Button } from "#/shared/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "#/shared/components/ui/dialog"
import type { Settlement } from "../model/types"

type ViewSettlementModalProps = {
  settlement: Settlement | null
  open: boolean
  onOpenChange: (open: boolean) => void
  materials: Material[]
  stations: Station[]
}

export function ViewSettlementModal({ settlement, open, onOpenChange, materials, stations }: ViewSettlementModalProps) {
  const matchedMaterial = materials.find((m) => String(m.id) === String(settlement?.materialId))
  const matchedStation = stations.find((s) => String(s.id) === String(settlement?.stationId))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>تفاصيل تسوية الجرد #{settlement?.id}</DialogTitle>
          <DialogDescription>عرض شامل لمقارنة الكميات وسبب إجراء التسوية.</DialogDescription>
        </DialogHeader>

        {settlement && (
          <div className="grid gap-3 rounded-lg border bg-slate-50 p-4 text-sm">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-semibold text-muted-foreground">نوع التسوية</span>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${settlement.type === "positive" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                {settlement.type === "positive" ? "تسوية موجبة (زيادة في الجرد)" : "تسوية سالبة (نقص في الجرد)"}
              </span>
            </div>

            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-semibold text-muted-foreground">المادة</span>
              <span className="font-medium">{matchedMaterial?.name || settlement.materialId}</span>
            </div>

            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-semibold text-muted-foreground">المحطة</span>
              <span className="font-medium">{matchedStation?.name || settlement.stationId}</span>
            </div>

            <div className="grid grid-cols-3 gap-2 border-b pb-3 pt-1 text-center">
              <div className="rounded bg-white p-2 border">
                <p className="text-xs text-muted-foreground">الكمية السابقة</p>
                <p className="mt-1 font-bold text-slate-700">{settlement.previousQty}</p>
              </div>
              <div className="rounded bg-white p-2 border">
                <p className="text-xs text-muted-foreground">الفارق (الفرقية)</p>
                <p className={`mt-1 font-bold ${settlement.type === "positive" ? "text-green-600" : "text-red-600"}`}>
                  {settlement.type === "positive" ? `+${settlement.quantity}` : `-${settlement.quantity}`}
                </p>
              </div>
              <div className="rounded bg-white p-2 border">
                <p className="text-xs text-muted-foreground">الكمية الجديدة</p>
                <p className="mt-1 font-bold text-blue-600">{settlement.newQty}</p>
              </div>
            </div>

            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-semibold text-muted-foreground">المستخدم المسؤول (User ID)</span>
              <span className="font-mono text-xs">{settlement.createdById}</span>
            </div>

            <div className="grid gap-1">
              <span className="font-semibold text-muted-foreground">سبب التسوية</span>
              <p className="rounded bg-white p-2.5 text-xs font-normal text-slate-800 border">{settlement.reason || "لا يوجد سبب مدوّن"}</p>
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
