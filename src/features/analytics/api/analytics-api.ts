import { createServerFn } from "@tanstack/react-start"
import { getCookie } from "@tanstack/react-start/server"
import { z } from "zod"
import { api } from "#/shared/api/http"
import { AUTH_CONFIG } from "#/shared/config/app/auth"

export type StationAnalytics = {
  period?: Record<string, any>
  station?: Record<string, any>
  inventory?: any[]
  movements?: any[]
  disposals?: any[]
  settlements?: any[]
}

export const getStationAnalyticsInputSchema = z.object({
  stationId: z.string(),
  month: z.string(),
})

export const getStationAnalytics = createServerFn({ method: "GET" })
  .validator((data: { stationId: string; month: string }) => getStationAnalyticsInputSchema.parse(data))
  .handler(async ({ data }) => {
    const token = getCookie(AUTH_CONFIG.tokenCookieName)
    const payload = await api.get<StationAnalytics>(`/analytics/stations/${data.stationId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      params: { month: data.month },
    })
    return payload.data
  })
