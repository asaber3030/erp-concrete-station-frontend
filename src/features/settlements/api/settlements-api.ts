import { createServerFn } from "@tanstack/react-start"
import { getCookie } from "@tanstack/react-start/server"
import { z } from "zod"
import { api, toPaginated, type PaginatedResponse, type PaginationParams } from "#/shared/api/http"
import { AUTH_CONFIG } from "#/shared/config/app/auth"
import { createSettlementSchema } from "../model/schema"
import type { CreateSettlementInput, Settlement } from "../model/types"

function getAuthHeaders() {
  const token = getCookie(AUTH_CONFIG.tokenCookieName)
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export type SettlementQueryParams = PaginationParams & {
  materialId?: string
  stationId?: string
}

export const listSettlements = createServerFn({ method: "GET" })
  .validator((data?: SettlementQueryParams) => data ?? {})
  .handler(async ({ data }) => {
    const payload = await api.get<PaginatedResponse<Settlement>>("/settlements", {
      headers: getAuthHeaders(),
      params: data,
    })
    return toPaginated<Settlement>(payload.data)
  })

export const getSettlementById = createServerFn({ method: "GET" })
  .validator((data: { id: string | number }) => z.object({ id: z.union([z.string(), z.number()]) }).parse(data))
  .handler(async ({ data }) => {
    const payload = await api.get<Settlement>(`/settlements/${data.id}`, {
      headers: getAuthHeaders(),
    })
    return payload.data
  })

export const createSettlement = createServerFn({ method: "POST" })
  .validator((data: CreateSettlementInput) => createSettlementSchema.parse(data))
  .handler(async ({ data }) => {
    const payload = await api.post<Settlement>("/settlements", data, {
      headers: getAuthHeaders(),
    })
    return payload
  })

export const deleteSettlement = createServerFn({ method: "POST" })
  .validator((data: { id: string | number }) => z.object({ id: z.union([z.string(), z.number()]) }).parse(data))
  .handler(async ({ data }) => {
    const payload = await api.delete<{ success?: boolean }>(`/settlements/${data.id}`, {
      headers: getAuthHeaders(),
    })
    return payload
  })
