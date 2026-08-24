import { createServerFn } from "@tanstack/react-start"
import { getCookie } from "@tanstack/react-start/server"
import { z } from "zod"
import { api, toPaginated, type PaginatedResponse, type PaginationParams } from "#/shared/api/http"
import { AUTH_CONFIG } from "#/shared/config/app/auth"
import { requestDisposalSchema } from "../model/schema"
import type { Disposal, RequestDisposalInput } from "../model/types"

function getAuthHeaders() {
  const token = getCookie(AUTH_CONFIG.tokenCookieName)
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export type DisposalQueryParams = PaginationParams & {
  materialId?: string
  stationId?: string
  status?: string
}

export type StationDisposalsAnalytics = {
  summary: {
    totalDisposals: number
    totalQuantity: number
    totalPrice: number
    statusBreakdown: {
      PENDING: number
      APPROVED: number
      REJECTED: number
    }
  }
  materialsBreakdown: Array<{
    materialId: number | string
    materialName?: string
    totalQuantity: number
    totalPrice: number
    count: number
  }>
  recentDisposals: Disposal[]
}

export const listDisposals = createServerFn({ method: "GET" })
  .validator((data?: DisposalQueryParams) => data ?? {})
  .handler(async ({ data }) => {
    const payload = await api.get<PaginatedResponse<Disposal>>("/disposals", {
      headers: getAuthHeaders(),
      params: data,
    })
    return toPaginated<Disposal>(payload.data)
  })

export const getDisposalById = createServerFn({ method: "GET" })
  .validator((data: { id: string | number }) => z.object({ id: z.union([z.string(), z.number()]) }).parse(data))
  .handler(async ({ data }) => {
    const payload = await api.get<Disposal>(`/disposals/${data.id}`, {
      headers: getAuthHeaders(),
    })
    return payload.data
  })

export const getStationDisposalsAnalytics = createServerFn({ method: "GET" })
  .validator((data: { stationId: string | number }) => z.object({ stationId: z.union([z.string(), z.number()]) }).parse(data))
  .handler(async ({ data }) => {
    const payload = await api.get<StationDisposalsAnalytics>(`/stations/${data.stationId}/disposals/analytics`, {
      headers: getAuthHeaders(),
    })
    return payload.data
  })

export const requestDisposal = createServerFn({ method: "POST" })
  .validator((data: RequestDisposalInput) => requestDisposalSchema.parse(data))
  .handler(async ({ data }) => {
    const payload = await api.post<Disposal>("/disposals", data, {
      headers: getAuthHeaders(),
    })
    return payload
  })

export const approveDisposal = createServerFn({ method: "POST" })
  .validator((data: { id: string | number; status?: "approved" | "rejected" }) => z.object({ id: z.union([z.string(), z.number()]), status: z.enum(["approved", "rejected"]).optional() }).parse(data))
  .handler(async ({ data }) => {
    const payload = await api.post<Disposal>(
      `/disposals/${data.id}/approve`,
      { status: data.status || "approved" },
      {
        headers: getAuthHeaders(),
      },
    )
    return payload
  })

export const deleteDisposal = createServerFn({ method: "POST" })
  .validator((data: { id: string | number }) => z.object({ id: z.union([z.string(), z.number()]) }).parse(data))
  .handler(async ({ data }) => {
    const payload = await api.delete<{ success?: boolean }>(`/disposals/${data.id}`, {
      headers: getAuthHeaders(),
    })
    return payload
  })
