export type Supplier = {
  id: string | number
  name: string
  code: string
  contactInfo?: string
  isActive: boolean
}

export type CreateSupplierInput = {
  name: string
  code: string
  contactInfo?: string
  isActive: boolean
}

export type UpdateSupplierInput = CreateSupplierInput & {
  id: string | number
}
