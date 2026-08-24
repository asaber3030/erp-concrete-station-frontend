import type { RolePermission } from "#/features/permissions/model/types"
import type { Timestamps } from "#/shared/types"

export type Role = Timestamps & {
  id: number
  name: string
  label: string
  is_active: boolean
  rolePermissions?: RolePermission[]
}

export type CreateRoleInput = {
  name: string
  label?: string
  permissions?: number[]
}

export type UpdateRoleInput = CreateRoleInput
