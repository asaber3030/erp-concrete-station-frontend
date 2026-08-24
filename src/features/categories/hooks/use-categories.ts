import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { createCategory, deleteCategory, listCategories, updateCategory } from "../api/categories-api"
import type { Category, CreateCategoryInput, UpdateCategoryInput } from "../model/types"
import type { PaginatedResponse, PaginationParams } from "#/shared/types"

export const categoriesQueryKey = (params?: PaginationParams) => ["categories", params] as const

export function useCategoriesQuery(params?: PaginationParams, initialData?: PaginatedResponse<Category> | Category[]) {
  return useQuery({
    queryKey: categoriesQueryKey(params),
    queryFn: () => listCategories({ data: params }),
    initialData: Array.isArray(initialData) ? { data: initialData, meta: { total: initialData.length, page: 1, per_page: initialData.length || 15, last_page: 1 } } : initialData,
  })
}

export function useCreateCategoryMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateCategoryInput) => createCategory({ data }),
    onSuccess: () => {
      toast.success("تم إضافة التصنيف بنجاح")
      queryClient.invalidateQueries({ queryKey: ["categories"] })
    },
    onError: (err: Error) => {
      toast.error(err.message || "حدث خطأ أثناء إضافة التصنيف")
    },
  })
}

export function useUpdateCategoryMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateCategoryInput) => updateCategory({ data }),
    onSuccess: () => {
      toast.success("تم تحديث بيانات التصنيف بنجاح")
      queryClient.invalidateQueries({ queryKey: ["categories"] })
    },
    onError: (err: Error) => {
      toast.error(err.message || "حدث خطأ أثناء تحديث التصنيف")
    },
  })
}

export function useDeleteCategoryMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string | number) => deleteCategory({ data: { id } }),
    onSuccess: () => {
      toast.success("تم حذف التصنيف بنجاح")
      queryClient.invalidateQueries({ queryKey: ["categories"] })
    },
    onError: (err: Error) => {
      toast.error(err.message || "حدث خطأ أثناء حذف التصنيف")
    },
  })
}
