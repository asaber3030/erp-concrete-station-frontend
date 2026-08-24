import { CheckCircle } from "lucide-react"
import type { Material } from "#/features/materials/model/types"
import type { Station } from "#/features/stations/model/types"
import { Button } from "#/shared/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "#/shared/components/ui/dialog"
import type { Disposal } from "../model/types"

type ViewDisposalModalProps = {
  disposal: Disposal | null
  open: boolean
  onOpenChange: (open: boolean) => void
  materials: Material[]
  stations: Station[]
  onApprove?: (id: string | number) => void
}

export function ViewDisposalModal({ disposal, open, onOpenChange, materials, stations, onApprove }: ViewDisposalModalProps) {
  const matchedMaterial = materials.find((m) => String(m.id) === String(disposal?.materialId))
  const matchedStation = stations.find((s) => String(s.id) === String(disposal?.stationId))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>تفاصيل طلب الإهلاك #{disposal?.id}</DialogTitle>
          <DialogDescription>عرض حالة طلب الإهلاك والمادة وتبرير التألف.</DialogDescription>
        </DialogHeader>

        {disposal && (
          <div className="grid gap-3 rounded-lg border bg-slate-50 p-4 text-sm">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-semibold text-muted-foreground">حالة الطلب</span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  disposal.status === "approved" ? "bg-green-100 text-green-800" : disposal.status === "rejected" ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"
                }`}
              >
                {disposal.status === "approved" ? "معتمد" : disposal.status === "rejected" ? "مرفوض" : "قيد الانتظار والاعتماد"}
              </span>
            </div>

            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-semibold text-muted-foreground">المادة</span>
              <span className="font-medium">{matchedMaterial?.name || disposal.materialId}</span>
            </div>

            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-semibold text-muted-foreground">المحطة</span>
              <span className="font-medium">{matchedStation?.name || disposal.stationId}</span>
            </div>

            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-semibold text-muted-foreground">الكمية التالفة</span>
              <span className="text-base font-bold text-red-600">{disposal.quantity}</span>
            </div>

            <div className="grid gap-1">
              <span className="font-semibold text-muted-foreground">سبب الإهلاك والتألف</span>
              <p className="rounded bg-white p-2.5 text-xs font-normal text-slate-800 border">{disposal.reason || "لا يوجد سبب مدوّن"}</p>
            </div>
          </div>
        )}

        <DialogFooter className="gap-2">
          {disposal?.status === "pending" && onApprove && (
            <Button
              type="button"
              className="bg-green-600 hover:bg-green-700"
              onClick={() => {
                onApprove(disposal.id)
                onOpenChange(false)
              }}
            >
              <CheckCircle className="ml-1 size-4" />
              اعتماد الإهلاك
            </Button>
          )}
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            إغلاق
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
