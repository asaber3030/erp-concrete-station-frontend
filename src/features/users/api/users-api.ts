import { createServerFn } from "@tanstack/react-start"
import { getCookie } from "@tanstack/react-start/server"
import { z } from "zod"
import { api, toPaginated, type PaginatedResponse, type PaginationParams } from "#/shared/api/http"
import { AUTH_CONFIG } from "#/shared/config/app/auth"
import { createUserSchema, updateUserSchema } from "../model/schema"
import type { CreateUserInput, UpdateUserInput, User } from "../model/types"

function getAuthHeaders() {
  const token = getCookie(AUTH_CONFIG.tokenCookieName)
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const listUsers = createServerFn({ method: "GET" })
  .validator((data?: PaginationParams) => data ?? {})
  .handler(async ({ data }) => {
    const payload = await api.get<PaginatedResponse<User>>("/users", {
      headers: getAuthHeaders(),
      params: data,
    })
    return toPaginated<User>(payload.data)
  })

export const createUser = createServerFn({ method: "POST" })
  .validator((data: CreateUserInput) => createUserSchema.parse(data))
  .handler(async ({ data }) => {
    const payload = await api.post<User>("/users", data, {
      headers: getAuthHeaders(),
    })
    return payload
  })

export const updateUser = createServerFn({ method: "POST" })
  .validator((data: UpdateUserInput) => updateUserSchema.parse(data))
  .handler(async ({ data }) => {
    const { id, ...body } = data
    const payload = await api.patch<User>(`/users/${id}`, body, {
      headers: getAuthHeaders(),
    })
    return payload
  })

export const deleteUser = createServerFn({ method: "POST" })
  .validator((data: { id: string | number }) => z.object({ id: z.union([z.string(), z.number()]) }).parse(data))
  .handler(async ({ data }) => {
    const payload = await api.delete<{ success?: boolean }>(`/users/${data.id}`, {
      headers: getAuthHeaders(),
    })
    return payload
  })
