export type Category = {
  id: string | number
  name: string
  code: string
  isActive: boolean
}

export type CreateCategoryInput = {
  name: string
  code: string
  isActive: boolean
}

export type UpdateCategoryInput = CreateCategoryInput & {
  id: string | number
}
