import { useState } from "react"
import { Plus, Search } from "lucide-react"
import { Button } from "#/shared/components/ui/button"
import { Input } from "#/shared/components/ui/input"
import { Pagination } from "#/shared/components/ui/pagination"
import { useStationsQuery } from "../hooks/use-stations"
import type { Station } from "../model/types"
import type { PaginatedResponse } from "#/shared/api/http"
import { CreateStationModal } from "./create-station-modal"
import { DeleteStationModal } from "./delete-station-modal"
import { StationsTable } from "./stations-table"
import { UpdateStationModal } from "./update-station-modal"

type StationsPageProps = {
  initialData?: PaginatedResponse<Station> | Station[]
}

export function StationsPage({ initialData }: StationsPageProps) {
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(15)
  const [search, setSearch] = useState("")

  const { data: stationsData, isLoading } = useStationsQuery({ page, per_page: perPage, search: search || undefined }, initialData)

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingStation, setEditingStation] = useState<Station | null>(null)
  const [deletingStation, setDeletingStation] = useState<Station | null>(null)

  const stations = stationsData?.data ?? []
  const meta = stationsData?.meta

  return (
    <section className="grid gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">المحطات</h2>
          <p className="mt-1 text-sm text-muted-foreground">إدارة محطات الخرسانة الجاهزة ومواقعها.</p>
        </div>
        <Button type="button" onClick={() => setIsCreateOpen(true)}>
          <Plus />
          إضافة محطة
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
          placeholder="بحث عن محطة..."
          className="pr-9"
        />
      </div>

      <StationsTable stations={stations} isLoading={isLoading} onEdit={(station) => setEditingStation(station)} onDelete={(station) => setDeletingStation(station)} />

      <Pagination
        meta={meta}
        onPageChange={(newPage) => setPage(newPage)}
        onPerPageChange={(newPerPage) => {
          setPerPage(newPerPage)
          setPage(1)
        }}
      />

      <CreateStationModal open={isCreateOpen} onOpenChange={setIsCreateOpen} />

      <UpdateStationModal key={editingStation?.id ?? "update-st"} station={editingStation} open={Boolean(editingStation)} onOpenChange={(open) => !open && setEditingStation(null)} />

      <DeleteStationModal station={deletingStation} open={Boolean(deletingStation)} onOpenChange={(open) => !open && setDeletingStation(null)} />
    </section>
  )
}
