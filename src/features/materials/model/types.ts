import type z from "zod"
import type { createMaterialSchema, materialQueryParamsSchema, updateMaterialSchema } from "./schema"
import type { Timestamps } from "#/shared/types"

export type Material = Timestamps & {
  id: number
  name: string
  sku: string
  categoryId: number
  unitId: number
  unitPrice: number
  isActive: boolean
  reorderLevel?: number | string
  category?: { id: number; name: string; code?: string }
  unit?: { id: number; name: string; symbol?: string }
}

export type FullMaterial = Material & {
  inventory?: {
    id: number
    materialId: number
    quantityOnHand: number | string
    lastCountedAt?: string | null
  } | null
  disposals?: Array<{
    id: number
    quantity: number | string
    status: "pending" | "approved" | "rejected"
    reason?: string
    station?: { id: number; name: string }
  }>
  settlements?: Array<{
    id: number
    type: "positive" | "negative"
    quantity: number | string
    previousQty?: number | string
    newQty?: number | string
    station?: { id: number; name: string }
    createdBy?: { id: number; name: string }
  }>
  stockMovements?: Array<{
    id: number
    type: "incoming" | "outgoing"
    quantity: number | string
    referenceNumber?: string
    station?: { id: number; name: string }
    supplier?: { id: number; name: string }
    invoice?: { id: number; invoiceNumber: string }
  }>
}

export type CreateMaterialInput = z.infer<typeof createMaterialSchema>
export type UpdateMaterialInput = z.infer<typeof updateMaterialSchema>
export type MaterialQueryParams = z.infer<typeof materialQueryParamsSchema>
