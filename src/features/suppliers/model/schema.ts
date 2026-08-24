import { z } from "zod"

export const createSupplierSchema = z.object({
  name: z.string().min(2, "الاسم مطلوب"),
  code: z.string().min(1, "الكود مطلوب"),
  contactInfo: z.string().optional(),
  isActive: z.boolean().default(true),
})

export const updateSupplierSchema = createSupplierSchema.extend({
  id: z.union([z.string(), z.number()]),
})
