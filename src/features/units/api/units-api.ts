import { createServerFn } from "@tanstack/react-start"
import { getCookie } from "@tanstack/react-start/server"
import { z } from "zod"
import { api, toPaginated } from "#/shared/api/http"
import { AUTH_CONFIG } from "#/shared/config/app/auth"
import { createUnitSchema, updateUnitSchema } from "../model/schema"
import type { CreateUnitInput, Unit, UpdateUnitInput } from "../model/types"
import type { PaginatedResponse, PaginationParams } from "#/shared/types"

function getAuthHeaders() {
  const token = getCookie(AUTH_CONFIG.tokenCookieName)
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const listUnits = createServerFn({ method: "GET" })
  .validator((data?: PaginationParams) => data ?? {})
  .handler(async ({ data }) => {
    const payload = await api.get<PaginatedResponse<Unit>>("/units", {
      headers: getAuthHeaders(),
      params: data,
    })
    return toPaginated<Unit>(payload.data)
  })

export const createUnit = createServerFn({ method: "POST" })
  .validator((data: CreateUnitInput) => createUnitSchema.parse(data))
  .handler(async ({ data }) => {
    const payload = await api.post<Unit>("/units", data, {
      headers: getAuthHeaders(),
    })
    return payload
  })

export const updateUnit = createServerFn({ method: "POST" })
  .validator((data: UpdateUnitInput) => updateUnitSchema.parse(data))
  .handler(async ({ data }) => {
    const { id, ...body } = data
    const payload = await api.patch<Unit>(`/units/${id}`, body, {
      headers: getAuthHeaders(),
    })
    return payload
  })

export const deleteUnit = createServerFn({ method: "POST" })
  .validator((data: { id: string | number }) => z.object({ id: z.union([z.string(), z.number()]) }).parse(data))
  .handler(async ({ data }) => {
    const payload = await api.delete<{ success?: boolean }>(`/units/${data.id}`, {
      headers: getAuthHeaders(),
    })
    return payload
  })
