import { z } from "zod"

export const createStationSchema = z.object({
  name: z.string().min(2, "الاسم مطلوب"),
  code: z.string().min(1, "الكود مطلوب"),
  location: z.string().optional(),
  isActive: z.boolean().default(true),
})

export const updateStationSchema = createStationSchema.extend({
  id: z.union([z.string(), z.number()]),
})
