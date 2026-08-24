import { createFileRoute } from "@tanstack/react-router"
import { listInventory } from "#/features/inventory/api/inventory-api"
import { InventoryPage } from "#/features/inventory/ui/inventory-page"

export const Route = createFileRoute("/dashboard/inventory")({
  loader: () => listInventory(),
  component: Page,
})

function Page() {
  const initialData = Route.useLoaderData()
  return <InventoryPage initialData={initialData} />
}
