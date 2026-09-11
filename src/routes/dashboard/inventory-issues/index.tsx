import { createFileRoute } from "@tanstack/react-router"
import { InventoryIssuesPage } from "#/features/warehouse-documents/ui/inventory-issues-page"

export const Route = createFileRoute("/dashboard/inventory-issues/")({
  component: Page,
})

function Page() {
  return <InventoryIssuesPage />
}
