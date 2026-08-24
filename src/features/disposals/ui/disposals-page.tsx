import { useState } from "react"
import { Plus, Search } from "lucide-react"
import { useMaterialsQuery } from "#/features/materials/hooks/use-materials"
import { useStationsQuery } from "#/features/stations/hooks/use-stations"
import { Button } from "#/shared/components/ui/button"
import { Input } from "#/shared/components/ui/input"
import { Pagination } from "#/shared/components/ui/pagination"
import { useApproveDisposalMutation, useDisposalsQuery } from "../hooks/use-disposals"
import type { Disposal } from "../model/types"
import type { PaginatedResponse } from "#/shared/api/http"
import { DisposalsTable } from "./disposals-table"
import { RequestDisposalModal } from "./request-disposal-modal"
import { ViewDisposalModal } from "./view-disposal-modal"

type DisposalsPageProps = {
  initialData?: PaginatedResponse<Disposal> | Disposal[]
}

export function DisposalsPage({ initialData }: DisposalsPageProps) {
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(15)
  const [search, setSearch] = useState("")

  const { data: disposalsData, isLoading } = useDisposalsQuery({ page, per_page: perPage, search: search || undefined }, initialData)
  const { data: materialsData } = useMaterialsQuery()
  const { data: stationsData } = useStationsQuery()

  const materials = materialsData?.data ?? []
  const stations = stationsData?.data ?? []

  const [isRequestOpen, setIsRequestOpen] = useState(false)
  const [selectedDisposal, setSelectedDisposal] = useState<Disposal | null>(null)

  const approveMutation = useApproveDisposalMutation()

  const disposals = disposalsData?.data ?? []
  const meta = disposalsData?.meta

  const handleApprove = (id: string | number) => {
    approveMutation.mutate(id)
  }

  return (
    <section className="grid gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">الإهلاكات</h2>
          <p className="mt-1 text-sm text-muted-foreground">طلبات إهلاك المواد والتألف وقرارات الاعتماد.</p>
        </div>
        <Button type="button" onClick={() => setIsRequestOpen(true)}>
          <Plus />
          طلب إهلاك
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
          placeholder="بحث في الإهلاكات..."
          className="pr-9"
        />
      </div>

      <DisposalsTable
        disposals={disposals}
        materials={materials}
        stations={stations}
        isLoading={isLoading}
        isApprovePending={approveMutation.isPending}
        onView={(disposal) => setSelectedDisposal(disposal)}
        onApprove={handleApprove}
      />

      <Pagination
        meta={meta}
        onPageChange={(newPage) => setPage(newPage)}
        onPerPageChange={(newPerPage) => {
          setPerPage(newPerPage)
          setPage(1)
        }}
      />

      <RequestDisposalModal open={isRequestOpen} onOpenChange={setIsRequestOpen} materials={materials} stations={stations} />

      <ViewDisposalModal
        disposal={selectedDisposal}
        open={Boolean(selectedDisposal)}
        onOpenChange={(open) => !open && setSelectedDisposal(null)}
        materials={materials}
        stations={stations}
        onApprove={handleApprove}
      />
    </section>
  )
}
