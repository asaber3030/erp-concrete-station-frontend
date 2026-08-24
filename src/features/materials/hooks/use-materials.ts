import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { createMaterial, deleteMaterial, getMaterialById, listMaterials, updateMaterial } from "../api/materials.api"
import type { CreateMaterialInput, MaterialQueryParams, UpdateMaterialInput } from "../model/types"
import { queryKeys } from "#/shared/config/querykeys"

export function useMaterialsQuery(params: MaterialQueryParams) {
  return useQuery({
    queryKey: queryKeys.materials(params),
    queryFn: () => listMaterials({ data: params }),
  })
}

export function useMaterialQuery(id: number) {
  return useQuery({
    queryKey: queryKeys.material(id),
    queryFn: () => getMaterialById({ data: { id } }),
    enabled: Boolean(id),
  })
}

export function useCreateMaterialMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateMaterialInput) => createMaterial({ data }),
    onSuccess: () => {
      toast.success("تم إضافة المادة بنجاح")
      queryClient.invalidateQueries({ queryKey: queryKeys.materials() })
    },
    onError: (err: Error) => {
      toast.error(err.message || "حدث خطأ أثناء إضافة المادة")
    },
  })
}

export function useUpdateMaterialMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateMaterialInput) => updateMaterial({ data }),
    onSuccess: () => {
      toast.success("تم تحديث بيانات المادة بنجاح")
      queryClient.invalidateQueries({ queryKey: queryKeys.materials() })
    },
    onError: (err: Error) => {
      toast.error(err.message || "حدث خطأ أثناء تحديث المادة")
    },
  })
}

export function useDeleteMaterialMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteMaterial({ data: { id } }),
    onSuccess: () => {
      toast.success("تم حذف المادة بنجاح")
      queryClient.invalidateQueries({ queryKey: queryKeys.materials() })
    },
    onError: (err: Error) => {
      toast.error(err.message || "حدث خطأ أثناء حذف المادة")
    },
  })
}
