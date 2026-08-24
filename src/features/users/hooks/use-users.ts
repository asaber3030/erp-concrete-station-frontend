import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { createUser, deleteUser, listUsers, updateUser } from "../api/users-api"
import type { CreateUserInput, UpdateUserInput, User } from "../model/types"
import type { PaginatedResponse, PaginationParams } from "#/shared/api/http"

export const usersQueryKey = (params?: PaginationParams) => ["users", params] as const

export function useUsersQuery(params?: PaginationParams, initialData?: PaginatedResponse<User> | User[]) {
  return useQuery({
    queryKey: usersQueryKey(params),
    queryFn: () => listUsers({ data: params }),
    initialData: Array.isArray(initialData) ? { data: initialData, meta: { total: initialData.length, page: 1, per_page: initialData.length || 15, last_page: 1 } } : initialData,
  })
}

export function useCreateUserMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateUserInput) => createUser({ data }),
    onSuccess: () => {
      toast.success("تم إضافة المستخدم بنجاح")
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
    onError: (err: Error) => {
      toast.error(err.message || "حدث خطأ أثناء إضافة المستخدم")
    },
  })
}

export function useUpdateUserMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateUserInput) => updateUser({ data }),
    onSuccess: () => {
      toast.success("تم تحديث بيانات المستخدم بنجاح")
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
    onError: (err: Error) => {
      toast.error(err.message || "حدث خطأ أثناء تحديث البيانات")
    },
  })
}

export function useDeleteUserMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string | number) => deleteUser({ data: { id } }),
    onSuccess: () => {
      toast.success("تم حذف المستخدم بنجاح")
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
    onError: (err: Error) => {
      toast.error(err.message || "حدث خطأ أثناء حذف المستخدم")
    },
  })
}
