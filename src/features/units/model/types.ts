export type Unit = {
  id: string | number
  name: string
  symbol: string
  isActive: boolean
}

export type CreateUnitInput = {
  name: string
  symbol: string
  isActive: boolean
}

export type UpdateUnitInput = CreateUnitInput & {
  id: string | number
}
