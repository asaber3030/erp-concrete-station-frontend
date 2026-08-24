import { createFileRoute } from "@tanstack/react-router"
import { listPermissions } from "#/features/permissions/api/permissions-api"
import { PermissionsPage } from "#/features/permissions/ui/permissions-page"

export const Route = createFileRoute("/dashboard/permissions")({
  loader: () => listPermissions(),
  component: Page,
})

function Page() {
  const initialData = Route.useLoaderData()
  return <PermissionsPage initialData={initialData} />
}
