import { createFileRoute } from "@tanstack/react-router"
import { listAuditLogs } from "#/features/audit-logs/api/audit-logs-api"
import { AuditLogsPage } from "#/features/audit-logs/ui/audit-logs-page"

export const Route = createFileRoute("/dashboard/audit-logs")({
  loader: () => listAuditLogs(),
  component: Page,
})

function Page() {
  const initialData = Route.useLoaderData()
  return <AuditLogsPage initialData={initialData} />
}
