import { Edit, Eye, Trash2 } from "lucide-react"
import { Button } from "#/shared/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "#/shared/components/ui/table"
import type { Role } from "../model/types"
import { Link } from "@tanstack/react-router"

type RolesTableProps = {
  roles: Role[]
  isLoading?: boolean
  onView: (role: Role) => void
  onDelete: (role: Role) => void
}

export function RolesTable({ roles, isLoading, onView, onDelete }: RolesTableProps) {
  return (
    <div className="overflow-hidden rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>اسم الدور</TableHead>
            <TableHead>التسمية</TableHead>
            <TableHead>الصلاحيات</TableHead>
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
          ) : roles.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                لا توجد أدوار
              </TableCell>
            </TableRow>
          ) : (
            roles.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.label || "-"}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">{item.rolePermissions?.length ?? 0} صلاحية</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button type="button" variant="ghost" size="icon-sm" onClick={() => onView(item)} title="عرض التفاصيل">
                      <Eye className="size-4 text-blue-600" />
                    </Button>
                    <Link to="/dashboard/roles/$roleId/update" params={{ roleId: item.id.toString() }}>
                      <Button type="button" variant="ghost" size="icon-sm" aria-label="تعديل">
                        <Edit />
                      </Button>
                    </Link>
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
