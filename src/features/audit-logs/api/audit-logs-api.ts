import { createServerFn } from "@tanstack/react-start"
import { getCookie } from "@tanstack/react-start/server"
import { api, toPaginated, type PaginatedResponse, type PaginationParams } from "#/shared/api/http"
import { AUTH_CONFIG } from "#/shared/config/app/auth"
import type { AuditLog } from "../model/types"

function getAuthHeaders() {
  const token = getCookie(AUTH_CONFIG.tokenCookieName)
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export type AuditLogQueryParams = PaginationParams & {
  userId?: string
  resource?: string
}

export const listAuditLogs = createServerFn({ method: "GET" })
  .validator((data?: AuditLogQueryParams) => data ?? {})
  .handler(async ({ data }) => {
    const payload = await api.get<PaginatedResponse<AuditLog>>("/audit-logs", {
      headers: getAuthHeaders(),
      params: data,
    })
    return toPaginated<AuditLog>(payload.data)
  })
