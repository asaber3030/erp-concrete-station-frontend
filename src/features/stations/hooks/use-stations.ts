import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { createStation, deleteStation, getStationById, listStations, updateStation } from "../api/stations-api"
import type { CreateStationInput, Station, UpdateStationInput } from "../model/types"
import type { PaginatedResponse, PaginationParams } from "#/shared/api/http"

export const stationsQueryKey = (params?: PaginationParams) => ["stations", params] as const
export const stationQueryKey = (id: string | number) => ["stations", String(id)] as const

export function useStationsQuery(params?: PaginationParams, initialData?: PaginatedResponse<Station> | Station[]) {
  return useQuery({
    queryKey: stationsQueryKey(params),
    queryFn: () => listStations({ data: params }),
    initialData: Array.isArray(initialData) ? { data: initialData, meta: { total: initialData.length, page: 1, per_page: initialData.length || 15, last_page: 1 } } : initialData,
  })
}

export function useStationQuery(id: string | number, initialData?: Station) {
  return useQuery({
    queryKey: stationQueryKey(id),
    queryFn: () => getStationById({ data: { id } }),
    initialData,
    enabled: Boolean(id),
  })
}

export function useCreateStationMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateStationInput) => createStation({ data }),
    onSuccess: () => {
      toast.success("تم إضافة المحطة بنجاح")
      queryClient.invalidateQueries({ queryKey: ["stations"] })
    },
    onError: (err: Error) => {
      toast.error(err.message || "حدث خطأ أثناء إضافة المحطة")
    },
  })
}

export function useUpdateStationMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateStationInput) => updateStation({ data }),
    onSuccess: () => {
      toast.success("تم تحديث بيانات المحطة بنجاح")
      queryClient.invalidateQueries({ queryKey: ["stations"] })
    },
    onError: (err: Error) => {
      toast.error(err.message || "حدث خطأ أثناء تحديث بيانات المحطة")
    },
  })
}

export function useDeleteStationMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string | number) => deleteStation({ data: { id } }),
    onSuccess: () => {
      toast.success("تم حذف المحطة بنجاح")
      queryClient.invalidateQueries({ queryKey: ["stations"] })
    },
    onError: (err: Error) => {
      toast.error(err.message || "حدث خطأ أثناء حذف المحطة")
    },
  })
}
