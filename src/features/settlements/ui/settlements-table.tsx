import { Eye } from "lucide-react"
import type { Material } from "#/features/materials/model/types"
import type { Station } from "#/features/stations/model/types"
import { Button } from "#/shared/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "#/shared/components/ui/table"
import type { Settlement } from "../model/types"

type SettlementsTableProps = {
  settlements: Settlement[]
  materials: Material[]
  stations: Station[]
  isLoading?: boolean
  onView: (settlement: Settlement) => void
}

export function SettlementsTable({ settlements, materials, stations, isLoading, onView }: SettlementsTableProps) {
  return (
    <div className="overflow-hidden rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>المادة</TableHead>
            <TableHead>المحطة</TableHead>
            <TableHead>النوع</TableHead>
            <TableHead>الكمية</TableHead>
            <TableHead>السابقة</TableHead>
            <TableHead>الجديدة</TableHead>
            <TableHead>السبب</TableHead>
            <TableHead className="w-20">التفاصيل</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                جاري التحميل...
              </TableCell>
            </TableRow>
          ) : settlements.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                لا توجد تسويات
              </TableCell>
            </TableRow>
          ) : (
            settlements.map((item) => {
              const matchedMaterial = materials.find((m) => String(m.id) === String(item.materialId))
              const matchedStation = stations.find((s) => String(s.id) === String(item.stationId))
              return (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{matchedMaterial ? matchedMaterial.name : item.materialId}</TableCell>
                  <TableCell>{matchedStation ? matchedStation.name : item.stationId}</TableCell>
                  <TableCell>
                    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${item.type === "positive" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                      {item.type === "positive" ? "موجبة" : "سالبة"}
                    </span>
                  </TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.previousQty}</TableCell>
                  <TableCell>{item.newQty}</TableCell>
                  <TableCell>{item.reason}</TableCell>
                  <TableCell>
                    <Button type="button" variant="ghost" size="icon-sm" onClick={() => onView(item)} title="عرض تفاصيل التسوية">
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
