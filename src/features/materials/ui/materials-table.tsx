import { Link, useSearch } from "@tanstack/react-router"
import { Edit, Eye, Trash2 } from "lucide-react"
import { Button } from "#/shared/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "#/shared/components/ui/table"
import { useMaterialsQuery } from "../hooks/use-materials"
import { Pagination } from "#/shared/components/ui/pagination"

export function MaterialsTable() {
  const s = useSearch({
    from: "/dashboard/materials/",
  })

  const { data: materials, isLoading } = useMaterialsQuery(s)

  if (!materials) return null
  if (materials.data.length === 0) return null

  return (
    <div className="overflow-hidden rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>الاسم</TableHead>
            <TableHead>السيريال</TableHead>
            <TableHead>التصنيف</TableHead>
            <TableHead>الوحدة</TableHead>
            <TableHead>سعر الوحدة</TableHead>
            <TableHead>نشط</TableHead>
            <TableHead className="w-28">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                جاري التحميل...
              </TableCell>
            </TableRow>
          ) : materials?.data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                لا توجد مواد
              </TableCell>
            </TableRow>
          ) : (
            materials.data.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">
                  <Link to="/dashboard/materials/$materialId/details" params={{ materialId: String(item.id) }} className="hover:underline text-primary font-semibold">
                    {item.name}
                  </Link>
                </TableCell>
                <TableCell>{item.sku}</TableCell>
                <TableCell>{item.category?.name}</TableCell>
                <TableCell>{item.unit?.name}</TableCell>
                <TableCell>{item.unitPrice}</TableCell>
                <TableCell>{item.isActive ? "نعم" : "لا"}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Link to="/dashboard/materials/$materialId/details" params={{ materialId: String(item.id) }}>
                      <Button type="button" variant="ghost" size="icon-sm" title="عرض التفاصيل الكاملة">
                        <Eye className="size-4 text-blue-600" />
                      </Button>
                    </Link>
                    <Button type="button" variant="ghost" size="icon-sm" aria-label="تعديل">
                      <Edit />
                    </Button>
                    <Button type="button" variant="ghost" size="icon-sm" aria-label="حذف">
                      <Trash2 />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <Pagination
        meta={materials?.meta}
        onPageChange={function (page: number): void {
          throw new Error("Function not implemented.")
        }}
        onPerPageChange={function (perPage: number): void {
          throw new Error("Function not implemented.")
        }}
      />
    </div>
  )
}
