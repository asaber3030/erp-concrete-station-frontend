import { createFileRoute } from "@tanstack/react-router"
import { StockAdjustmentsPage } from "#/features/warehouse-documents/ui/stock-adjustments-page"

export const Route = createFileRoute("/dashboard/stock-adjustments/")({
  component: Page,
})

function Page() {
  return <StockAdjustmentsPage />
}
