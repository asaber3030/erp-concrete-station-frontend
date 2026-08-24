import { useState } from "react"
import { Plus, Search } from "lucide-react"
import { useSuppliersQuery } from "#/features/suppliers/hooks/use-suppliers"
import { Button } from "#/shared/components/ui/button"
import { Input } from "#/shared/components/ui/input"
import { Pagination } from "#/shared/components/ui/pagination"
import { useInvoicesQuery, useIssueInvoiceMutation } from "../hooks/use-invoices"
import type { Invoice } from "../model/types"
import type { PaginatedResponse } from "#/shared/api/http"
import { CreateInvoiceModal } from "./create-invoice-modal"
import { DeleteInvoiceModal } from "./delete-invoice-modal"
import { InvoicesTable } from "./invoices-table"
import { UpdateInvoiceModal } from "./update-invoice-modal"
import { ViewInvoiceModal } from "./view-invoice-modal"

type InvoicesPageProps = {
  initialData?: PaginatedResponse<Invoice> | Invoice[]
}

export function InvoicesPage({ initialData }: InvoicesPageProps) {
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(15)
  const [search, setSearch] = useState("")

  const { data: invoicesData, isLoading } = useInvoicesQuery({ page, per_page: perPage, search: search || undefined }, initialData)
  const { data: suppliers = [] } = useSuppliersQuery()

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null)
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null)
  const [deletingInvoice, setDeletingInvoice] = useState<Invoice | null>(null)

  const issueMutation = useIssueInvoiceMutation()

  const invoices = invoicesData?.data ?? []
  const meta = invoicesData?.meta

  const handleIssue = (id: string | number) => {
    issueMutation.mutate(id)
  }

  return (
    <section className="grid gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">الفواتير</h2>
          <p className="mt-1 text-sm text-muted-foreground">فواتير المشتريات والمبيعات مع تتبع الحالة وإصدار الفواتير.</p>
        </div>
        <Button type="button" onClick={() => setIsCreateOpen(true)}>
          <Plus />
          إضافة فاتورة
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
          placeholder="بحث في الفواتير..."
          className="pr-9"
        />
      </div>

      <InvoicesTable
        invoices={invoices}
        isLoading={isLoading}
        isIssuePending={issueMutation.isPending}
        onView={(invoice) => setViewingInvoice(invoice)}
        onEdit={(invoice) => setEditingInvoice(invoice)}
        onDelete={(invoice) => setDeletingInvoice(invoice)}
        onIssue={handleIssue}
      />

      <Pagination
        meta={meta}
        onPageChange={(newPage) => setPage(newPage)}
        onPerPageChange={(newPerPage) => {
          setPerPage(newPerPage)
          setPage(1)
        }}
      />

      <CreateInvoiceModal open={isCreateOpen} onOpenChange={setIsCreateOpen} suppliers={suppliers} />

      <UpdateInvoiceModal
        key={editingInvoice?.id ?? "update-inv"}
        invoice={editingInvoice}
        open={Boolean(editingInvoice)}
        onOpenChange={(open) => !open && setEditingInvoice(null)}
        suppliers={suppliers}
      />

      <ViewInvoiceModal invoice={viewingInvoice} open={Boolean(viewingInvoice)} onOpenChange={(open) => !open && setViewingInvoice(null)} suppliers={suppliers} onIssue={handleIssue} />

      <DeleteInvoiceModal invoice={deletingInvoice} open={Boolean(deletingInvoice)} onOpenChange={(open) => !open && setDeletingInvoice(null)} />
    </section>
  )
}
