import { z } from "zod"

export const searchSchema = z.object({
  page: z.coerce.number().int().positive().catch(1).default(1),
  per_page: z.coerce.number().int().positive().catch(15).default(15),
  search: z
    .string()
    .trim()
    .optional()
    .transform((v) => v || undefined)
    .catch(undefined),
})

export const idSchema = z.object({ id: z.number() })
