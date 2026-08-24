import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "#/shared/components/ui/table"
import type { AuditLog } from "../model/types"

type AuditLogsTableProps = {
  logs: AuditLog[]
  isLoading?: boolean
}

export function AuditLogsTable({ logs, isLoading }: AuditLogsTableProps) {
  return (
    <div className="overflow-hidden rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>المستخدم (User ID)</TableHead>
            <TableHead>الحدث (Action)</TableHead>
            <TableHead>المورد (Resource)</TableHead>
            <TableHead>التفاصيل</TableHead>
            <TableHead>التاريخ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                جاري التحميل...
              </TableCell>
            </TableRow>
          ) : logs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                لا توجد سجلات أنشطة
              </TableCell>
            </TableRow>
          ) : (
            logs.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.userId}</TableCell>
                <TableCell>{item.action}</TableCell>
                <TableCell>{item.resource}</TableCell>
                <TableCell>{item.details || "-"}</TableCell>
                <TableCell>{item.createdAt ? new Date(item.createdAt).toLocaleString("ar-EG") : "-"}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
