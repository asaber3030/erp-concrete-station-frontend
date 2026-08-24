import { useState } from "react"
import { Plus, Search } from "lucide-react"
import { Button } from "#/shared/components/ui/button"
import { Input } from "#/shared/components/ui/input"
import { Pagination } from "#/shared/components/ui/pagination"
import { useRolesQuery } from "../hooks/use-roles"
import type { Role } from "../model/types"
import type { PaginatedResponse } from "#/shared/api/http"
import { DeleteRoleModal } from "./delete-role-modal"
import { RolesTable } from "./roles-table"
import { ViewRoleModal } from "./view-role-modal"
import { Link } from "@tanstack/react-router"

type RolesPageProps = {
  initialData?: PaginatedResponse<Role>
}

export function RolesPage({ initialData }: RolesPageProps) {
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(15)
  const [search, setSearch] = useState("")

  const { data: rolesData, isLoading } = useRolesQuery({ page, per_page: perPage, search: search || undefined }, initialData)

  const [viewingRole, setViewingRole] = useState<Role | null>(null)
  const [deletingRole, setDeletingRole] = useState<Role | null>(null)

  const roles = rolesData?.data ?? []
  const meta = rolesData?.meta

  return (
    <section className="grid gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">الأدوار والصلاحيات</h2>
          <p className="mt-1 text-sm text-muted-foreground">إدارة الأدوار والتسميات الخاصة بالنظام.</p>
        </div>
        <Link to="/dashboard/roles/create">
          <Button type="button">
            <Plus />
            إضافة دور
          </Button>
        </Link>
      </div>

      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
          placeholder="بحث عن دور..."
          className="pr-9"
        />
      </div>

      <RolesTable roles={roles} isLoading={isLoading} onView={(role) => setViewingRole(role)} onDelete={(role) => setDeletingRole(role)} />

      <Pagination
        meta={meta}
        onPageChange={(newPage) => setPage(newPage)}
        onPerPageChange={(newPerPage) => {
          setPerPage(newPerPage)
          setPage(1)
        }}
      />

      <ViewRoleModal role={viewingRole} open={Boolean(viewingRole)} onOpenChange={(open) => !open && setViewingRole(null)} />
      <DeleteRoleModal role={deletingRole} open={Boolean(deletingRole)} onOpenChange={(open) => !open && setDeletingRole(null)} />
    </section>
  )
}
