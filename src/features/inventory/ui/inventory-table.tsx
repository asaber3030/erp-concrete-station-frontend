import { Eye } from "lucide-react"
import type { Material } from "#/features/materials/model/types"
import type { Station } from "#/features/stations/model/types"
import { Button } from "#/shared/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "#/shared/components/ui/table"
import type { InventoryItem } from "../model/types"

type InventoryTableProps = {
  inventory: InventoryItem[]
  materials: Material[]
  stations: Station[]
  isLoading?: boolean
  onView: (item: InventoryItem) => void
}

export function InventoryTable({ inventory, materials, stations, isLoading, onView }: InventoryTableProps) {
  return (
    <div className="overflow-hidden rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>المادة</TableHead>
            <TableHead>المحطة</TableHead>
            <TableHead>الكمية المتوفرة</TableHead>
            <TableHead>الكمية المحجوزة</TableHead>
            <TableHead className="w-20">التفاصيل</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                جاري التحميل...
              </TableCell>
            </TableRow>
          ) : inventory.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                لا توجد سجلات مخزون
              </TableCell>
            </TableRow>
          ) : (
            inventory.map((item) => {
              const matchedMaterial = materials.find((m) => String(m.id) === String(item.materialId))
              const matchedStation = stations.find((s) => String(s.id) === String(item.stationId))
              return (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{matchedMaterial ? matchedMaterial.name : item.materialId}</TableCell>
                  <TableCell>{matchedStation ? matchedStation.name : item.stationId}</TableCell>
                  <TableCell className="font-bold">{item.quantity}</TableCell>
                  <TableCell>{item.reservedQuantity ?? 0}</TableCell>
                  <TableCell>
                    <Button type="button" variant="ghost" size="icon-sm" onClick={() => onView(item)} title="عرض تفاصيل رصيد المخزون">
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
