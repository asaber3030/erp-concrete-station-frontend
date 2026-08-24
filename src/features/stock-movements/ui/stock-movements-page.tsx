import { useState } from "react"
import { Search } from "lucide-react"
import { useMaterialsQuery } from "#/features/materials/hooks/use-materials"
import { useStationsQuery } from "#/features/stations/hooks/use-stations"
import { Input } from "#/shared/components/ui/input"
import { Pagination } from "#/shared/components/ui/pagination"
import { useStockMovementsQuery } from "../hooks/use-stock-movements"
import type { StockMovement } from "../model/types"
import type { PaginatedResponse } from "#/shared/api/http"
import { StockMovementsTable } from "./stock-movements-table"
import { ViewStockMovementModal } from "./view-stock-movement-modal"

type StockMovementsPageProps = {
  initialData?: PaginatedResponse<StockMovement> | StockMovement[]
}

export function StockMovementsPage({ initialData }: StockMovementsPageProps) {
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(15)
  const [search, setSearch] = useState("")

  const { data: movementsData, isLoading } = useStockMovementsQuery({ page, per_page: perPage, search: search || undefined }, initialData)
  const { data: materialsData } = useMaterialsQuery()
  const { data: stationsData } = useStationsQuery()

  const materials = materialsData?.data ?? []
  const stations = stationsData?.data ?? []

  const [selectedMovement, setSelectedMovement] = useState<StockMovement | null>(null)

  const movements = movementsData?.data ?? []
  const meta = movementsData?.meta

  return (
    <section className="grid gap-4">
      <div>
        <h2 className="text-2xl font-bold">حركات المخزون</h2>
        <p className="mt-1 text-sm text-muted-foreground">سجل حركات الوارد والصادر حسب المادة والمحطة.</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
          placeholder="بحث في الحركات..."
          className="pr-9"
        />
      </div>

      <StockMovementsTable movements={movements} materials={materials} stations={stations} isLoading={isLoading} onView={(movement) => setSelectedMovement(movement)} />

      <Pagination
        meta={meta}
        onPageChange={(newPage) => setPage(newPage)}
        onPerPageChange={(newPerPage) => {
          setPerPage(newPerPage)
          setPage(1)
        }}
      />

      <ViewStockMovementModal movement={selectedMovement} open={Boolean(selectedMovement)} onOpenChange={(open) => !open && setSelectedMovement(null)} materials={materials} stations={stations} />
    </section>
  )
}
