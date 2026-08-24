import type { Permission } from "#/features/permissions/model/types"
import type z from "zod"
import { searchSchema } from "../schema"

export type TDefaultLocales = "en" | "ar"
export type EntityId = number
export type ApiList<T> = T[] | { data: T[]; total?: number; meta?: Record<string, unknown> }
export type PermissionAction = "create" | "read" | "update" | "delete" | "approve"

export type Timestamps = {
  createdAt: string
  updatedAt: string
}

export type User = {
  id: number
  name: string
  is_active: boolean
  role?: Role
  roleId?: number
}

export type SessionUser = User & {
  permissions?: string[]
}

export type ApiResponse<T> = {
  message: string
  data: T | null
  status: number
  error: string | null
}

export type Resource = Timestamps & {
  id: number
  name: string
  label: string
  permissions?: Permission[]
}

export type TSearchSchema = z.infer<typeof searchSchema>


export type PaginationMeta = {
  total: number
  page: number
  per_page: number
  last_page: number
}

export type PaginatedResponse<T> = {
  data: T[]
  meta: PaginationMeta
}

export type PaginationParams = {
  page?: number
  per_page?: number
  search?: string
  [key: string]: unknown
}

export type ApiResponse<T> = {
  message: string
  data: T | null
  status: number
  error: string | null
}
