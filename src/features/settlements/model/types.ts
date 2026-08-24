export type Settlement = {
  id: number
  materialId: number
  stationId: number
  createdById?: number
  type: "positive" | "negative"
  quantity: number
  reason: string
  settlementDate?: string
  previousQty?: number
  newQty?: number
  material?: { id: number; name: string; category?: Record<string, any>; unit?: Record<string, any> }
  station?: { id: number; name: string }
  createdBy?: { id: number; name: string }
}

export type CreateSettlementInput = {
  materialId: number | string
  stationId: number | string
  type: "positive" | "negative"
  quantity: number
  reason: string
  createdById?: number
  previousQty?: number
  newQty?: number
}
