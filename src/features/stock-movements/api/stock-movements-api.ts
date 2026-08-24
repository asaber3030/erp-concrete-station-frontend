import { createServerFn } from "@tanstack/react-start"
import { getCookie } from "@tanstack/react-start/server"
import { z } from "zod"
import { api, toPaginated, type PaginatedResponse, type PaginationParams } from "#/shared/api/http"
import { AUTH_CONFIG } from "#/shared/config/app/auth"
import { createStockMovementSchema } from "../model/schema"
import type { CreateStockMovementInput, StockMovement } from "../model/types"

function getAuthHeaders() {
  const token = getCookie(AUTH_CONFIG.tokenCookieName)
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export type StockMovementQueryParams = PaginationParams & {
  materialId?: string
  stationId?: string
  type?: string
}

export const listStockMovements = createServerFn({ method: "GET" })
  .validator((data?: StockMovementQueryParams) => data ?? {})
  .handler(async ({ data }) => {
    const payload = await api.get<PaginatedResponse<StockMovement>>("/stock-movements", {
      headers: getAuthHeaders(),
      params: data,
    })
    return toPaginated<StockMovement>(payload.data)
  })

export const getStockMovementById = createServerFn({ method: "GET" })
  .validator((data: { id: string | number }) => z.object({ id: z.union([z.string(), z.number()]) }).parse(data))
  .handler(async ({ data }) => {
    const payload = await api.get<StockMovement>(`/stock-movements/${data.id}`, {
      headers: getAuthHeaders(),
    })
    return payload.data
  })

export const createStockMovement = createServerFn({ method: "POST" })
  .validator((data: CreateStockMovementInput) => createStockMovementSchema.parse(data))
  .handler(async ({ data }) => {
    const payload = await api.post<StockMovement>("/stock-movements", data, {
      headers: getAuthHeaders(),
    })
    return payload
  })

export const deleteStockMovement = createServerFn({ method: "POST" })
  .validator((data: { id: string | number }) => z.object({ id: z.union([z.string(), z.number()]) }).parse(data))
  .handler(async ({ data }) => {
    const payload = await api.delete<{ success?: boolean }>(`/stock-movements/${data.id}`, {
      headers: getAuthHeaders(),
    })
    return payload
  })
