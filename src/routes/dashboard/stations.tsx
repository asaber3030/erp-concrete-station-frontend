import { createFileRoute } from "@tanstack/react-router"
import { listStations } from "#/features/stations/api/stations-api"
import { StationsPage } from "#/features/stations/ui/stations-page"

export const Route = createFileRoute("/dashboard/stations")({
  loader: () => listStations(),
  component: Page,
})

function Page() {
  const initialData = Route.useLoaderData()
  return <StationsPage initialData={initialData} />
}
