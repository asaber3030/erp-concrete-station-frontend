import { ArrowDownLeft, ArrowUpRight, Eye } from "lucide-react"
import type { Material } from "#/features/materials/model/types"
import type { Station } from "#/features/stations/model/types"
import { Button } from "#/shared/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "#/shared/components/ui/table"
import type { StockMovement } from "../model/types"

type StockMovementsTableProps = {
  movements: StockMovement[]
  materials: Material[]
  stations: Station[]
  isLoading?: boolean
  onView: (movement: StockMovement) => void
}

export function StockMovementsTable({ movements, materials, stations, isLoading, onView }: StockMovementsTableProps) {
  return (
    <div className="overflow-hidden rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>المادة</TableHead>
            <TableHead>المحطة</TableHead>
            <TableHead>نوع الحركة</TableHead>
            <TableHead>الكمية</TableHead>
            <TableHead>رقم المرجع</TableHead>
            <TableHead className="w-20">التفاصيل</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                جاري التحميل...
              </TableCell>
            </TableRow>
          ) : movements.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                لا توجد حركات مخزون
              </TableCell>
            </TableRow>
          ) : (
            movements.map((item) => {
              const matchedMaterial = materials.find((m) => String(m.id) === String(item.materialId))
              const matchedStation = stations.find((s) => String(s.id) === String(item.stationId))
              return (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{matchedMaterial ? matchedMaterial.name : item.materialId}</TableCell>
                  <TableCell>{matchedStation ? matchedStation.name : item.stationId}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${item.type === "incoming" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}
                    >
                      {item.type === "incoming" ? <ArrowDownLeft className="size-3" /> : <ArrowUpRight className="size-3" />}
                      {item.type === "incoming" ? "وارد" : "صادر"}
                    </span>
                  </TableCell>
                  <TableCell className="font-bold">{item.quantity}</TableCell>
                  <TableCell>{item.referenceNumber || "-"}</TableCell>
                  <TableCell>
                    <Button type="button" variant="ghost" size="icon-sm" onClick={() => onView(item)} title="عرض التفاصيل">
                      <Eye className="size-4 text-blue-600" />
                    </Button>
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
