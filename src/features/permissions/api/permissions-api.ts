import { createServerFn } from "@tanstack/react-start"
import { getCookie } from "@tanstack/react-start/server"
import { api, toList } from "#/shared/api/http"
import { AUTH_CONFIG } from "#/shared/config/app/auth"
import type { Permission } from "../model/types"

function getAuthHeaders() {
  const token = getCookie(AUTH_CONFIG.tokenCookieName)
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const listPermissions = createServerFn({ method: "GET" })
  .validator((data?: { search?: string }) => data ?? {})
  .handler(async ({ data }) => {
    const payload = await api.get<Permission[]>("/permissions", {
      headers: getAuthHeaders(),
      params: data,
    })
    return toList(payload.data)
  })
