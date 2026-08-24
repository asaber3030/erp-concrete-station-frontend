import { createServerFn } from "@tanstack/react-start"
import { getCookie } from "@tanstack/react-start/server"
import { z } from "zod"
import { api, toPaginated, type PaginatedResponse, type PaginationParams } from "#/shared/api/http"
import { AUTH_CONFIG } from "#/shared/config/app/auth"
import { recordAdjustmentSchema } from "../model/schema"
import type { InventoryItem, RecordAdjustmentInput } from "../model/types"

function getAuthHeaders() {
  const token = getCookie(AUTH_CONFIG.tokenCookieName)
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export type InventoryQueryParams = PaginationParams & {
  materialId?: string | number
  stationId?: string | number
  belowReorder?: boolean
}

export const listInventory = createServerFn({ method: "GET" })
  .validator((data?: InventoryQueryParams) => data ?? {})
  .handler(async ({ data }) => {
    const payload = await api.get<PaginatedResponse<InventoryItem>>("/inventory", {
      headers: getAuthHeaders(),
      params: data,
    })
    return toPaginated<InventoryItem>(payload.data)
  })

export const getInventoryById = createServerFn({ method: "GET" })
  .validator((data: { id: string | number }) => z.object({ id: z.union([z.string(), z.number()]) }).parse(data))
  .handler(async ({ data }) => {
    const payload = await api.get<InventoryItem>(`/inventory/${data.id}`, {
      headers: getAuthHeaders(),
    })
    return payload.data
  })

export const recordAdjustment = createServerFn({ method: "POST" })
  .validator((data: RecordAdjustmentInput) => recordAdjustmentSchema.parse(data))
  .handler(async ({ data }) => {
    const payload = await api.post<InventoryItem>("/inventory/adjustments", data, {
      headers: getAuthHeaders(),
    })
    return payload
  })
