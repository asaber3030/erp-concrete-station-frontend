import { createFileRoute } from "@tanstack/react-router"
import { listUsers } from "#/features/users/api/users-api"
import { UsersPage } from "#/features/users/ui/users-page"

export const Route = createFileRoute("/dashboard/users/")({
  loader: () => listUsers(),
  component: Page,
})

function Page() {
  const initialData = Route.useLoaderData()
  return <UsersPage initialData={initialData} />
}
