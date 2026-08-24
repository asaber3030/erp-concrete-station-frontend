import { createServerFn } from "@tanstack/react-start"
import { getCookie } from "@tanstack/react-start/server"
import { z } from "zod"
import { api } from "#/shared/api/http"
import { AUTH_CONFIG } from "#/shared/config/app/auth"
import type { SessionUser } from "#/shared/types"

export type UpdateAccountInput = {
  name: string
  password?: string
}

export const updateAccountSchema = z.object({
  name: z.string().min(2, "الاسم مطلوب"),
  password: z.string().optional(),
})

export const updateAccount = createServerFn({ method: "POST" })
  .validator((data: UpdateAccountInput) => updateAccountSchema.parse(data))
  .handler(async ({ data }) => {
    const token = getCookie(AUTH_CONFIG.tokenCookieName)
    const payload = await api.patch<SessionUser>("/auth/account", data, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
    return payload
  })
