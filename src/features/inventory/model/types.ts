export type InventoryItem = {
  id: number
  materialId: number
  stationId?: number
  quantity: number
  quantityOnHand?: number
  reservedQuantity?: number
  lastCountedAt?: string
  material?: { id: number; name: string; sku?: string; category?: Record<string, any>; unit?: Record<string, any> }
  station?: { id: number; name: string; code?: string }
}

export type RecordAdjustmentInput = {
  materialId: number | string
  quantity: number
  type: "incoming" | "outgoing"
  referenceNumber: string
  stationId?: number | string
  supplierId?: number | string
  invoiceId?: number | string
}
