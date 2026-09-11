import { createFileRoute } from "@tanstack/react-router"
import { ProductionPage } from "#/features/production/ui/production-page"

export const Route = createFileRoute("/dashboard/production/")({
  component: Page,
})

function Page() {
  return <ProductionPage />
}
