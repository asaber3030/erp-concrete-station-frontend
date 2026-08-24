import { createServerFn } from "@tanstack/react-start"
import { getCookie } from "@tanstack/react-start/server"
import { z } from "zod"
import { api, toPaginated, type PaginatedResponse, type PaginationParams } from "#/shared/api/http"
import { AUTH_CONFIG } from "#/shared/config/app/auth"
import { createStationSchema, updateStationSchema } from "../model/schema"
import type { CreateStationInput, Station, UpdateStationInput } from "../model/types"

function getAuthHeaders() {
  const token = getCookie(AUTH_CONFIG.tokenCookieName)
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const listStations = createServerFn({ method: "GET" })
  .validator((data?: PaginationParams) => data ?? {})
  .handler(async ({ data }) => {
    const payload = await api.get<PaginatedResponse<Station>>("/stations", {
      headers: getAuthHeaders(),
      params: data,
    })
    return toPaginated<Station>(payload.data)
  })

export const getStationById = createServerFn({ method: "GET" })
  .validator((data: { id: string | number }) => z.object({ id: z.union([z.string(), z.number()]) }).parse(data))
  .handler(async ({ data }) => {
    const payload = await api.get<Station>(`/stations/${data.id}`, {
      headers: getAuthHeaders(),
    })
    return payload.data
  })

export const createStation = createServerFn({ method: "POST" })
  .validator((data: CreateStationInput) => createStationSchema.parse(data))
  .handler(async ({ data }) => {
    const payload = await api.post<Station>("/stations", data, {
      headers: getAuthHeaders(),
    })
    return payload
  })

export const updateStation = createServerFn({ method: "POST" })
  .validator((data: UpdateStationInput) => updateStationSchema.parse(data))
  .handler(async ({ data }) => {
    const { id, ...body } = data
    const payload = await api.patch<Station>(`/stations/${id}`, body, {
      headers: getAuthHeaders(),
    })
    return payload
  })

export const deleteStation = createServerFn({ method: "POST" })
  .validator((data: { id: string | number }) => z.object({ id: z.union([z.string(), z.number()]) }).parse(data))
  .handler(async ({ data }) => {
    const payload = await api.delete<{ success?: boolean }>(`/stations/${data.id}`, {
      headers: getAuthHeaders(),
    })
    return payload
  })
