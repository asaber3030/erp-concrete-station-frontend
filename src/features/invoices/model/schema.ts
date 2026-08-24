import { z } from "zod"

export const createInvoiceSchema = z.object({
  invoiceNumber: z.string().min(1, "رقم الفاتورة مطلوب"),
  type: z.enum(["purchase", "sales"]),
  supplierId: z.string().optional().or(z.literal("")),
  partyName: z.string().min(2, "اسم الطرف مطلوب"),
  totalAmount: z.coerce.number().min(0, "المبلغ لا يمكن أن يكون سالباً"),
})

export const updateInvoiceSchema = createInvoiceSchema.extend({
  id: z.union([z.string(), z.number()]),
})
