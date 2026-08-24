import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { createUnit, deleteUnit, listUnits, updateUnit } from "../api/units-api"
import type { CreateUnitInput, Unit, UpdateUnitInput } from "../model/types"
import type { PaginatedResponse, PaginationParams } from "#/shared/types"

export const unitsQueryKey = (params?: PaginationParams) => ["units", params] as const

export function useUnitsQuery(params?: PaginationParams) {
  return useQuery({
    queryKey: unitsQueryKey(params),
    queryFn: () => listUnits({ data: params }),
  })
}

export function useCreateUnitMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateUnitInput) => createUnit({ data }),
    onSuccess: () => {
      toast.success("تم إضافة الوحدة بنجاح")
      queryClient.invalidateQueries({ queryKey: ["units"] })
    },
    onError: (err: Error) => {
      toast.error(err.message || "حدث خطأ أثناء إضافة الوحدة")
    },
  })
}

export function useUpdateUnitMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateUnitInput) => updateUnit({ data }),
    onSuccess: () => {
      toast.success("تم تحديث بيانات الوحدة بنجاح")
      queryClient.invalidateQueries({ queryKey: ["units"] })
    },
    onError: (err: Error) => {
      toast.error(err.message || "حدث خطأ أثناء تحديث الوحدة")
    },
  })
}

export function useDeleteUnitMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string | number) => deleteUnit({ data: { id } }),
    onSuccess: () => {
      toast.success("تم حذف الوحدة بنجاح")
      queryClient.invalidateQueries({ queryKey: ["units"] })
    },
    onError: (err: Error) => {
      toast.error(err.message || "حدث خطأ أثناء حذف الوحدة")
    },
  })
}
