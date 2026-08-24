import { createFileRoute } from "@tanstack/react-router"
import { listRoles } from "#/features/roles/api/roles-api"
import { RolesPage } from "#/features/roles/ui/roles-page"

export const Route = createFileRoute("/dashboard/roles/")({
  loader: () => listRoles(),
  component: Page,
})

function Page() {
  const initialData = Route.useLoaderData()
  console.log("initialData: ", initialData)
  return <RolesPage initialData={initialData} />
}
