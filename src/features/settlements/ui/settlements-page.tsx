import { useState } from "react"
import { Plus, Search } from "lucide-react"
import { useMaterialsQuery } from "#/features/materials/hooks/use-materials"
import { useStationsQuery } from "#/features/stations/hooks/use-stations"
import { Button } from "#/shared/components/ui/button"
import { Input } from "#/shared/components/ui/input"
import { Pagination } from "#/shared/components/ui/pagination"
import { useSettlementsQuery } from "../hooks/use-settlements"
import type { Settlement } from "../model/types"
import type { PaginatedResponse } from "#/shared/api/http"
import { CreateSettlementModal } from "./create-settlement-modal"
import { SettlementsTable } from "./settlements-table"
import { ViewSettlementModal } from "./view-settlement-modal"

type SettlementsPageProps = {
  initialData?: PaginatedResponse<Settlement> | Settlement[]
}

export function SettlementsPage({ initialData }: SettlementsPageProps) {
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(15)
  const [search, setSearch] = useState("")

  const { data: settlementsData, isLoading } = useSettlementsQuery({ page, per_page: perPage, search: search || undefined }, initialData)
  const { data: materialsData } = useMaterialsQuery()
  const { data: stationsData } = useStationsQuery()

  const materials = materialsData?.data ?? []
  const stations = stationsData?.data ?? []

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [selectedSettlement, setSelectedSettlement] = useState<Settlement | null>(null)

  const settlements = settlementsData?.data ?? []
  const meta = settlementsData?.meta

  return (
    <section className="grid gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">التسويات</h2>
          <p className="mt-1 text-sm text-muted-foreground">تسويات الجرد الموجبة والسالبة وتتبع الكميات قبل وبعد التسوية.</p>
        </div>
        <Button type="button" onClick={() => setIsCreateOpen(true)}>
          <Plus />
          إضافة تسوية
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
          placeholder="بحث في التسويات..."
          className="pr-9"
        />
      </div>

      <SettlementsTable settlements={settlements} materials={materials} stations={stations} isLoading={isLoading} onView={(settlement) => setSelectedSettlement(settlement)} />

      <Pagination
        meta={meta}
        onPageChange={(newPage) => setPage(newPage)}
        onPerPageChange={(newPerPage) => {
          setPerPage(newPerPage)
          setPage(1)
        }}
      />

      <CreateSettlementModal open={isCreateOpen} onOpenChange={setIsCreateOpen} materials={materials} stations={stations} />

      <ViewSettlementModal settlement={selectedSettlement} open={Boolean(selectedSettlement)} onOpenChange={(open) => !open && setSelectedSettlement(null)} materials={materials} stations={stations} />
    </section>
  )
}
