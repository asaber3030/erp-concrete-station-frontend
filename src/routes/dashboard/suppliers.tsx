import { createFileRoute } from "@tanstack/react-router"
import { listSuppliers } from "#/features/suppliers/api/suppliers-api"
import { SuppliersPage } from "#/features/suppliers/ui/suppliers-page"

export const Route = createFileRoute("/dashboard/suppliers")({
  loader: () => listSuppliers(),
  component: Page,
})

function Page() {
  const initialData = Route.useLoaderData()
  return <SuppliersPage initialData={initialData} />
}
