import { createFileRoute } from "@tanstack/react-router"
import { ItemsPage } from "#/features/items/ui/items-page"

export const Route = createFileRoute("/dashboard/items/")({
  component: Page,
})

function Page() {
  return <ItemsPage />
}
