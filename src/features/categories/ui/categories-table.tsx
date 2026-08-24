import { Edit, Trash2 } from "lucide-react"
import { Button } from "#/shared/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "#/shared/components/ui/table"
import type { Category } from "../model/types"

type CategoriesTableProps = {
  categories: Category[]
  isLoading?: boolean
  onEdit: (category: Category) => void
  onDelete: (category: Category) => void
}

export function CategoriesTable({ categories, isLoading, onEdit, onDelete }: CategoriesTableProps) {
  return (
    <div className="overflow-hidden rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>الاسم</TableHead>
            <TableHead>الكود</TableHead>
            <TableHead>نشط</TableHead>
            <TableHead className="w-28">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                جاري التحميل...
              </TableCell>
            </TableRow>
          ) : categories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                لا توجد تصنيفات
              </TableCell>
            </TableRow>
          ) : (
            categories.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.code}</TableCell>
                <TableCell>{item.isActive ? "نعم" : "لا"}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
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
