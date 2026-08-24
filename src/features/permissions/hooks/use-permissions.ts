import { useQuery } from "@tanstack/react-query"
import { listPermissions } from "../api/permissions-api"
import type { Permission } from "../model/types"

export const permissionsQueryKey = ["permissions"] as const

export function usePermissionsQuery(initialData?: Permission[]) {
  return useQuery({
    queryKey: permissionsQueryKey,
    queryFn: () => listPermissions(),
    initialData,
  })
}
