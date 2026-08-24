import { z } from "zod"

export const createRoleSchema = z.object({
  name: z.string().min(2, "الاسم مطلوب"),
  label: z.string().optional(),
  permissions: z.array(z.number()).min(1, "الصلاحيات مطلوبة"),
})

export const createRoleFormSchema = z.object({
  name: z.string().min(2, "الاسم مطلوب"),
  label: z.string(),
  permissions: z.array(z.string()).min(1, "الصلاحيات مطلوبة"),
})

export const updateRoleSchema = z.object({
  roleId: z.number(),
  name: z.string().min(2, "الاسم مطلوب"),
  label: z.string().optional(),
  permissions: z.array(z.number()).min(1, "الصلاحيات مطلوبة"),
})

export const updateRoleFormSchema = z.object({
  name: z.string().min(2, "الاسم مطلوب"),
  label: z.string(),
  permissions: z.array(z.number()).min(1, "الصلاحيات مطلوبة"),
})
