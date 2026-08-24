import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "#/shared/components/ui/input"
import { Pagination } from "#/shared/components/ui/pagination"
import { useAuditLogsQuery } from "../hooks/use-audit-logs"
import type { AuditLog } from "../model/types"
import type { PaginatedResponse } from "#/shared/api/http"
import { AuditLogsTable } from "./audit-logs-table"

type AuditLogsPageProps = {
  initialData?: PaginatedResponse<AuditLog> | AuditLog[]
}

export function AuditLogsPage({ initialData }: AuditLogsPageProps) {
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(15)
  const [search, setSearch] = useState("")

  const { data: logsData, isLoading } = useAuditLogsQuery({ page, per_page: perPage, search: search || undefined }, initialData)

  const logs = logsData?.data ?? []
  const meta = logsData?.meta

  return (
    <section className="grid gap-4">
      <div>
        <h2 className="text-2xl font-bold">سجلات الأنشطة (Audit Logs)</h2>
        <p className="mt-1 text-sm text-muted-foreground">سجل تتبع العمليات والتعديلات التي تمت على النظام بواسطة المستخدمين.</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
          placeholder="بحث في السجلات..."
          className="pr-9"
        />
      </div>

      <AuditLogsTable logs={logs} isLoading={isLoading} />

      <Pagination
        meta={meta}
        onPageChange={(newPage) => setPage(newPage)}
        onPerPageChange={(newPerPage) => {
          setPerPage(newPerPage)
          setPage(1)
        }}
      />
    </section>
  )
}
