import type { Role } from "#/features/roles/model/types"
import type { Resource, Timestamps } from "#/shared/types"

export type Permission = {
  id: number
  name: string
  label: string
  resourceId: number
  resource?: Resource
  is_active: boolean
}

export type RolePermission = Timestamps & {
  id: number
  roleId: number
  permissionId: number
  is_active: boolean
  role?: Role
  permission?: Permission
}
