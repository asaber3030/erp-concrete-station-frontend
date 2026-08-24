import { z } from "zod"

export const requestDisposalSchema = z.object({
  materialId: z.union([z.string(), z.number()]).transform((val) => Number(val)),
  stationId: z.union([z.string(), z.number()]).transform((val) => Number(val)),
  quantity: z.coerce.number().positive("الكمية يجب أن تكون أكبر من صفر"),
  unitPrice: z.coerce.number().optional(),
  totalPrice: z.coerce.number().optional(),
  reason: z.string().optional(),
})
