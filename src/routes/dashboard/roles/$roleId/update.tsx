import { createFileRoute, notFound } from "@tanstack/react-router"
import { getRoleById } from "#/features/roles/api/roles-api"
import { UpdateRole } from "#/features/roles/ui/update-role"

export const Route = createFileRoute("/dashboard/roles/$roleId/update")({
  component: RouteComponent,
  loader: async ({ params }) => {
    const role = await getRoleById({ data: Number(params.roleId) })
    if (!role) throw notFound()
    return { role }
  },
})

function RouteComponent() {
  const { role } = Route.useLoaderData()
  console.log({role})

  return <UpdateRole role={role} />
}
