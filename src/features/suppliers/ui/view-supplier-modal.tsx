import { UserCheck } from "lucide-react"
import { Button } from "#/shared/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "#/shared/components/ui/dialog"
import type { Supplier } from "../model/types"

type ViewSupplierModalProps = {
  supplier: Supplier | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ViewSupplierModal({ supplier, open, onOpenChange }: ViewSupplierModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <UserCheck className="size-5 text-primary" />
            <DialogTitle>بيانات المورد: {supplier?.name}</DialogTitle>
          </div>
          <DialogDescription>عرض تفاصيل المورد وكود التعريف ومعلومات التواصل.</DialogDescription>
        </DialogHeader>

        {supplier && (
          <div className="grid gap-3 rounded-lg border bg-slate-50 p-4 text-sm">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-semibold text-muted-foreground">كود المورد</span>
              <span className="font-mono text-xs font-bold">{supplier.code}</span>
            </div>

            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-semibold text-muted-foreground">اسم الشركة / المورد</span>
              <span className="font-medium">{supplier.name}</span>
            </div>

            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-semibold text-muted-foreground">حالة الحساب</span>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${supplier.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                {supplier.isActive ? "حساب نشط" : "حساب معطل"}
              </span>
            </div>

            <div className="grid gap-1 pt-1">
              <span className="font-semibold text-muted-foreground">معلومات الاتصال والتواصل</span>
              <p className="rounded bg-white p-2.5 text-xs font-medium border text-slate-800">{supplier.contactInfo || "لا تتوفر معلومات اتصال مدوّنة"}</p>
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
