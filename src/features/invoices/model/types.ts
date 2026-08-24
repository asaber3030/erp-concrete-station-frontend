export type Invoice = {
  id: string | number
  invoiceNumber: string
  type: "purchase" | "sales"
  supplierId?: string | number
  partyName: string
  totalAmount: number
  status: "draft" | "issued" | "paid" | "cancelled"
}

export type CreateInvoiceInput = {
  invoiceNumber: string
  type: "purchase" | "sales"
  supplierId?: string | number
  partyName: string
  totalAmount: number
}

export type UpdateInvoiceInput = CreateInvoiceInput & {
  id: string | number
}
