import { createServerFn } from "@tanstack/react-start"
import { getCookie } from "@tanstack/react-start/server"
import { api, toList } from "#/shared/api/http"
import { AUTH_CONFIG } from "#/shared/config/app/auth"
import { dashboardResourceLinks } from "../model/resources"

function getAuthHeaders() {
  const token = getCookie(AUTH_CONFIG.tokenCookieName)
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const getDashboardOverview = createServerFn({ method: "GET" }).handler(async () => {
  const headers = getAuthHeaders()

  const entries = await Promise.all(
    dashboardResourceLinks.map(async (resource) => {
      try {
        const payload = await api.get<unknown[]>(resource.endpoint, { headers })
        const list = toList(payload.data)
        return [resource.name, list.length] as const
      } catch {
        return [resource.name, 0] as const
      }
    }),
  )

  return Object.fromEntries(entries) as Record<string, number>
})
