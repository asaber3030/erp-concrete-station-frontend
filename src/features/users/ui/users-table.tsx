import { Edit, Trash2 } from "lucide-react"
import type { Station } from "#/features/stations/model/types"
import { Button } from "#/shared/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "#/shared/components/ui/table"
import type { User } from "../model/types"

type UsersTableProps = {
  users: User[]
  stations: Station[]
  isLoading?: boolean
  onEdit: (user: User) => void
  onDelete: (user: User) => void
}

export function UsersTable({ users, stations, isLoading, onEdit, onDelete }: UsersTableProps) {
  return (
    <div className="overflow-hidden rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>الاسم</TableHead>
            <TableHead>البريد الإلكتروني</TableHead>
            <TableHead>الدور</TableHead>
            <TableHead>المحطة</TableHead>
            <TableHead>نشط</TableHead>
            <TableHead className="w-28">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                جاري التحميل...
              </TableCell>
            </TableRow>
          ) : users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                لا يوجد مستخدمون
              </TableCell>
            </TableRow>
          ) : (
            users.map((item) => {
              const matchedStation = stations.find((st) => String(st.id) === String(item.stationId))
              const roleName = typeof item.role === "object" ? item.role?.name : item.role

              return (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>{roleName || "-"}</TableCell>
                  <TableCell>{matchedStation ? matchedStation.name : item.stationId || "-"}</TableCell>
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
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}
