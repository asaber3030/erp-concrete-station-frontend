import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/suppliers/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/suppliers/"!</div>
}
