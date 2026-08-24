import { createFileRoute, useRouteContext } from "@tanstack/react-router"
import { getDashboardOverview } from "#/features/dashboard/api/dashboard-api"
import { DashboardOverview } from "#/features/dashboard/ui/dashboard-overview"

export const Route = createFileRoute("/dashboard/")({
  loader: () => getDashboardOverview(),
  component: DashboardIndexPage,
})

function DashboardIndexPage() {
  const data = Route.useLoaderData()
  const ctx = Route.useRouteContext()
  return <DashboardOverview data={data} />
}
