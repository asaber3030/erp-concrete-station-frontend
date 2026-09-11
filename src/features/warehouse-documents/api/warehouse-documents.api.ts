import { createServerFn } from "@tanstack/react-start"
import z from "zod"
import { api, toPaginated } from "#/shared/api/http"
import { idSchema } from "#/shared/schema"
import { DocumentStatus, Direction, type GoodsReceipt, type InventoryIssue, type OpeningBalance, type StockAdjustment, type StockCount } from "#/shared/types/warehouse"
import type { PaginatedResponse } from "#/shared/types"

export const documentFilterSchema = z.object({
  page: z.number().optional().default(1),
  per_page: z.number().optional().default(15),
  search: z.string().optional(),
  warehouseId: z.number().optional(),
  status: z.nativeEnum(DocumentStatus).optional(),
})

export type DocumentFilterParams = z.infer<typeof documentFilterSchema>

// 1. Goods Receipts
export const createGoodsReceiptSchema = z.object({
  number: z.string().min(1, "رقم إذن الاستلام مطلوب"),
  date: z.string().min(1, "التاريخ مطلوب"),
  supplierId: z.number().min(1, "المورد مطلوب"),
  warehouseId: z.number().min(1, "المستودع مطلوب"),
  items: z
    .array(
      z.object({
        itemId: z.number().min(1, "العنصر مطلوب"),
        quantity: z.number().positive("الكمية يجب أن تكون أكبر من 0"),
        unitCost: z.number().min(0, "سعر الوحدة غير صحيح"),
      }),
    )
    .min(1, "يجب إضافة عنصر واحد على الأقل"),
})

export type CreateGoodsReceiptInput = z.infer<typeof createGoodsReceiptSchema>

export const listGoodsReceipts = createServerFn({ method: "GET" })
  .validator((data: DocumentFilterParams) => documentFilterSchema.parse(data))
  .handler(async ({ data }) => {
    const payload = await api.get<PaginatedResponse<GoodsReceipt>>("/goods-receipts", {
      params: data,
    })
    return toPaginated<GoodsReceipt>(payload.data)
  })

export const getGoodsReceiptById = createServerFn({ method: "GET" })
  .validator((data: { id: number }) => idSchema.parse(data))
  .handler(async ({ data }) => {
    const payload = await api.get<GoodsReceipt>(`/goods-receipts/${data.id}`)
    return payload.data
  })

export const createGoodsReceipt = createServerFn({ method: "POST" })
  .validator((data: CreateGoodsReceiptInput) => createGoodsReceiptSchema.parse(data))
  .handler(async ({ data }) => {
    const payload = await api.post<GoodsReceipt>("/goods-receipts", data)
    return payload
  })

export const postGoodsReceipt = createServerFn({ method: "POST" })
  .validator((data: { id: number }) => idSchema.parse(data))
  .handler(async ({ data }) => {
    const payload = await api.post<GoodsReceipt>(`/goods-receipts/${data.id}/post`)
    return payload
  })

export const cancelGoodsReceipt = createServerFn({ method: "POST" })
  .validator((data: { id: number }) => idSchema.parse(data))
  .handler(async ({ data }) => {
    const payload = await api.post<GoodsReceipt>(`/goods-receipts/${data.id}/cancel`)
    return payload
  })

// 2. Inventory Issues
export const createInventoryIssueSchema = z.object({
  number: z.string().min(1, "رقم إذن الصرف مطلوب"),
  date: z.string().min(1, "التاريخ مطلوب"),
  warehouseId: z.number().min(1, "المستودع مطلوب"),
  equipmentId: z.number().nullable().optional(),
  costCenterId: z.number().nullable().optional(),
  items: z
    .array(
      z.object({
        itemId: z.number().min(1, "العنصر مطلوب"),
        quantity: z.number().positive("الكمية يجب أن تكون أكبر من 0"),
      }),
    )
    .min(1, "يجب إضافة عنصر واحد على الأقل"),
})

export type CreateInventoryIssueInput = z.infer<typeof createInventoryIssueSchema>

export const listInventoryIssues = createServerFn({ method: "GET" })
  .validator((data: DocumentFilterParams) => documentFilterSchema.parse(data))
  .handler(async ({ data }) => {
    const payload = await api.get<PaginatedResponse<InventoryIssue>>("/inventory-issues", {
      params: data,
    })
    return toPaginated<InventoryIssue>(payload.data)
  })

export const getInventoryIssueById = createServerFn({ method: "GET" })
  .validator((data: { id: number }) => idSchema.parse(data))
  .handler(async ({ data }) => {
    const payload = await api.get<InventoryIssue>(`/inventory-issues/${data.id}`)
    return payload.data
  })

export const createInventoryIssue = createServerFn({ method: "POST" })
  .validator((data: CreateInventoryIssueInput) => createInventoryIssueSchema.parse(data))
  .handler(async ({ data }) => {
    const payload = await api.post<InventoryIssue>("/inventory-issues", data)
    return payload
  })

export const postInventoryIssue = createServerFn({ method: "POST" })
  .validator((data: { id: number }) => idSchema.parse(data))
  .handler(async ({ data }) => {
    const payload = await api.post<InventoryIssue>(`/inventory-issues/${data.id}/post`)
    return payload
  })

export const cancelInventoryIssue = createServerFn({ method: "POST" })
  .validator((data: { id: number }) => idSchema.parse(data))
  .handler(async ({ data }) => {
    const payload = await api.post<InventoryIssue>(`/inventory-issues/${data.id}/cancel`)
    return payload
  })

