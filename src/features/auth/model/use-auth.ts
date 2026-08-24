import { useMutation } from "@tanstack/react-query"

import { useAuthStore } from "#/features/auth/model/store"

export function useLogoutMutation() {
  const clearSession = useAuthStore((state) => state.clearSession)

  return useMutation({
    mutationFn: async () => {
      clearSession()
    },
  })
}
