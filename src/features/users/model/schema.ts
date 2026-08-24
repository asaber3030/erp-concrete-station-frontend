import { z } from "zod"

export const createUserSchema = z.object({
  name: z.string().min(2, "الاسم مطلوب"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل").optional().or(z.literal("")),
  roleId: z.string().optional().or(z.literal("")),
  stationId: z.string().optional().or(z.literal("")),
  isActive: z.boolean().default(true),
})

export const updateUserSchema = createUserSchema.extend({
  id: z.union([z.string(), z.number()]),
})
