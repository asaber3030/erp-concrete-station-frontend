import { createFileRoute } from "@tanstack/react-router"
import { listMaterials } from "#/features/materials/api/materials.api"
import { materialQueryParamsSchema } from "#/features/materials/model/schema"
import { MaterialsPage } from "#/features/materials/ui/materials-page"

export const Route = createFileRoute("/dashboard/materials/")({
  validateSearch: materialQueryParamsSchema,
  loaderDeps: ({ search }) => search,
  loader: ({ deps }) => listMaterials({ data: deps }),
  component: Page,
})

function Page() {
  return <MaterialsPage />
}
