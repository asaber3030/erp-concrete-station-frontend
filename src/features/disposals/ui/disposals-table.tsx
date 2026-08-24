import { CheckCircle, Eye } from "lucide-react"
import type { Material } from "#/features/materials/model/types"
import type { Station } from "#/features/stations/model/types"
import { Button } from "#/shared/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "#/shared/components/ui/table"
import type { Disposal } from "../model/types"

type DisposalsTableProps = {
  disposals: Disposal[]
  materials: Material[]
  stations: Station[]
  isLoading?: boolean
  isApprovePending: boolean
  onView: (disposal: Disposal) => void
  onApprove: (id: string | number) => void
}

export function DisposalsTable({ disposals, materials, stations, isLoading, isApprovePending, onView, onApprove }: DisposalsTableProps) {
  return (
    <div className="overflow-hidden rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>المادة</TableHead>
            <TableHead>المحطة</TableHead>
            <TableHead>الكمية</TableHead>
            <TableHead>السبب</TableHead>
            <TableHead>الحالة</TableHead>
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
          ) : disposals.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                لا توجد طلبات إهلاك
              </TableCell>
            </TableRow>
          ) : (
            disposals.map((item) => {
              const matchedMaterial = materials.find((m) => String(m.id) === String(item.materialId))
              const matchedStation = stations.find((s) => String(s.id) === String(item.stationId))
              return (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{matchedMaterial ? matchedMaterial.name : item.materialId}</TableCell>
                  <TableCell>{matchedStation ? matchedStation.name : item.stationId}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.reason || "-"}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
                        item.status === "approved" ? "bg-green-100 text-green-800" : item.status === "rejected" ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {item.status === "approved" ? "معتمد" : item.status === "rejected" ? "مرفوض" : "قيد الانتظار"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button type="button" variant="ghost" size="icon-sm" onClick={() => onView(item)} title="عرض التفاصيل">
                        <Eye className="size-4 text-blue-600" />
                      </Button>
                      {item.status === "pending" && (
                        <Button type="button" variant="ghost" size="icon-sm" onClick={() => onApprove(item.id)} aria-label="اعتماد" title="اعتماد الإهلاك" disabled={isApprovePending}>
                          <CheckCircle className="size-4 text-green-600" />
                        </Button>
                      )}
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
