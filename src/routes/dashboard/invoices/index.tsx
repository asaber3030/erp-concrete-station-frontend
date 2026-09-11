import { createFileRoute } from "@tanstack/react-router"
import { listInvoices } from "#/features/invoices/api/invoices-api"
import { InvoicesPage } from "#/features/invoices/ui/invoices-page"

export const Route = createFileRoute("/dashboard/invoices/")({
  loader: () => listInvoices(),
  component: Page,
})

function Page() {
  const initialData = Route.useLoaderData()
  return <InvoicesPage initialData={initialData} />
}
