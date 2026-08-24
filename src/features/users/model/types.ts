export type User = {
  id: string | number
  name: string
  email: string
  roleId?: number | string
  role?:
    | {
        id: number | string
        name: string
      }
    | string
  stationId?: string | number
  isActive: boolean
}

export type CreateUserInput = {
  name: string
  email: string
  password?: string
  roleId?: number | string
  role?: string
  stationId?: string | number
  isActive: boolean
}

export type UpdateUserInput = CreateUserInput & {
  id: string | number
}
