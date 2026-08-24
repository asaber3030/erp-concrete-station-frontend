import { createServerFn } from "@tanstack/react-start"
import { getCookie } from "@tanstack/react-start/server"
import { z } from "zod"
import { api, toPaginated, type PaginatedResponse, type PaginationParams } from "#/shared/api/http"
import { AUTH_CONFIG } from "#/shared/config/app/auth"
import { createInvoiceSchema, updateInvoiceSchema } from "../model/schema"
import type { CreateInvoiceInput, Invoice, UpdateInvoiceInput } from "../model/types"

function getAuthHeaders() {
  const token = getCookie(AUTH_CONFIG.tokenCookieName)
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const listInvoices = createServerFn({ method: "GET" })
  .validator((data?: PaginationParams) => data ?? {})
  .handler(async ({ data }) => {
    const payload = await api.get<PaginatedResponse<Invoice>>("/invoices", {
      headers: getAuthHeaders(),
      params: data,
    })
    return toPaginated<Invoice>(payload.data)
  })

export const getInvoice = createServerFn({ method: "GET" })
  .validator((data: { id: string | number }) => z.object({ id: z.union([z.string(), z.number()]) }).parse(data))
  .handler(async ({ data }) => {
    const payload = await api.get<Invoice>(`/invoices/${data.id}`, {
      headers: getAuthHeaders(),
    })
    return payload.data
  })

export const createInvoice = createServerFn({ method: "POST" })
  .validator((data: CreateInvoiceInput) => createInvoiceSchema.parse(data))
  .handler(async ({ data }) => {
    const payload = await api.post<Invoice>("/invoices", data, {
      headers: getAuthHeaders(),
    })
    return payload
  })

export const updateInvoice = createServerFn({ method: "POST" })
  .validator((data: UpdateInvoiceInput) => updateInvoiceSchema.parse(data))
  .handler(async ({ data }) => {
    const { id, ...body } = data
    const payload = await api.patch<Invoice>(`/invoices/${id}`, body, {
      headers: getAuthHeaders(),
    })
    return payload
  })

export const deleteInvoice = createServerFn({ method: "POST" })
  .validator((data: { id: string | number }) => z.object({ id: z.union([z.string(), z.number()]) }).parse(data))
  .handler(async ({ data }) => {
    const payload = await api.delete<{ success?: boolean }>(`/invoices/${data.id}`, {
      headers: getAuthHeaders(),
    })
    return payload
  })

export const issueInvoice = createServerFn({ method: "POST" })
  .validator((data: { id: string | number }) => z.object({ id: z.union([z.string(), z.number()]) }).parse(data))
  .handler(async ({ data }) => {
    const payload = await api.post<Invoice>(
      `/invoices/${data.id}/issue`,
      {},
      {
        headers: getAuthHeaders(),
      },
    )
    return payload
  })
