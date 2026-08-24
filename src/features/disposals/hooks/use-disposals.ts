import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { approveDisposal, deleteDisposal, listDisposals, requestDisposal, type DisposalQueryParams } from "../api/disposals-api"
import type { Disposal, RequestDisposalInput } from "../model/types"
import type { PaginatedResponse } from "#/shared/api/http"

export const disposalsQueryKey = (params?: DisposalQueryParams) => ["disposals", params] as const

export function useDisposalsQuery(params?: DisposalQueryParams, initialData?: PaginatedResponse<Disposal> | Disposal[]) {
  return useQuery({
    queryKey: disposalsQueryKey(params),
    queryFn: () => listDisposals({ data: params }),
    initialData: Array.isArray(initialData) ? { data: initialData, meta: { total: initialData.length, page: 1, per_page: initialData.length || 15, last_page: 1 } } : initialData,
  })
}

export function useRequestDisposalMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: RequestDisposalInput) => requestDisposal({ data }),
    onSuccess: () => {
      toast.success("تم تقديم طلب التكّهين بنجاح")
      queryClient.invalidateQueries({ queryKey: ["disposals"] })
      queryClient.invalidateQueries({ queryKey: ["inventory"] })
    },
    onError: (err: Error) => {
      toast.error(err.message || "حدث خطأ أثناء تقديم طلب التكهين")
    },
  })
}

export function useApproveDisposalMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: { id: string | number; status?: "approved" | "rejected" }) => approveDisposal({ data: payload }),
    onSuccess: () => {
      toast.success("تم تحديث حالة طلب التكهين بنجاح")
      queryClient.invalidateQueries({ queryKey: ["disposals"] })
      queryClient.invalidateQueries({ queryKey: ["inventory"] })
    },
    onError: (err: Error) => {
      toast.error(err.message || "حدث خطأ أثناء تحديث حالة طلب التكهين")
    },
  })
}

export function useDeleteDisposalMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string | number) => deleteDisposal({ data: { id } }),
    onSuccess: () => {
      toast.success("تم حذف طلب التكهين بنجاح")
      queryClient.invalidateQueries({ queryKey: ["disposals"] })
      queryClient.invalidateQueries({ queryKey: ["inventory"] })
    },
    onError: (err: Error) => {
      toast.error(err.message || "حدث خطأ أثناء حذف طلب التكهين")
    },
  })
}
