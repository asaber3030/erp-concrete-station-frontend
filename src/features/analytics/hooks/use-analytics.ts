import { useQuery } from "@tanstack/react-query"
import { getStationAnalytics } from "../api/analytics-api"

export function useStationAnalyticsQuery(stationId: string, month: string) {
  return useQuery({
    queryKey: ["analytics", stationId, month],
    queryFn: () => getStationAnalytics({ data: { stationId, month } }),
    enabled: Boolean(stationId && month),
  })
}
