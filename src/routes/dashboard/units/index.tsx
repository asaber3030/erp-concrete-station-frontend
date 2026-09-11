import { createFileRoute } from "@tanstack/react-router"
import { listUnits } from "#/features/units/api/units-api"
import { UnitsPage } from "#/features/units/ui/units-page"

export const Route = createFileRoute("/dashboard/units/")({
  loader: () => listUnits(),
  component: Page,
})

function Page() {
  const initialData = Route.useLoaderData()
  return <UnitsPage initialData={initialData} />
}
