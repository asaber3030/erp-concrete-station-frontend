import { z } from "zod"

export const createCategorySchema = z.object({
  name: z.string().min(2, "الاسم مطلوب (حرفان على الأقل)"),
  code: z.string().min(1, "الكود مطلوب"),
  isActive: z.boolean().default(true),
})

export const updateCategorySchema = createCategorySchema.extend({
  id: z.union([z.string(), z.number()]),
})
