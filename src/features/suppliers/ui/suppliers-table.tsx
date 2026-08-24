import { Edit, Eye, Trash2 } from "lucide-react"
import { Button } from "#/shared/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "#/shared/components/ui/table"
import type { Supplier } from "../model/types"

type SuppliersTableProps = {
  suppliers: Supplier[]
  isLoading?: boolean
  onView?: (supplier: Supplier) => void
  onEdit: (supplier: Supplier) => void
  onDelete: (supplier: Supplier) => void
}

export function SuppliersTable({ suppliers, isLoading, onView, onEdit, onDelete }: SuppliersTableProps) {
  return (
    <div className="overflow-hidden rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>الاسم</TableHead>
            <TableHead>الكود</TableHead>
            <TableHead>معلومات الاتصال</TableHead>
            <TableHead>نشط</TableHead>
            <TableHead className="w-28">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                جاري التحميل...
              </TableCell>
            </TableRow>
          ) : suppliers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                لا يوجد موردون
              </TableCell>
            </TableRow>
          ) : (
            suppliers.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.code}</TableCell>
                <TableCell>{item.contactInfo || "-"}</TableCell>
                <TableCell>{item.isActive ? "نعم" : "لا"}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {onView && (
                      <Button type="button" variant="ghost" size="icon-sm" onClick={() => onView(item)} title="عرض التفاصيل">
                        <Eye className="size-4 text-blue-600" />
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
