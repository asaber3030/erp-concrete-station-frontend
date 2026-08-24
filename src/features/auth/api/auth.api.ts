import type { LoggedInUserResponse, LoginInput, LoginResponse } from "../model/types"
import { loginSchema } from "../model/schema"
import { createServerFn } from "@tanstack/react-start"
import { api } from "#/shared/api/http"
import { getCookie, setCookie } from "@tanstack/react-start/server"
import { AUTH_CONFIG } from "#/shared/config/app/auth"
import { redirect } from "@tanstack/react-router"


export const getAuthHeaders = () => {
  const token = getCookie(AUTH_CONFIG.tokenCookieName)
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const login = createServerFn({ method: "POST" })
  .validator((data) => loginSchema.parse(data))
  .handler(async ({ data }: { data: LoginInput }) => {
    const payload = await api.post<LoginResponse>("/auth/login", data)

    if (!payload.data?.user) throw new Error("Invalid login response")
    if (!payload.data?.accessToken) throw new Error("Invalid login response")

    setCookie(AUTH_CONFIG.tokenCookieName, payload.data.accessToken, {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    })

    return payload
  })

export const getLoggedInUser = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const token = getCookie(AUTH_CONFIG.tokenCookieName)
    if (!token) throw redirect({ to: "/login" })

    const payload = await api.get<LoggedInUserResponse>("/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!payload.data?.id) throw redirect({ to: "/login" })

    return payload.data
  } catch (error) {
    throw redirect({ to: "/login" })
  }
})
