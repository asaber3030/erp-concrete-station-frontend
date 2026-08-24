import { createFileRoute } from "@tanstack/react-router"
import { listCategories } from "#/features/categories/api/categories-api"
import { CategoriesPage } from "#/features/categories/ui/categories-page"

export const Route = createFileRoute("/dashboard/categories")({
  loader: () => listCategories(),
  component: Page,
})

function Page() {
  const initialData = Route.useLoaderData()
  return <CategoriesPage initialData={initialData} />
}
