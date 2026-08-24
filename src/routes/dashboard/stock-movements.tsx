import { createFileRoute } from "@tanstack/react-router"
import { listStockMovements } from "#/features/stock-movements/api/stock-movements-api"
import { StockMovementsPage } from "#/features/stock-movements/ui/stock-movements-page"

export const Route = createFileRoute("/dashboard/stock-movements")({
  loader: () => listStockMovements(),
  component: Page,
})

function Page() {
  const initialData = Route.useLoaderData()
  return <StockMovementsPage initialData={initialData} />
}
