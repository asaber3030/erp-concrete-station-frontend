import { createServerFn } from "@tanstack/react-start"
import { getCookie } from "@tanstack/react-start/server"
import { z } from "zod"
import { api, toPaginated } from "#/shared/api/http"
import { AUTH_CONFIG } from "#/shared/config/app/auth"
import { createCategorySchema, updateCategorySchema } from "../model/schema"
import type { Category, CreateCategoryInput, UpdateCategoryInput } from "../model/types"
import type { PaginatedResponse, PaginationParams } from "#/shared/types"

function getAuthHeaders() {
  const token = getCookie(AUTH_CONFIG.tokenCookieName)
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const listCategories = createServerFn({ method: "GET" })
  .validator((data?: PaginationParams) => data ?? {})
  .handler(async ({ data }) => {
    const payload = await api.get<PaginatedResponse<Category>>("/categories", {
      headers: getAuthHeaders(),
      params: data,
    })
    return toPaginated<Category>(payload.data)
  })

export const createCategory = createServerFn({ method: "POST" })
  .validator((data: CreateCategoryInput) => createCategorySchema.parse(data))
  .handler(async ({ data }) => {
    const payload = await api.post<Category>("/categories", data, {
      headers: getAuthHeaders(),
    })
    return payload
  })

export const updateCategory = createServerFn({ method: "POST" })
  .validator((data: UpdateCategoryInput) => updateCategorySchema.parse(data))
  .handler(async ({ data }) => {
    const { id, ...body } = data
    const payload = await api.patch<Category>(`/categories/${id}`, body, {
      headers: getAuthHeaders(),
    })
    return payload
  })

export const deleteCategory = createServerFn({ method: "POST" })
  .validator((data: { id: string | number }) => z.object({ id: z.union([z.string(), z.number()]) }).parse(data))
  .handler(async ({ data }) => {
    const payload = await api.delete<{ success?: boolean }>(`/categories/${data.id}`, {
      headers: getAuthHeaders(),
    })
    return payload
  })
