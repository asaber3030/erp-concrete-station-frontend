import { Link } from "@tanstack/react-router"
import { Edit, Eye, Trash2 } from "lucide-react"
import { Button } from "#/shared/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "#/shared/components/ui/table"
import type { Station } from "../model/types"

type StationsTableProps = {
  stations: Station[]
  isLoading?: boolean
  onView?: (station: Station) => void
  onEdit: (station: Station) => void
  onDelete: (station: Station) => void
}

export function StationsTable({ stations, isLoading, onView, onEdit, onDelete }: StationsTableProps) {
  return (
    <div className="overflow-hidden rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>الاسم</TableHead>
            <TableHead>الكود</TableHead>
            <TableHead>الموقع</TableHead>
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
          ) : stations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                لا توجد محطات
              </TableCell>
            </TableRow>
          ) : (
            stations.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">
                  <Link to="/dashboard/stations/$stationId/details" params={{ stationId: String(item.id) }} className="hover:underline text-primary font-semibold">
                    {item.name}
                  </Link>
                </TableCell>
                <TableCell>{item.code}</TableCell>
                <TableCell>{item.location || "-"}</TableCell>
                <TableCell>{item.isActive ? "نعم" : "لا"}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Link to="/dashboard/stations/$stationId/details" params={{ stationId: String(item.id) }}>
                      <Button type="button" variant="ghost" size="icon-sm" title="عرض التفاصيل الكاملة">
                        <Eye className="size-4 text-blue-600" />
                      </Button>
                    </Link>
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
