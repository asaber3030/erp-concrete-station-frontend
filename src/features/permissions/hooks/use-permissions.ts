import { useQuery } from "@tanstack/react-query"
import { listAllPermissions, listPermissions } from "../api/permissions-api"
import type { Permission } from "../model/types"

export const permissionsQueryKey = ["permissions"] as const
export const permissionsAllQueryKey = ["permissions", "all"] as const

export function usePermissionsQuery(initialData?: Permission[]) {
  return useQuery({
    queryKey: permissionsQueryKey,
    queryFn: () => listPermissions(),
    initialData,
  })
}

export function useAllPermissionsQuery(initialData?: Permission[]) {
  return useQuery({
    queryKey: permissionsAllQueryKey,
    queryFn: () => listAllPermissions(),
    initialData,
  })
}
