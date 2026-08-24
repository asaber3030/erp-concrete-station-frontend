import { createServerFn } from "@tanstack/react-start"
import { getCookie } from "@tanstack/react-start/server"
import { z } from "zod"
import { api, toPaginated, type PaginatedResponse, type PaginationParams } from "#/shared/api/http"
import { AUTH_CONFIG } from "#/shared/config/app/auth"
import { createSupplierSchema, updateSupplierSchema } from "../model/schema"
import type { CreateSupplierInput, Supplier, UpdateSupplierInput } from "../model/types"

function getAuthHeaders() {
  const token = getCookie(AUTH_CONFIG.tokenCookieName)
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const listSuppliers = createServerFn({ method: "GET" })
  .validator((data?: PaginationParams) => data ?? {})
  .handler(async ({ data }) => {
    const payload = await api.get<PaginatedResponse<Supplier>>("/suppliers", {
      headers: getAuthHeaders(),
      params: data,
    })
    return toPaginated<Supplier>(payload.data)
  })

export const createSupplier = createServerFn({ method: "POST" })
  .validator((data: CreateSupplierInput) => createSupplierSchema.parse(data))
  .handler(async ({ data }) => {
    const payload = await api.post<Supplier>("/suppliers", data, {
      headers: getAuthHeaders(),
    })
    return payload
  })

export const updateSupplier = createServerFn({ method: "POST" })
  .validator((data: UpdateSupplierInput) => updateSupplierSchema.parse(data))
  .handler(async ({ data }) => {
    const { id, ...body } = data
    const payload = await api.patch<Supplier>(`/suppliers/${id}`, body, {
      headers: getAuthHeaders(),
    })
    return payload
  })

export const deleteSupplier = createServerFn({ method: "POST" })
  .validator((data: { id: string | number }) => z.object({ id: z.union([z.string(), z.number()]) }).parse(data))
  .handler(async ({ data }) => {
    const payload = await api.delete<{ success?: boolean }>(`/suppliers/${data.id}`, {
      headers: getAuthHeaders(),
    })
    return payload
  })
