import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/stations/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/stations/"!</div>
}
