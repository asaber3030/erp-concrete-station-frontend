import { CheckCircle, FileText } from "lucide-react"
import type { Supplier } from "#/features/suppliers/model/types"
import { Button } from "#/shared/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "#/shared/components/ui/dialog"
import type { Invoice } from "../model/types"

type ViewInvoiceModalProps = {
  invoice: Invoice | null
  open: boolean
  onOpenChange: (open: boolean) => void
  suppliers: Supplier[]
  onIssue?: (id: string | number) => void
}

export function ViewInvoiceModal({ invoice, open, onOpenChange, suppliers, onIssue }: ViewInvoiceModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <FileText className="size-5 text-primary" />
            <DialogTitle>تفاصيل الفاتورة: {invoice?.invoiceNumber}</DialogTitle>
          </div>
          <DialogDescription>عرض شامل للعملية والبيانات المالية للفاتورة.</DialogDescription>
        </DialogHeader>

        {invoice && (
          <div className="grid gap-3 rounded-lg border bg-slate-50 p-4 text-sm">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-semibold text-muted-foreground">حالة الفاتورة</span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  invoice.status === "issued" || invoice.status === "paid" ? "bg-green-100 text-green-800" : invoice.status === "cancelled" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"
                }`}
              >
                {invoice.status === "draft" ? "مسودة" : invoice.status === "issued" ? "مصدرة" : invoice.status === "paid" ? "مدفوعة" : "ملغاة"}
              </span>
            </div>

            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-semibold text-muted-foreground">نوع العملية</span>
              <span className="font-medium">{invoice.type === "purchase" ? "فاتورة مشتريات" : "فاتورة مبيعات"}</span>
            </div>

            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-semibold text-muted-foreground">الطرف / المورد</span>
              <span className="font-medium">{invoice.partyName}</span>
            </div>

            {invoice.supplierId && (
              <div className="flex items-center justify-between border-b pb-2">
                <span className="font-semibold text-muted-foreground">المورد (Supplier)</span>
                <span className="font-medium">{suppliers.find((s) => String(s.id) === String(invoice.supplierId))?.name || invoice.supplierId}</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-1 text-base font-bold">
              <span>المبلغ الإجمالي</span>
              <span className="text-primary">{invoice.totalAmount.toLocaleString("ar-EG")} ج.م</span>
            </div>
          </div>
        )}

        <DialogFooter className="gap-2">
          {invoice?.status === "draft" && onIssue && (
            <Button
              type="button"
              className="bg-green-600 hover:bg-green-700"
              onClick={() => {
                onIssue(invoice.id)
                onOpenChange(false)
              }}
            >
              <CheckCircle className="ml-1 size-4" />
              إصدار الفاتورة الآن
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
