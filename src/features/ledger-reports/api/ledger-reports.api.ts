import { createServerFn } from "@tanstack/react-start"
import z from "zod"
import { api, toPaginated } from "#/shared/api/http"
import type {
  CurrentStockReportItem,
  StockLedgerReportItem,
  InventoryValuationReportItem,
  MaterialConsumptionReportItem,
  EquipmentCostReportItem,
  CostCenterUsageReportItem,
  IncomingMaterialsReportItem,
  SparePartsUsageReportItem,
} from "#/shared/types/warehouse"
import type { PaginatedResponse } from "#/shared/types"

export const reportQueryParamsSchema = z.object({
  warehouseId: z.number().optional(),
  itemId: z.number().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  page: z.number().optional().default(1),
  per_page: z.number().optional().default(15),
  search: z.string().optional(),
})

export type ReportQueryParams = z.infer<typeof reportQueryParamsSchema>

// 1. Current Stock Report
export const getCurrentStockReport = createServerFn({ method: "GET" })
  .validator((data: ReportQueryParams) => reportQueryParamsSchema.parse(data))
  .handler(async ({ data }) => {
    const payload = await api.get<PaginatedResponse<CurrentStockReportItem>>("/reports/current-stock", {
      params: data,
    })
    return toPaginated<CurrentStockReportItem>(payload.data)
  })

// 2. Stock Ledger Report
export const getStockLedgerReport = createServerFn({ method: "GET" })
  .validator((data: ReportQueryParams) => reportQueryParamsSchema.parse(data))
  .handler(async ({ data }) => {
    const payload = await api.get<PaginatedResponse<StockLedgerReportItem>>("/reports/stock-ledger", {
      params: data,
    })
    return toPaginated<StockLedgerReportItem>(payload.data)
  })

// 3. Inventory Valuation Report
export const getInventoryValuationReport = createServerFn({ method: "GET" })
  .validator((data: ReportQueryParams) => reportQueryParamsSchema.parse(data))
  .handler(async ({ data }) => {
    const payload = await api.get<PaginatedResponse<InventoryValuationReportItem>>("/reports/inventory-valuation", {
      params: data,
    })
    return toPaginated<InventoryValuationReportItem>(payload.data)
  })

// 4. Material Consumption Report
export const getMaterialConsumptionReport = createServerFn({ method: "GET" })
  .validator((data: ReportQueryParams) => reportQueryParamsSchema.parse(data))
  .handler(async ({ data }) => {
    const payload = await api.get<PaginatedResponse<MaterialConsumptionReportItem>>("/reports/material-consumption", {
      params: data,
    })
    return toPaginated<MaterialConsumptionReportItem>(payload.data)
  })

// 5. Equipment Cost Report
export const getEquipmentCostReport = createServerFn({ method: "GET" })
  .validator((data: ReportQueryParams) => reportQueryParamsSchema.parse(data))
  .handler(async ({ data }) => {
    const payload = await api.get<PaginatedResponse<EquipmentCostReportItem>>("/reports/equipment-cost", {
      params: data,
    })
    return toPaginated<EquipmentCostReportItem>(payload.data)
  })

// 6. Cost Center Usage Report
export const getCostCenterUsageReport = createServerFn({ method: "GET" })
  .validator((data: ReportQueryParams) => reportQueryParamsSchema.parse(data))
  .handler(async ({ data }) => {
    const payload = await api.get<PaginatedResponse<CostCenterUsageReportItem>>("/reports/cost-center-usage", {
      params: data,
    })
    return toPaginated<CostCenterUsageReportItem>(payload.data)
  })

// 7. Incoming Materials Report
export const getIncomingMaterialsReport = createServerFn({ method: "GET" })
  .validator((data: ReportQueryParams) => reportQueryParamsSchema.parse(data))
  .handler(async ({ data }) => {
    const payload = await api.get<PaginatedResponse<IncomingMaterialsReportItem>>("/reports/incoming-materials", {
      params: data,
    })
    return toPaginated<IncomingMaterialsReportItem>(payload.data)
  })

// 8. Spare Parts Usage Report
export const getSparePartsUsageReport = createServerFn({ method: "GET" })
  .validator((data: ReportQueryParams) => reportQueryParamsSchema.parse(data))
  .handler(async ({ data }) => {
    const payload = await api.get<PaginatedResponse<SparePartsUsageReportItem>>("/reports/spare-parts-usage", {
      params: data,
    })
    return toPaginated<SparePartsUsageReportItem>(payload.data)
  })
