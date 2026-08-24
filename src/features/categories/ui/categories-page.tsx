import { useState } from "react"
import { Plus, Search } from "lucide-react"
import { Button } from "#/shared/components/ui/button"
import { Input } from "#/shared/components/ui/input"
import { Pagination } from "#/shared/components/ui/pagination"
import { useCategoriesQuery } from "../hooks/use-categories"
import type { Category } from "../model/types"
import type { PaginatedResponse } from "#/shared/api/http"
import { CategoriesTable } from "./categories-table"
import { CreateCategoryModal } from "./create-category-modal"
import { DeleteCategoryModal } from "./delete-category-modal"
import { UpdateCategoryModal } from "./update-category-modal"

type CategoriesPageProps = {
  initialData?: PaginatedResponse<Category> | Category[]
}

export function CategoriesPage({ initialData }: CategoriesPageProps) {
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(15)
  const [search, setSearch] = useState("")

  const { data: categoriesData, isLoading } = useCategoriesQuery({ page, per_page: perPage, search: search || undefined }, initialData)

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null)

  const categories = categoriesData?.data ?? []
  const meta = categoriesData?.meta

  return (
    <section className="grid gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">التصنيفات</h2>
          <p className="mt-1 text-sm text-muted-foreground">إدارة تصنيفات المواد الخام والمستلزمات.</p>
        </div>
        <Button type="button" onClick={() => setIsCreateOpen(true)}>
          <Plus />
          إضافة تصنيف
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
          placeholder="بحث عن تصنيف..."
          className="pr-9"
        />
      </div>

      <CategoriesTable categories={categories} isLoading={isLoading} onEdit={(cat) => setEditingCategory(cat)} onDelete={(cat) => setDeletingCategory(cat)} />

      <Pagination
        meta={meta}
        onPageChange={(newPage) => setPage(newPage)}
        onPerPageChange={(newPerPage) => {
          setPerPage(newPerPage)
          setPage(1)
        }}
      />

      <CreateCategoryModal open={isCreateOpen} onOpenChange={setIsCreateOpen} />

      <UpdateCategoryModal key={editingCategory?.id ?? "update-cat"} category={editingCategory} open={Boolean(editingCategory)} onOpenChange={(open) => !open && setEditingCategory(null)} />

      <DeleteCategoryModal category={deletingCategory} open={Boolean(deletingCategory)} onOpenChange={(open) => !open && setDeletingCategory(null)} />
    </section>
  )
}
