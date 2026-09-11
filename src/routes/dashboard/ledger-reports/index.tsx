import { createFileRoute } from "@tanstack/react-router"
import { LedgerReportsPage } from "#/features/ledger-reports/ui/ledger-reports-page"

export const Route = createFileRoute("/dashboard/ledger-reports/")({
  component: Page,
})

function Page() {
  return <LedgerReportsPage />
}
