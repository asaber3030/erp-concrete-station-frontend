import { z } from "zod"

export const createSettlementSchema = z.object({
  materialId: z.union([z.string(), z.number()]).transform((val) => Number(val)),
  stationId: z.union([z.string(), z.number()]).transform((val) => Number(val)),
  type: z.enum(["positive", "negative"]),
  quantity: z.coerce.number().positive("الكمية يجب أن تكون أكبر من صفر"),
  reason: z.string().min(2, "السبب مطلوب"),
  createdById: z.coerce.number().optional(),
  previousQty: z.coerce.number().optional(),
  newQty: z.coerce.number().optional(),
})
