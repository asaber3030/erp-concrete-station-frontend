import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/settlements/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/settlements/"!</div>
}
