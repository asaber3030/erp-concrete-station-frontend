import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { listInventory, recordAdjustment, type InventoryQueryParams } from "../api/inventory-api"
import type { InventoryItem, RecordAdjustmentInput } from "../model/types"
import type { PaginatedResponse } from "#/shared/api/http"

export const inventoryQueryKey = (params?: InventoryQueryParams) => ["inventory", params] as const

export function useInventoryQuery(params?: InventoryQueryParams, initialData?: PaginatedResponse<InventoryItem> | InventoryItem[]) {
  return useQuery({
    queryKey: inventoryQueryKey(params),
    queryFn: () => listInventory({ data: params }),
    initialData: Array.isArray(initialData) ? { data: initialData, meta: { total: initialData.length, page: 1, per_page: initialData.length || 15, last_page: 1 } } : initialData,
  })
}

export function useRecordAdjustmentMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: RecordAdjustmentInput) => recordAdjustment({ data }),
    onSuccess: () => {
      toast.success("تم تسجيل حركة تعديل المخزون بنجاح")
      queryClient.invalidateQueries({ queryKey: ["inventory"] })
    },
    onError: (err: Error) => {
      toast.error(err.message || "حدث خطأ أثناء تعديل المخزون")
    },
  })
}
