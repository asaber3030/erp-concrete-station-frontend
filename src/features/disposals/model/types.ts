export type Disposal = {
  id: number
  materialId: number
  stationId: number
  quantity: number
  unitPrice?: number
  totalPrice?: number
  reason?: string
  status: "pending" | "approved" | "rejected"
  disposalDate?: string
  material?: { id: number; name: string; category?: Record<string, any>; unit?: Record<string, any> }
  station?: { id: number; name: string }
}

export type RequestDisposalInput = {
  materialId: number | string
  stationId: number | string
  quantity: number
  unitPrice?: number
  totalPrice?: number
  reason?: string
}
