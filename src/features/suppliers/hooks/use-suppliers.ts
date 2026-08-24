import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { createSupplier, deleteSupplier, listSuppliers, updateSupplier } from "../api/suppliers-api"
import type { CreateSupplierInput, Supplier, UpdateSupplierInput } from "../model/types"
import type { PaginatedResponse, PaginationParams } from "#/shared/api/http"

export const suppliersQueryKey = (params?: PaginationParams) => ["suppliers", params] as const

export function useSuppliersQuery(params?: PaginationParams, initialData?: PaginatedResponse<Supplier> | Supplier[]) {
  return useQuery({
    queryKey: suppliersQueryKey(params),
    queryFn: () => listSuppliers({ data: params }),
    initialData: Array.isArray(initialData) ? { data: initialData, meta: { total: initialData.length, page: 1, per_page: initialData.length || 15, last_page: 1 } } : initialData,
  })
}

export function useCreateSupplierMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateSupplierInput) => createSupplier({ data }),
    onSuccess: () => {
      toast.success("تم إضافة المورد بنجاح")
      queryClient.invalidateQueries({ queryKey: ["suppliers"] })
    },
    onError: (err: Error) => {
      toast.error(err.message || "حدث خطأ أثناء إضافة المورد")
    },
  })
}

export function useUpdateSupplierMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateSupplierInput) => updateSupplier({ data }),
    onSuccess: () => {
      toast.success("تم تحديث بيانات المورد بنجاح")
      queryClient.invalidateQueries({ queryKey: ["suppliers"] })
    },
    onError: (err: Error) => {
      toast.error(err.message || "حدث خطأ أثناء تحديث بيانات المورد")
    },
  })
}

export function useDeleteSupplierMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string | number) => deleteSupplier({ data: { id } }),
    onSuccess: () => {
      toast.success("تم حذف المورد بنجاح")
      queryClient.invalidateQueries({ queryKey: ["suppliers"] })
    },
    onError: (err: Error) => {
      toast.error(err.message || "حدث خطأ أثناء حذف المورد")
    },
  })
}
