import type { SessionUser } from "#/shared/types"
import type { loginSchema } from "./schema"
import type { z } from "zod"

export type LoginInput = z.infer<typeof loginSchema>

export type LoginResponse = {
  accessToken: string
  user: SessionUser
}

export type LoggedInUserResponse = SessionUser
