import { z } from "zod"

export const createUnitSchema = z.object({
  name: z.string().min(2, "الاسم مطلوب"),
  symbol: z.string().min(1, "الرمز مطلوب"),
  isActive: z.boolean().default(true),
})

export const updateUnitSchema = createUnitSchema.extend({
  id: z.union([z.string(), z.number()]),
})
