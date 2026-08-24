import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { createRole, deleteRole, listRoles, updateRole } from "../api/roles-api"
import type { CreateRoleInput, Role, UpdateRoleInput } from "../model/types"
import type { PaginatedResponse, PaginationParams } from "#/shared/api/http"

export const rolesQueryKey = (params?: PaginationParams) => ["roles", params] as const

export function useRolesQuery(params?: PaginationParams, initialData?: PaginatedResponse<Role>) {
  return useQuery({
    queryKey: rolesQueryKey(params),
    queryFn: () => listRoles({ data: params }),
    initialData,
  })
}

export function useCreateRoleMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateRoleInput) => createRole({ data }),
    onSuccess: () => {
      toast.success("تم إضافة الدور بنجاح")
      queryClient.invalidateQueries({ queryKey: ["roles"] })
    },
    onError: (err: Error) => {
      toast.error(err.message || "حدث خطأ أثناء إضافة الدور")
    },
  })
}

export function useUpdateRoleMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ data, roleId }: { data: UpdateRoleInput; roleId: number }) => updateRole({ data: { data, roleId } }),
    onSuccess: () => {
      toast.success("تم تحديث الدور بنجاح")
      queryClient.invalidateQueries({ queryKey: ["roles"] })
    },
    onError: (err: Error) => {
      toast.error(err.message || "حدث خطأ أثناء تحديث الدور")
    },
  })
}

export function useDeleteRoleMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string | number) => deleteRole({ data: { id } }),
    onSuccess: () => {
      toast.success("تم حذف الدور بنجاح")
      queryClient.invalidateQueries({ queryKey: ["roles"] })
    },
    onError: (err: Error) => {
      toast.error(err.message || "حدث خطأ أثناء حذف الدور")
    },
  })
}
