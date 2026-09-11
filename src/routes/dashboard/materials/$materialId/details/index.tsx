import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/dashboard/materials/$materialId/details/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/materials/$materialId/details/"!</div>
}
