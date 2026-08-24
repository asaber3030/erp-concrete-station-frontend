import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "#/shared/components/ui/table"
import type { Permission } from "../model/types"

type PermissionsTableProps = {
  permissions: Permission[]
}

export function PermissionsTable({ permissions }: PermissionsTableProps) {
  return (
    <div className="overflow-hidden rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>الاسم</TableHead>
            <TableHead>المفتاح (Key)</TableHead>
            <TableHead>الوصف</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {permissions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                لا توجد صلاحيات
              </TableCell>
            </TableRow>
          ) : (
            permissions.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>
                  <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">{item.key}</code>
                </TableCell>
                <TableCell>{item.description || "-"}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
