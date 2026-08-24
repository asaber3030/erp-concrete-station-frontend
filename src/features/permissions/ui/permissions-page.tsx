import { useMemo, useState } from "react"
import { Search } from "lucide-react"
import { Input } from "#/shared/components/ui/input"
import { usePermissionsQuery } from "../hooks/use-permissions"
import type { Permission } from "../model/types"
import { PermissionsTable } from "./permissions-table"

type PermissionsPageProps = {
  initialData?: Permission[]
}

export function PermissionsPage({ initialData }: PermissionsPageProps) {
  const { data: permissions = [] } = usePermissionsQuery(initialData)
  const [search, setSearch] = useState("")

  const filteredPermissions = useMemo(() => {
    if (!search.trim()) return permissions
    const term = search.toLowerCase()
    return permissions.filter((p) => p.name.toLowerCase().includes(term) || p.key.toLowerCase().includes(term) || (p.description ?? "").toLowerCase().includes(term))
  }, [permissions, search])

  return (
    <section className="grid gap-4">
      <div>
        <h2 className="text-2xl font-bold">الصلاحيات</h2>
        <p className="mt-1 text-sm text-muted-foreground">عرض جميع الصلاحيات المعرفة بالنظام.</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="بحث في الصلاحيات..." className="pr-9" />
      </div>

      <PermissionsTable permissions={filteredPermissions} />
    </section>
  )
}
