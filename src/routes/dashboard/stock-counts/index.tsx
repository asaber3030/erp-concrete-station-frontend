import { createFileRoute } from "@tanstack/react-router"
import { StockCountsPage } from "#/features/warehouse-documents/ui/stock-counts-page"

export const Route = createFileRoute("/dashboard/stock-counts/")({
  component: Page,
})

function Page() {
  return <StockCountsPage />
}
