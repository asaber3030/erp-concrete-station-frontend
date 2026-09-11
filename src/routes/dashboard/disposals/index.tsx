import { createFileRoute } from "@tanstack/react-router"
import { listDisposals } from "#/features/disposals/api/disposals-api"
import { DisposalsPage } from "#/features/disposals/ui/disposals-page"

export const Route = createFileRoute("/dashboard/disposals/")({
  loader: () => listDisposals(),
  component: Page,
})

function Page() {
  const initialData = Route.useLoaderData()
  return <DisposalsPage initialData={initialData} />
}
