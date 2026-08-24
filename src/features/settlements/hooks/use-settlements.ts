import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { createSettlement, deleteSettlement, listSettlements, type SettlementQueryParams } from "../api/settlements-api"
import type { CreateSettlementInput, Settlement } from "../model/types"
import type { PaginatedResponse } from "#/shared/api/http"

export const settlementsQueryKey = (params?: SettlementQueryParams) => ["settlements", params] as const

export function useSettlementsQuery(params?: SettlementQueryParams, initialData?: PaginatedResponse<Settlement> | Settlement[]) {
  return useQuery({
    queryKey: settlementsQueryKey(params),
    queryFn: () => listSettlements({ data: params }),
    initialData: Array.isArray(initialData) ? { data: initialData, meta: { total: initialData.length, page: 1, per_page: initialData.length || 15, last_page: 1 } } : initialData,
  })
}

export function useCreateSettlementMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateSettlementInput) => createSettlement({ data }),
    onSuccess: () => {
      toast.success("تم إنشاء تسوية المخزون بنجاح")
      queryClient.invalidateQueries({ queryKey: ["settlements"] })
      queryClient.invalidateQueries({ queryKey: ["inventory"] })
    },
    onError: (err: Error) => {
      toast.error(err.message || "حدث خطأ أثناء إجراء تسوية المخزون")
    },
  })
}

export function useDeleteSettlementMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string | number) => deleteSettlement({ data: { id } }),
    onSuccess: () => {
      toast.success("تم حذف التسوية بنجاح")
      queryClient.invalidateQueries({ queryKey: ["settlements"] })
      queryClient.invalidateQueries({ queryKey: ["inventory"] })
    },
    onError: (err: Error) => {
      toast.error(err.message || "حدث خطأ أثناء حذف التسوية")
    },
  })
}
