import { EquipmentPage } from "#/features/master-resources/ui/equipment-page"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/dashboard/equipment/")({
  component: RouteComponent,
})

function RouteComponent() {
  return <EquipmentPage />
}
