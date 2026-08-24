import { createServerFn } from "@tanstack/react-start"
import { getCookie } from "@tanstack/react-start/server"
import { z } from "zod"
import { api, toPaginated, type PaginatedResponse, type PaginationParams } from "#/shared/api/http"
import { AUTH_CONFIG } from "#/shared/config/app/auth"
import { createRoleSchema, updateRoleSchema } from "../model/schema"
import type { CreateRoleInput, Role, UpdateRoleInput } from "../model/types"

function getAuthHeaders() {
  const token = getCookie(AUTH_CONFIG.tokenCookieName)
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const listRoles = createServerFn({ method: "GET" })
  .validator((data?: PaginationParams) => data ?? {})
  .handler(async ({ data }) => {
    const payload = await api.get<PaginatedResponse<Role>>("/roles", {
      headers: getAuthHeaders(),
      params: data,
    })
    return toPaginated<Role>(payload.data)
  })

export const getRoleById = createServerFn({ method: "GET" })
  .validator((data: number) => data)
  .handler(async ({ data }) => {
    const payload = await api.get<Role>(`/roles/${data}`, {
      headers: getAuthHeaders(),
    })
    return payload.data
  })

export const createRole = createServerFn({ method: "POST" })
  .validator((data: CreateRoleInput) => createRoleSchema.parse(data))
  .handler(async ({ data }) => {
    const payload = await api.post<Role>(
      "/roles",
      { ...data, permissionIds: data.permissions.map(Number) },
      {
        headers: getAuthHeaders(),
      },
    )
    return payload
  })

export const updateRole = createServerFn({ method: "POST" })
  .validator((data) => updateRoleSchema.parse(data))
  .handler(async ({ data }) => {
    const payload = await api.patch<Role>(
      `/roles/${data.roleId}`,
      { name: data.name, label: data.label, permissionIds: data.permissions.map(Number) },
      {
        headers: getAuthHeaders(),
      },
    )
    return payload
  })

export const deleteRole = createServerFn({ method: "POST" })
  .validator((data: { id: string | number }) => z.object({ id: z.union([z.string(), z.number()]) }).parse(data))
  .handler(async ({ data }) => {
    const payload = await api.delete<{ success?: boolean }>(`/roles/${data.id}`, {
      headers: getAuthHeaders(),
    })
    return payload
  })
