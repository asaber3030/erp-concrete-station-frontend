import { searchSchema } from "#/shared/schema"
import { z } from "zod"

export const createMaterialSchema = z.object({
  name: z.string().min(2, "الاسم مطلوب"),
  sku: z.string().min(1, "SKU مطلوب"),
  categoryId: z.number(),
  unitId: z.number(),
  unitPrice: z.number().min(0, "سعر الوحدة لا يمكن أن يكون سالباً"),
  isActive: z.boolean(),
})

export const updateMaterialSchema = createMaterialSchema.extend({
  id: z.number(),
})

export const materialQueryParamsSchema = searchSchema.extend({
  categoryId: z.coerce.number().int().positive().optional().catch(undefined),
})
