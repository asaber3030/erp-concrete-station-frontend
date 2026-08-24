import { z } from "zod"

export const stationAnalyticsSchema = z.object({
  stationId: z.string().min(1, "المحطة مطلوبة"),
  month: z.string().regex(/^\d{4}-\d{2}$/, "الشهر يجب أن يكون بصيغة YYYY-MM"),
})
