import { createFileRoute } from "@tanstack/react-router"
import { GoodsReceiptsPage } from "#/features/warehouse-documents/ui/goods-receipts-page"

export const Route = createFileRoute("/dashboard/goods-receipts/")({
  component: Page,
})

function Page() {
  return <GoodsReceiptsPage />
}
