import { createServerFn } from "@tanstack/react-start"
import z from "zod"
import { api, toPaginated, type PaginatedResponse } from "#/shared/api/http"
import { idSchema } from "#/shared/schema"
import { ItemType, type Item } from "#/shared/types/warehouse"

export const itemTypeSchema = z.nativeEnum(ItemType)

export const createItemSchema = z.object({
  code: z.string().min(1, "رمز العنصر مطلوب"),
  name: z.string().min(1, "اسم العنصر مطلوب"),
  type: itemTypeSchema,
  categoryId: z.number().min(1, "التصنيف مطلوب"),
  unitId: z.number().min(1, "الوحدة مطلوبة"),
  minStock: z.number().min(0).default(0),
  equipmentId: z.number().nullable().optional(),
})

export const updateItemSchema = createItemSchema.partial().extend({
  id: z.number(),
})

export const itemQueryParamsSchema = z.object({
  page: z.number().optional().default(1),
  per_page: z.number().optional().default(15),
  search: z.string().optional(),
  type: itemTypeSchema.optional(),
  categoryId: z.number().optional(),
})

export type CreateItemInput = z.infer<typeof createItemSchema>
export type UpdateItemInput = z.infer<typeof updateItemSchema>
export type ItemQueryParams = z.infer<typeof itemQueryParamsSchema>

export const listItems = createServerFn({ method: "GET" })
  .validator((data: ItemQueryParams) => itemQueryParamsSchema.parse(data))
  .handler(async ({ data }) => {
    const payload = await api.get<PaginatedResponse<Item>>("/items", {
      params: data,
    })
    return toPaginated<Item>(payload.data)
  })

export const getItemById = createServerFn({ method: "GET" })
  .validator((data: { id: number }) => idSchema.parse(data))
  .handler(async ({ data }) => {
    const payload = await api.get<Item>(`/items/${data.id}`)
    return payload.data
  })

export const createItem = createServerFn({ method: "POST" })
  .validator((data: CreateItemInput) => createItemSchema.parse(data))
  .handler(async ({ data }) => {
    const payload = await api.post<Item>("/items", data)
    return payload
  })

export const updateItem = createServerFn({ method: "POST" })
  .validator((data: UpdateItemInput) => updateItemSchema.parse(data))
  .handler(async ({ data }) => {
    const { id, ...body } = data
    const payload = await api.patch<Item>(`/items/${id}`, body)
    return payload
  })

export const deleteItem = createServerFn({ method: "POST" })
  .validator((data: { id: number }) => idSchema.parse(data))
  .handler(async ({ data }) => {
    const payload = await api.delete<{ success: boolean }>(`/items/${data.id}`)
    return payload
  })
