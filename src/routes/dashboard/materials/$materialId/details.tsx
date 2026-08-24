import { createFileRoute } from "@tanstack/react-router"
import { getMaterialById } from "#/features/materials/api/materials.api"
import { MaterialDetailsPage } from "#/features/materials/ui/material-details-page"

export const Route = createFileRoute("/dashboard/materials/$materialId/details")({
  loader: ({ params }) => getMaterialById({ data: { id: params.materialId } }),
  component: RouteComponent,
})

function RouteComponent() {
  const { materialId } = Route.useParams()
  const initialData = Route.useLoaderData()
  return <MaterialDetailsPage materialId={materialId} initialData={initialData} />
}
