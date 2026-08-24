import { useState } from "react"
import { Plus, Search } from "lucide-react"
import { useRolesQuery } from "#/features/roles/hooks/use-roles"
import { useStationsQuery } from "#/features/stations/hooks/use-stations"
import { Button } from "#/shared/components/ui/button"
import { Input } from "#/shared/components/ui/input"
import { Pagination } from "#/shared/components/ui/pagination"
import { useUsersQuery } from "../hooks/use-users"
import type { User } from "../model/types"
import type { PaginatedResponse } from "#/shared/api/http"
import { CreateUserModal } from "./create-user-modal"
import { DeleteUserModal } from "./delete-user-modal"
import { UpdateUserModal } from "./update-user-modal"
import { UsersTable } from "./users-table"

type UsersPageProps = {
  initialData?: PaginatedResponse<User> | User[]
}

export function UsersPage({ initialData }: UsersPageProps) {
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(15)
  const [search, setSearch] = useState("")

  const { data: usersData, isLoading } = useUsersQuery({ page, per_page: perPage, search: search || undefined }, initialData)
  const { data: rolesData } = useRolesQuery()
  const { data: stations = [] } = useStationsQuery()

  const roles = rolesData?.data ?? []

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [deletingUser, setDeletingUser] = useState<User | null>(null)

  const users = usersData?.data ?? []
  const meta = usersData?.meta

  return (
    <section className="grid gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">المستخدمون</h2>
          <p className="mt-1 text-sm text-muted-foreground">إدارة حسابات المستخدمين وأدوارهم والمحطات المنسوبة إليهم.</p>
        </div>
        <Button type="button" onClick={() => setIsCreateOpen(true)}>
          <Plus />
          إضافة مستخدم
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
          placeholder="بحث عن مستخدم..."
          className="pr-9"
        />
      </div>

      <UsersTable users={users} stations={stations} isLoading={isLoading} onEdit={(user) => setEditingUser(user)} onDelete={(user) => setDeletingUser(user)} />

      <Pagination
        meta={meta}
        onPageChange={(newPage) => setPage(newPage)}
        onPerPageChange={(newPerPage) => {
          setPerPage(newPerPage)
          setPage(1)
        }}
      />

      <CreateUserModal open={isCreateOpen} onOpenChange={setIsCreateOpen} roles={roles} stations={stations} />

      <UpdateUserModal
        key={editingUser?.id ?? "update-modal"}
        user={editingUser}
        open={Boolean(editingUser)}
        onOpenChange={(open) => !open && setEditingUser(null)}
        roles={roles}
        stations={stations}
      />

      <DeleteUserModal user={deletingUser} open={Boolean(deletingUser)} onOpenChange={(open) => !open && setDeletingUser(null)} />
    </section>
  )
}
