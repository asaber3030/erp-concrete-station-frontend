import { createFileRoute } from "@tanstack/react-router"

import { StationAnalyticsPanel } from "#/features/analytics/ui/station-analytics-panel"

export const Route = createFileRoute("/dashboard/analytics")({
  component: StationAnalyticsPanel,
})
