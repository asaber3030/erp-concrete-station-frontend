import { create } from "zustand"
import { persist } from "zustand/middleware"

import type { SessionUser } from "#/shared/types"

type AuthState = {
  token: string | null
  user: SessionUser | null
  permissions: string[]
  hasPermission: (permission: string) => boolean
  setSession: (token: string, user: SessionUser) => void
  setUser: (user: SessionUser) => void
  clearSession: () => void
}

const maxAge = 60 * 60 * 24 * 7

function writeTokenCookie(token: string | null) {
  if (typeof document === "undefined") return

  const isProd = window.location.protocol === "https:"

  document.cookie = token ? `_token=${encodeURIComponent(token)}; path=/; max-age=${maxAge}; SameSite=Lax;${isProd ? " Secure;" : ""}` : "_token=; path=/; max-age=0; SameSite=Lax"
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      permissions: [],

      hasPermission: (permission) => {
        return get().permissions.includes(permission)
      },

      setSession: (token, user) => {
        writeTokenCookie(token)
        set({
          token,
          user,
          permissions: user?.permissions ?? [],
        })
      },

      setUser: (user) => {
        set({
          user,
          permissions: user?.permissions ?? [],
        })
      },

      clearSession: () => {
        writeTokenCookie(null)
        set({
          token: null,
          user: null,
          permissions: [],
        })
      },
    }),
    {
      name: "concrete-station-auth",

      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<AuthState> | undefined

        if (!persisted) return currentState

        const user = persisted.user ?? currentState.user

        return {
          ...currentState,
          ...persisted,
          permissions: persisted.permissions ?? user?.permissions ?? currentState.permissions ?? [],
        }
      },
    },
  ),
)
