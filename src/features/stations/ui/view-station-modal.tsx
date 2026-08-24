import { Building2 } from "lucide-react"
import { Button } from "#/shared/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "#/shared/components/ui/dialog"
import type { Station } from "../model/types"

type ViewStationModalProps = {
  station: Station | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ViewStationModal({ station, open, onOpenChange }: ViewStationModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Building2 className="size-5 text-primary" />
            <DialogTitle>بيانات المحطة: {station?.name}</DialogTitle>
          </div>
          <DialogDescription>عرض تفاصيل محطة الخرسانة، كود المحطة، والموقع.</DialogDescription>
        </DialogHeader>

        {station && (
          <div className="grid gap-3 rounded-lg border bg-slate-50 p-4 text-sm">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-semibold text-muted-foreground">كود المحطة</span>
              <span className="font-mono text-xs font-bold">{station.code}</span>
            </div>

            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-semibold text-muted-foreground">اسم المحطة</span>
              <span className="font-medium">{station.name}</span>
            </div>

            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-semibold text-muted-foreground">الموقع الجغرافي / العنوان</span>
              <span className="font-medium">{station.location || "غير محدد"}</span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="font-semibold text-muted-foreground">حالة التشغيل</span>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${station.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                {station.isActive ? "محطة تعمل (نشطة)" : "محطة متوقفة (غير نشطة)"}
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
