import { useState, useEffect } from "react"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { Search, Filter } from "lucide-react"
import { useCategoriesQuery } from "#/features/categories/hooks/use-categories"
import { useUnitsQuery } from "#/features/units/hooks/use-units"
import { Button } from "#/shared/components/ui/button"
import { Input } from "#/shared/components/ui/input"
import type { Material } from "../model/types"
import { CreateMaterialModal } from "./create-material-modal"
import { MaterialsTable } from "./materials-table"
import type { PaginatedResponse } from "#/shared/types"

export function MaterialsPage() {
  const navigate = useNavigate({ from: "/dashboard/materials/" })
  const routeSearch = useSearch({ from: "/dashboard/materials/" })

  const page = typeof routeSearch.page === "number" ? routeSearch.page : 1
  const perPage = typeof routeSearch.per_page === "number" ? routeSearch.per_page : 15
  const search = typeof routeSearch.search === "string" ? routeSearch.search : ""
  const selectedCategoryId = routeSearch.categoryId !== undefined ? String(routeSearch.categoryId) : "all"

  const [searchInput, setSearchInput] = useState(search)

  const { data: categoriesData } = useCategoriesQuery()

  const categories = categoriesData?.data ?? []

  const updateFilters = (newParams: Record<string, unknown>) => {
    navigate({
      search: (old: any) => {
        const updated = { ...old, ...newParams }
        return Object.fromEntries(Object.entries(updated).filter(([_, v]) => v !== undefined && v !== "" && v !== null))
      },
      replace: true,
    })
  }

  const handleSearchSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    updateFilters({ search: searchInput || undefined, page: 1 })
  }

  return (
    <section className="grid gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">المواد الخام</h2>
          <p className="mt-1 text-sm text-muted-foreground">إدارة المواد الخام وحد إعادة الطلب والتصنيفات والوحدات.</p>
        </div>
        <CreateMaterialModal />
      </div>

      <form onSubmit={handleSearchSubmit} className="flex flex-wrap items-center gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchInput}
            onChange={(e) => {
              const val = e.target.value
              setSearchInput(val)
              if (!val) {
                updateFilters({ search: undefined, page: 1 })
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                handleSearchSubmit()
              }
            }}
            placeholder="بحث عن مادة..."
            className="pr-9"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="size-4 text-muted-foreground" />
          <select
            value={selectedCategoryId}
            onChange={(e) => {
              const val = e.target.value
              const numVal = Number(val)
              updateFilters({
                categoryId: val !== "all" && !isNaN(numVal) ? numVal : undefined,
                page: 1,
              })
            }}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="all">جميع التصنيفات</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <Button type="submit" variant="outline">
          بحث
        </Button>
      </form>

      <MaterialsTable />
    </section>
  )
}
