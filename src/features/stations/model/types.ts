export type Station = {
  id: string | number
  name: string
  code: string
  location?: string
  isActive: boolean
}

export type CreateStationInput = {
  name: string
  code: string
  location?: string
  isActive: boolean
}

export type UpdateStationInput = CreateStationInput & {
  id: string | number
}
