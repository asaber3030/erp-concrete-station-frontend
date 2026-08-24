export type StockMovement = {
  id: number
  materialId: number
  stationId: number
  type: "incoming" | "outgoing"
  quantity: number
  referenceNumber?: string
  supplierId?: number
  invoiceId?: number
  createdBy?: number | { id: number; name: string }
  movementDate?: string
  createdAt?: string
  material?: { id: number; name: string; sku?: string }
  station?: { id: number; name: string; code?: string }
}

export type CreateStockMovementInput = {
  materialId: number | string
  quantity: number
  type: "incoming" | "outgoing"
  referenceNumber: string
  stationId?: number | string
  supplierId?: number | string
  invoiceId?: number | string
}
