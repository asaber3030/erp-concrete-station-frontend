import { createServerFn } from "@tanstack/react-start"

import { api, toPaginated, type PaginatedResponse } from "#/shared/api/http"
import { createMaterialSchema, materialQueryParamsSchema, updateMaterialSchema } from "../model/schema"
import { idSchema } from "#/shared/schema"

import type { CreateMaterialInput, FullMaterial, Material, MaterialQueryParams, UpdateMaterialInput } from "../model/types"

export const listMaterials = createServerFn({ method: "GET" })
  .validator((data: MaterialQueryParams) => materialQueryParamsSchema.parse(data))
  .handler(async ({ data }) => {
    const payload = await api.get<PaginatedResponse<Material>>("/materials", {
      params: data,
    })
    return toPaginated<Material>(payload.data)
  })

export const getMaterialById = createServerFn({ method: "GET" })
  .validator((data: { id: number }) => idSchema.parse(data))
  .handler(async ({ data }) => {
    const payload = await api.get<FullMaterial>(`/materials/${data.id}`)
    return payload.data
  })

export const createMaterial = createServerFn({ method: "POST" })
  .validator((data: CreateMaterialInput) => createMaterialSchema.parse(data))
  .handler(async ({ data }) => {
    const payload = await api.post<Material>("/materials", data)
    return payload
  })

export const updateMaterial = createServerFn({ method: "POST" })
  .validator((data: UpdateMaterialInput) => updateMaterialSchema.parse(data))
  .handler(async ({ data }) => {
    const { id, ...body } = data
    const payload = await api.patch<Material>(`/materials/${id}`, body)
    return payload
  })

export const deleteMaterial = createServerFn({ method: "POST" })
  .validator((data: { id: number }) => idSchema.parse(data))
  .handler(async ({ data }) => {
    const payload = await api.delete<{ success: boolean }>(`/materials/${data.id}`)
    return payload
  })
