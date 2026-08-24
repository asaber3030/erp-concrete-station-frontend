import { useState } from "react"
import { Plus, Search } from "lucide-react"
import { useInvoicesQuery } from "#/features/invoices/hooks/use-invoices"
import { useMaterialsQuery } from "#/features/materials/hooks/use-materials"
import { useStationsQuery } from "#/features/stations/hooks/use-stations"
import { useSuppliersQuery } from "#/features/suppliers/hooks/use-suppliers"
import { Button } from "#/shared/components/ui/button"
import { Input } from "#/shared/components/ui/input"
import { Pagination } from "#/shared/components/ui/pagination"
import { useInventoryQuery } from "../hooks/use-inventory"
import type { InventoryItem } from "../model/types"
import type { PaginatedResponse } from "#/shared/api/http"
import { InventoryTable } from "./inventory-table"
import { RecordAdjustmentModal } from "./record-adjustment-modal"
import { ViewInventoryModal } from "./view-inventory-modal"

type InventoryPageProps = {
  initialData?: PaginatedResponse<InventoryItem> | InventoryItem[]
}

export function InventoryPage({ initialData }: InventoryPageProps) {
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(15)
  const [search, setSearch] = useState("")

  const { data: inventoryData, isLoading } = useInventoryQuery({ page, per_page: perPage, search: search || undefined }, initialData)
  const { data: materialsData } = useMaterialsQuery()
  const { data: stationsData } = useStationsQuery()
  const { data: suppliersData } = useSuppliersQuery()
  const { data: invoicesData } = useInvoicesQuery()

  const materials = materialsData?.data ?? []
  const stations = stationsData?.data ?? []
  const suppliers = suppliersData?.data ?? []
  const invoices = invoicesData?.data ?? []

  const [isAdjustmentOpen, setIsAdjustmentOpen] = useState(false)
  const [selectedInventory, setSelectedInventory] = useState<InventoryItem | null>(null)

  const inventory = inventoryData?.data ?? []
  const meta = inventoryData?.meta

  return (
    <section className="grid gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">المخزون</h2>
          <p className="mt-1 text-sm text-muted-foreground">الأرصدة الحالية والكميات المحجوزة حسب المادة والمحطة.</p>
        </div>
        <Button type="button" onClick={() => setIsAdjustmentOpen(true)}>
          <Plus />
          تسجيل حركة تعديل
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
          placeholder="بحث بمعرف المادة أو المحطة..."
          className="pr-9"
        />
      </div>

      <InventoryTable inventory={inventory} materials={materials} stations={stations} isLoading={isLoading} onView={(item) => setSelectedInventory(item)} />

      <Pagination
        meta={meta}
        onPageChange={(newPage) => setPage(newPage)}
        onPerPageChange={(newPerPage) => {
          setPerPage(newPerPage)
          setPage(1)
        }}
      />

      <RecordAdjustmentModal open={isAdjustmentOpen} onOpenChange={setIsAdjustmentOpen} materials={materials} stations={stations} suppliers={suppliers} invoices={invoices} />

      <ViewInventoryModal inventory={selectedInventory} open={Boolean(selectedInventory)} onOpenChange={(open) => !open && setSelectedInventory(null)} materials={materials} stations={stations} />
    </section>
  )
}
