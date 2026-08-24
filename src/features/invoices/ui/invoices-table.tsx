import { CheckCircle, Edit, Eye, Trash2 } from "lucide-react"
import { Button } from "#/shared/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "#/shared/components/ui/table"
import type { Invoice } from "../model/types"

type InvoicesTableProps = {
  invoices: Invoice[]
  isLoading?: boolean
  isIssuePending: boolean
  onView: (invoice: Invoice) => void
  onEdit: (invoice: Invoice) => void
  onDelete: (invoice: Invoice) => void
  onIssue: (id: string | number) => void
}

export function InvoicesTable({ invoices, isLoading, isIssuePending, onView, onEdit, onDelete, onIssue }: InvoicesTableProps) {
  return (
    <div className="overflow-hidden rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>رقم الفاتورة</TableHead>
            <TableHead>النوع</TableHead>
            <TableHead>الطرف / المورد</TableHead>
            <TableHead>الإجمالي</TableHead>
            <TableHead>الحالة</TableHead>
            <TableHead className="w-36">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                جاري التحميل...
              </TableCell>
            </TableRow>
          ) : invoices.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                لا توجد فواتير
              </TableCell>
            </TableRow>
          ) : (
            invoices.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.invoiceNumber}</TableCell>
                <TableCell>{item.type === "purchase" ? "مشتريات" : "مبيعات"}</TableCell>
                <TableCell>{item.partyName}</TableCell>
                <TableCell>{item.totalAmount.toLocaleString("ar-EG")} ج.م</TableCell>
                <TableCell>
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
                      item.status === "issued" || item.status === "paid" ? "bg-green-100 text-green-800" : item.status === "cancelled" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {item.status === "draft" ? "مسودة" : item.status === "issued" ? "مصدرة" : item.status === "paid" ? "مدفوعة" : "ملغاة"}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button type="button" variant="ghost" size="icon-sm" onClick={() => onView(item)} aria-label="عرض التفاصيل" title="عرض التفاصيل">
                      <Eye className="size-4 text-blue-600" />
                    </Button>
                    {item.status === "draft" && (
                      <Button type="button" variant="ghost" size="icon-sm" onClick={() => onIssue(item.id)} aria-label="إصدار" title="إصدار الفاتورة" disabled={isIssuePending}>
                        <CheckCircle className="size-4 text-green-600" />
                      </Button>
                    )}
                    <Button type="button" variant="ghost" size="icon-sm" onClick={() => onEdit(item)} aria-label="تعديل">
                      <Edit />
                    </Button>
                    <Button type="button" variant="ghost" size="icon-sm" onClick={() => onDelete(item)} aria-label="حذف">
                      <Trash2 />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