// 3. Opening Balances
export const createOpeningBalanceSchema = z.object({
  warehouseId: z.number().min(1, "المستودع مطلوب"),
  date: z.string().min(1, "التاريخ مطلوب"),
  items: z
    .array(
      z.object({
        itemId: z.number().min(1, "العنصر مطلوب"),
        quantity: z.number().positive("الكمية يجب أن تكون أكبر من 0"),
        unitCost: z.number().min(0, "التكلفة مطلوبة"),
      }),
    )
    .min(1, "يجب إضافة عنصر واحد على الأقل"),
})

export type CreateOpeningBalanceInput = z.infer<typeof createOpeningBalanceSchema>

export const listOpeningBalances = createServerFn({ method: "GET" })
  .validator((data: DocumentFilterParams) => documentFilterSchema.parse(data))
  .handler(async ({ data }) => {
    const payload = await api.get<PaginatedResponse<OpeningBalance>>("/opening-balances", {
      params: data,
    })
    return toPaginated<OpeningBalance>(payload.data)
  })

export const getOpeningBalanceById = createServerFn({ method: "GET" })
  .validator((data: { id: number }) => idSchema.parse(data))
  .handler(async ({ data }) => {
    const payload = await api.get<OpeningBalance>(`/opening-balances/${data.id}`)
    return payload.data
  })

export const createOpeningBalance = createServerFn({ method: "POST" })
  .validator((data: CreateOpeningBalanceInput) => createOpeningBalanceSchema.parse(data))
  .handler(async ({ data }) => {
    const payload = await api.post<OpeningBalance>("/opening-balances", data)
    return payload
  })

export const postOpeningBalance = createServerFn({ method: "POST" })
  .validator((data: { id: number }) => idSchema.parse(data))
  .handler(async ({ data }) => {
    const payload = await api.post<OpeningBalance>(`/opening-balances/${data.id}/post`)
    return payload
  })

// 4. Stock Adjustments
export const createStockAdjustmentSchema = z.object({
  warehouseId: z.number().min(1, "المستودع مطلوب"),
  date: z.string().min(1, "التاريخ مطلوب"),
  items: z
    .array(
      z.object({
        itemId: z.number().min(1, "العنصر مطلوب"),
        quantity: z.number().positive("الكمية يجب أن تكون أكبر من 0"),
        type: z.nativeEnum(Direction),
      }),
    )
    .min(1, "يجب إضافة عنصر واحد على الأقل"),
})

export type CreateStockAdjustmentInput = z.infer<typeof createStockAdjustmentSchema>

export const listStockAdjustments = createServerFn({ method: "GET" })
  .validator((data: DocumentFilterParams) => documentFilterSchema.parse(data))
  .handler(async ({ data }) => {
    const payload = await api.get<PaginatedResponse<StockAdjustment>>("/stock-adjustments", {
      params: data,
    })
    return toPaginated<StockAdjustment>(payload.data)
  })

export const getStockAdjustmentById = createServerFn({ method: "GET" })
  .validator((data: { id: number }) => idSchema.parse(data))
  .handler(async ({ data }) => {
    const payload = await api.get<StockAdjustment>(`/stock-adjustments/${data.id}`)
    return payload.data
  })

export const createStockAdjustment = createServerFn({ method: "POST" })
  .validator((data: CreateStockAdjustmentInput) => createStockAdjustmentSchema.parse(data))
  .handler(async ({ data }) => {
    const payload = await api.post<StockAdjustment>("/stock-adjustments", data)
    return payload
  })

export const postStockAdjustment = createServerFn({ method: "POST" })
  .validator((data: { id: number }) => idSchema.parse(data))
  .handler(async ({ data }) => {
    const payload = await api.post<StockAdjustment>(`/stock-adjustments/${data.id}/post`)
    return payload
  })

// 5. Stock Counts
export const createStockCountSchema = z.object({
  warehouseId: z.number().min(1, "المستودع مطلوب"),
  date: z.string().min(1, "التاريخ مطلوب"),
  items: z
    .array(
      z.object({
        itemId: z.number().min(1, "العنصر مطلوب"),
        countedQty: z.number().min(0, "الكمية جردياً غير صحيحة"),
      }),
    )
    .min(1, "يجب إضافة عنصر واحد على الأقل"),
})

export type CreateStockCountInput = z.infer<typeof createStockCountSchema>

export const listStockCounts = createServerFn({ method: "GET" })
  .validator((data: DocumentFilterParams) => documentFilterSchema.parse(data))
  .handler(async ({ data }) => {
    const payload = await api.get<PaginatedResponse<StockCount>>("/stock-counts", {
      params: data,
    })
    return toPaginated<StockCount>(payload.data)
  })

export const getStockCountById = createServerFn({ method: "GET" })
  .validator((data: { id: number }) => idSchema.parse(data))
  .handler(async ({ data }) => {
    const payload = await api.get<StockCount>(`/stock-counts/${data.id}`)
    return payload.data
  })

export const createStockCount = createServerFn({ method: "POST" })
  .validator((data: CreateStockCountInput) => createStockCountSchema.parse(data))
  .handler(async ({ data }) => {
    const payload = await api.post<StockCount>("/stock-counts", data)
    return payload
  })

export const approveStockCount = createServerFn({ method: "POST" })
  .validator((data: { id: number }) => idSchema.parse(data))
  .handler(async ({ data }) => {
    const payload = await api.post<StockCount>(`/stock-counts/${data.id}/approve`)
    return payload
  })
