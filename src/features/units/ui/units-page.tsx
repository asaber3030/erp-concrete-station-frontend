import { useState } from "react"
import { Plus, Search } from "lucide-react"
import { Button } from "#/shared/components/ui/button"
import { Input } from "#/shared/components/ui/input"
import { Pagination } from "#/shared/components/ui/pagination"
import { useUnitsQuery } from "../hooks/use-units"
import type { Unit } from "../model/types"
import type { PaginatedResponse } from "#/shared/api/http"
import { CreateUnitModal } from "./create-unit-modal"
import { DeleteUnitModal } from "./delete-unit-modal"
import { UnitsTable } from "./units-table"
import { UpdateUnitModal } from "./update-unit-modal"

type UnitsPageProps = {
  initialData?: PaginatedResponse<Unit> | Unit[]
}

export function UnitsPage({ initialData }: UnitsPageProps) {
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(15)
  const [search, setSearch] = useState("")

  const { data: unitsData, isLoading } = useUnitsQuery({ page, per_page: perPage, search: search || undefined }, initialData)

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null)
  const [deletingUnit, setDeletingUnit] = useState<Unit | null>(null)

  const units = unitsData?.data ?? []
  const meta = unitsData?.meta

  return (
    <section className="grid gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">وحدات القياس</h2>
          <p className="mt-1 text-sm text-muted-foreground">إدارة وحدات القياس المستخدمة في النظام.</p>
        </div>
        <Button type="button" onClick={() => setIsCreateOpen(true)}>
          <Plus />
          إضافة وحدة
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
          placeholder="بحث عن وحدة..."
          className="pr-9"
        />
      </div>

      <UnitsTable units={units} isLoading={isLoading} onEdit={(unit) => setEditingUnit(unit)} onDelete={(unit) => setDeletingUnit(unit)} />

      <Pagination
        meta={meta}
        onPageChange={(newPage) => setPage(newPage)}
        onPerPageChange={(newPerPage) => {
          setPerPage(newPerPage)
          setPage(1)
        }}
      />

      <CreateUnitModal open={isCreateOpen} onOpenChange={setIsCreateOpen} />

      <UpdateUnitModal key={editingUnit?.id ?? "update-unit"} unit={editingUnit} open={Boolean(editingUnit)} onOpenChange={(open) => !open && setEditingUnit(null)} />

      <DeleteUnitModal unit={deletingUnit} open={Boolean(deletingUnit)} onOpenChange={(open) => !open && setDeletingUnit(null)} />
    </section>
  )
}
