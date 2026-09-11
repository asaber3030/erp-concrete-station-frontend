import { createServerFn } from "@tanstack/react-start"
import z from "zod"
import { api, toPaginated } from "#/shared/api/http"
import { idSchema } from "#/shared/schema"
import { DocumentStatus, type MixDesign, type ProductionBatch, type MaterialConsumption } from "#/shared/types/warehouse"
import type { PaginatedResponse } from "#/shared/types"

export const productionFilterSchema = z.object({
  page: z.number().optional().default(1),
  per_page: z.number().optional().default(15),
  search: z.string().optional(),
})

export type ProductionFilterParams = z.infer<typeof productionFilterSchema>

// 5.1 Mix Designs
export const createMixDesignSchema = z.object({
  code: z.string().min(1, "رمز الخلطة التصميمية مطلوب"),
  name: z.string().min(1, "اسم الخلطة التصميمية مطلوب"),
  description: z.string().optional(),
  items: z
    .array(
      z.object({
        itemId: z.number().min(1, "المادة الخام مطلوبة"),
        quantity: z.number().positive("الكمية يجب أن تكون أكبر من 0"),
      }),
    )
    .min(1, "يجب إضافة مادة واحدة على الأقل في الصيغة"),
})

export const updateMixDesignSchema = createMixDesignSchema.partial().extend({
  id: z.number(),
})

export type CreateMixDesignInput = z.infer<typeof createMixDesignSchema>
export type UpdateMixDesignInput = z.infer<typeof updateMixDesignSchema>

export const listMixDesigns = createServerFn({ method: "GET" })
  .validator((data: ProductionFilterParams) => productionFilterSchema.parse(data))
  .handler(async ({ data }) => {
    const payload = await api.get<PaginatedResponse<MixDesign>>("/mix-designs", {
      params: data,
    })
    return toPaginated<MixDesign>(payload.data)
  })

export const getMixDesignById = createServerFn({ method: "GET" })
  .validator((data: { id: number }) => idSchema.parse(data))
  .handler(async ({ data }) => {
    const payload = await api.get<MixDesign>(`/mix-designs/${data.id}`)
    return payload.data
  })

export const createMixDesign = createServerFn({ method: "POST" })
  .validator((data: CreateMixDesignInput) => createMixDesignSchema.parse(data))
  .handler(async ({ data }) => {
    const payload = await api.post<MixDesign>("/mix-designs", data)
    return payload
  })

export const updateMixDesign = createServerFn({ method: "POST" })
  .validator((data: UpdateMixDesignInput) => updateMixDesignSchema.parse(data))
  .handler(async ({ data }) => {
    const { id, ...body } = data
    const payload = await api.patch<MixDesign>(`/mix-designs/${id}`, body)
    return payload
  })

export const deleteMixDesign = createServerFn({ method: "POST" })
  .validator((data: { id: number }) => idSchema.parse(data))
  .handler(async ({ data }) => {
    const payload = await api.delete<{ success: boolean }>(`/mix-designs/${data.id}`)
    return payload
  })

// 5.2 Production Batches
export const createProductionBatchSchema = z.object({
  batchNumber: z.string().min(1, "رقم الوجبة مطلوب"),
  date: z.string().min(1, "التاريخ مطلوب"),
  mixDesignId: z.number().min(1, "الخلطة التصميمية مطلوبة"),
  quantityProduced: z.number().positive("الكمية المنتجة يجب أن تكون أكبر من 0"),
  notes: z.string().optional(),
})

export type CreateProductionBatchInput = z.infer<typeof createProductionBatchSchema>

export const listProductionBatches = createServerFn({ method: "GET" })
  .validator((data: ProductionFilterParams) => productionFilterSchema.parse(data))
  .handler(async ({ data }) => {
    const payload = await api.get<PaginatedResponse<ProductionBatch>>("/production-batches", {
      params: data,
    })
    return toPaginated<ProductionBatch>(payload.data)
  })

export const createProductionBatch = createServerFn({ method: "POST" })
  .validator((data: CreateProductionBatchInput) => createProductionBatchSchema.parse(data))
  .handler(async ({ data }) => {
    const payload = await api.post<ProductionBatch>("/production-batches", data)
    return payload
  })

// 5.3 Material Consumptions
export const createMaterialConsumptionSchema = z.object({
  batchId: z.number().optional(),
  mixDesignId: z.number().optional(),
  date: z.string().min(1, "التاريخ مطلوب"),
  warehouseId: z.number().min(1, "المستودع مطلوب"),
  items: z
    .array(
      z.object({
        itemId: z.number().min(1, "العنصر مطلوب"),
        actualQty: z.number().min(0, "الكمية الفعلية غير صحيحة"),
        theoreticalQty: z.number().optional(),
      }),
    )
    .min(1, "يجب إضافة عنصر واحد على الأقل"),
})

export type CreateMaterialConsumptionInput = z.infer<typeof createMaterialConsumptionSchema>

export const listMaterialConsumptions = createServerFn({ method: "GET" })
  .validator((data: ProductionFilterParams) => productionFilterSchema.parse(data))
  .handler(async ({ data }) => {
    const payload = await api.get<PaginatedResponse<MaterialConsumption>>("/material-consumptions", {
      params: data,
    })
    return toPaginated<MaterialConsumption>(payload.data)
  })

export const getMaterialConsumptionById = createServerFn({ method: "GET" })
  .validator((data: { id: number }) => idSchema.parse(data))
  .handler(async ({ data }) => {
    const payload = await api.get<MaterialConsumption>(`/material-consumptions/${data.id}`)
    return payload.data
  })

export const createMaterialConsumption = createServerFn({ method: "POST" })
  .validator((data: CreateMaterialConsumptionInput) => createMaterialConsumptionSchema.parse(data))
  .handler(async ({ data }) => {
    const payload = await api.post<MaterialConsumption>("/material-consumptions", data)
    return payload
  })

export const postMaterialConsumption = createServerFn({ method: "POST" })
  .validator((data: { id: number }) => idSchema.parse(data))
  .handler(async ({ data }) => {
    const payload = await api.post<MaterialConsumption>(`/material-consumptions/${data.id}/post`)
    return payload
  })
