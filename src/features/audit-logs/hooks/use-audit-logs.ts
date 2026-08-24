import { useQuery } from "@tanstack/react-query"
import { listAuditLogs, type AuditLogQueryParams } from "../api/audit-logs-api"
import type { AuditLog } from "../model/types"
import type { PaginatedResponse } from "#/shared/api/http"

export const auditLogsQueryKey = (params?: AuditLogQueryParams) => ["audit-logs", params] as const

export function useAuditLogsQuery(params?: AuditLogQueryParams, initialData?: PaginatedResponse<AuditLog> | AuditLog[]) {
  return useQuery({
    queryKey: auditLogsQueryKey(params),
    queryFn: () => listAuditLogs({ data: params }),
    initialData: Array.isArray(initialData) ? { data: initialData, meta: { total: initialData.length, page: 1, per_page: initialData.length || 15, last_page: 1 } } : initialData,
  })
}
