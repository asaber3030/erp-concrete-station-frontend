import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { createStockMovement, deleteStockMovement, listStockMovements, type StockMovementQueryParams } from "../api/stock-movements-api"
import type { CreateStockMovementInput, StockMovement } from "../model/types"
import type { PaginatedResponse } from "#/shared/api/http"

export const stockMovementsQueryKey = (params?: StockMovementQueryParams) => ["stock-movements", params] as const

export function useStockMovementsQuery(params?: StockMovementQueryParams, initialData?: PaginatedResponse<StockMovement> | StockMovement[]) {
  return useQuery({
    queryKey: stockMovementsQueryKey(params),
    queryFn: () => listStockMovements({ data: params }),
    initialData: Array.isArray(initialData) ? { data: initialData, meta: { total: initialData.length, page: 1, per_page: initialData.length || 15, last_page: 1 } } : initialData,
  })
}

export function useCreateStockMovementMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateStockMovementInput) => createStockMovement({ data }),
    onSuccess: () => {
      toast.success("تم تسجيل حركة المخزون بنجاح")
      queryClient.invalidateQueries({ queryKey: ["stock-movements"] })
      queryClient.invalidateQueries({ queryKey: ["inventory"] })
    },
    onError: (err: Error) => {
      toast.error(err.message || "حدث خطأ أثناء تسجيل حركة المخزون")
    },
  })
}

export function useDeleteStockMovementMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string | number) => deleteStockMovement({ data: { id } }),
    onSuccess: () => {
      toast.success("تم حذف حركة المخزون بنجاح")
      queryClient.invalidateQueries({ queryKey: ["stock-movements"] })
      queryClient.invalidateQueries({ queryKey: ["inventory"] })
    },
    onError: (err: Error) => {
      toast.error(err.message || "حدث خطأ أثناء حذف حركة المخزون")
    },
  })
}
