import { createServerFn } from "@tanstack/react-start"
import z from "zod"
import { api, toPaginated, type PaginatedResponse } from "#/shared/api/http"
import { idSchema } from "#/shared/schema"
import type { Warehouse, Equipment, CostCenter } from "#/shared/types/warehouse"

export const resourceQueryParamsSchema = z.object({
  page: z.number().optional().default(1),
  per_page: z.number().optional().default(15),
  search: z.string().optional(),
})

export type ResourceQueryParams = z.infer<typeof resourceQueryParamsSchema>

// Warehouse Schemas
export const createWarehouseSchema = z.object({
  code: z.string().optional(),
  name: z.string().min(1, "اسم المستودع مطلوب"),
  location: z.string().optional(),
  is_active: z.boolean().optional().default(true),
})

export const updateWarehouseSchema = createWarehouseSchema.partial().extend({
  id: z.number(),
})

export type CreateWarehouseInput = z.infer<typeof createWarehouseSchema>
export type UpdateWarehouseInput = z.infer<typeof updateWarehouseSchema>

// Equipment Schemas
export const createEquipmentSchema = z.object({
  code: z.string().min(1, "رمز المعدة مطلوب"),
  name: z.string().min(1, "اسم المعدة مطلوب"),
  type: z.string().optional(),
  status: z.string().optional(),
})

export const updateEquipmentSchema = createEquipmentSchema.partial().extend({
  id: z.number(),
})

export type CreateEquipmentInput = z.infer<typeof createEquipmentSchema>
export type UpdateEquipmentInput = z.infer<typeof updateEquipmentSchema>

// 1. Warehouses API
export const listWarehouses = createServerFn({ method: "GET" })
  .validator((data: ResourceQueryParams) => resourceQueryParamsSchema.parse(data))
  .handler(async ({ data }) => {
    const payload = await api.get<PaginatedResponse<Warehouse>>("/warehouses", {
      params: data,
    })
    return toPaginated<Warehouse>(payload.data)
  })

export const getWarehouseById = createServerFn({ method: "GET" })
  .validator((data: { id: number }) => idSchema.parse(data))
  .handler(async ({ data }) => {
    const payload = await api.get<Warehouse>(`/warehouses/${data.id}`)
    return payload.data
  })

export const createWarehouse = createServerFn({ method: "POST" })
  .validator((data: CreateWarehouseInput) => createWarehouseSchema.parse(data))
  .handler(async ({ data }) => {
    const payload = await api.post<Warehouse>("/warehouses", data)
    return payload
  })

export const updateWarehouse = createServerFn({ method: "POST" })
  .validator((data: UpdateWarehouseInput) => updateWarehouseSchema.parse(data))
  .handler(async ({ data }) => {
    const { id, ...body } = data
    const payload = await api.patch<Warehouse>(`/warehouses/${id}`, body)
    return payload
  })

export const deleteWarehouse = createServerFn({ method: "POST" })
  .validator((data: { id: number }) => idSchema.parse(data))
  .handler(async ({ data }) => {
    const payload = await api.delete<{ success: boolean }>(`/warehouses/${data.id}`)
    return payload
  })

// 2. Equipment API
export const listEquipment = createServerFn({ method: "GET" })
  .validator((data: ResourceQueryParams) => resourceQueryParamsSchema.parse(data))
  .handler(async ({ data }) => {
    const payload = await api.get<PaginatedResponse<Equipment>>("/equipment", {
      params: data,
    })
    return toPaginated<Equipment>(payload.data)
  })

export const createEquipment = createServerFn({ method: "POST" })
  .validator((data: CreateEquipmentInput) => createEquipmentSchema.parse(data))
  .handler(async ({ data }) => {
    const payload = await api.post<Equipment>("/equipment", data)
    return payload
  })

export const updateEquipment = createServerFn({ method: "POST" })
  .validator((data: UpdateEquipmentInput) => updateEquipmentSchema.parse(data))
  .handler(async ({ data }) => {
    const { id, ...body } = data
    const payload = await api.patch<Equipment>(`/equipment/${id}`, body)
    return payload
  })

export const deleteEquipment = createServerFn({ method: "POST" })
  .validator((data: { id: number }) => idSchema.parse(data))
  .handler(async ({ data }) => {
    const payload = await api.delete<{ success: boolean }>(`/equipment/${data.id}`)
    return payload
  })

// 3. Cost Centers API
export const listCostCenters = createServerFn({ method: "GET" })
  .validator((data: ResourceQueryParams) => resourceQueryParamsSchema.parse(data))
  .handler(async ({ data }) => {
    const payload = await api.get<PaginatedResponse<CostCenter>>("/cost-centers", {
      params: data,
    })
    return toPaginated<CostCenter>(payload.data)
  })
