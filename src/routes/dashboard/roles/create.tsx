import { CreateRole } from "#/features/roles/ui/create-role"
import { PageHeader } from "#/shared/components/common/header"
import { Button } from "#/shared/components/ui/button"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/dashboard/roles/create")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <PageHeader title="انشاء دور جديد" />
      <CreateRole />
    </div>
  )
}
