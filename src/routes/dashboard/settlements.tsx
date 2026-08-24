import { createFileRoute } from "@tanstack/react-router"
import { listSettlements } from "#/features/settlements/api/settlements-api"
import { SettlementsPage } from "#/features/settlements/ui/settlements-page"

export const Route = createFileRoute("/dashboard/settlements")({
  loader: () => listSettlements(),
  component: Page,
})

function Page() {
  const initialData = Route.useLoaderData()
  return <SettlementsPage initialData={initialData} />
}
