import { z } from "zod"

export const recordAdjustmentSchema = z.object({
  materialId: z.union([z.string(), z.number()]).transform((val) => Number(val)),
  stationId: z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) => (val ? Number(val) : undefined)),
  quantity: z.coerce.number().positive("الكمية يجب أن تكون أكبر من صفر"),
  type: z.enum(["incoming", "outgoing"]),
  referenceNumber: z.string().min(1, "رقم المرجع مطلوب"),
  supplierId: z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) => (val ? Number(val) : undefined)),
  invoiceId: z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) => (val ? Number(val) : undefined)),
})
