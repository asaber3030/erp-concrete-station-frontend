import { useState } from "react"
import { Plus, Search } from "lucide-react"
import { Button } from "#/shared/components/ui/button"
import { Input } from "#/shared/components/ui/input"
import { Pagination } from "#/shared/components/ui/pagination"
import { useSuppliersQuery } from "../hooks/use-suppliers"
import type { Supplier } from "../model/types"
import type { PaginatedResponse } from "#/shared/api/http"
import { CreateSupplierModal } from "./create-supplier-modal"
import { DeleteSupplierModal } from "./delete-supplier-modal"
import { SuppliersTable } from "./suppliers-table"
import { UpdateSupplierModal } from "./update-supplier-modal"

type SuppliersPageProps = {
  initialData?: PaginatedResponse<Supplier> | Supplier[]
}

export function SuppliersPage({ initialData }: SuppliersPageProps) {
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(15)
  const [search, setSearch] = useState("")

  const { data: suppliersData, isLoading } = useSuppliersQuery({ page, per_page: perPage, search: search || undefined }, initialData)

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
  const [deletingSupplier, setDeletingSupplier] = useState<Supplier | null>(null)

  const suppliers = suppliersData?.data ?? []
  const meta = suppliersData?.meta

  return (
    <section className="grid gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold font-sans">الموردون</h2>
          <p className="mt-1 text-sm text-muted-foreground">إدارة الموردين ومعلومات التواصل والخدمات المقدمة.</p>
        </div>
        <Button type="button" onClick={() => setIsCreateOpen(true)}>
          <Plus />
          إضافة مورد
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
          placeholder="بحث عن مورد..."
          className="pr-9"
        />
      </div>

      <SuppliersTable suppliers={suppliers} isLoading={isLoading} onEdit={(supplier) => setEditingSupplier(supplier)} onDelete={(supplier) => setDeletingSupplier(supplier)} />

      <Pagination
        meta={meta}
        onPageChange={(newPage) => setPage(newPage)}
        onPerPageChange={(newPerPage) => {
          setPerPage(newPerPage)
          setPage(1)
        }}
      />

      <CreateSupplierModal open={isCreateOpen} onOpenChange={setIsCreateOpen} />

      <UpdateSupplierModal key={editingSupplier?.id ?? "update-sup"} supplier={editingSupplier} open={Boolean(editingSupplier)} onOpenChange={(open) => !open && setEditingSupplier(null)} />

      <DeleteSupplierModal supplier={deletingSupplier} open={Boolean(deletingSupplier)} onOpenChange={(open) => !open && setDeletingSupplier(null)} />
    </section>
  )
}
