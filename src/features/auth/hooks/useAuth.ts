import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"
import { login } from "../api/auth.api"
import { useAuthStore } from "../model/store"
import type { LoginInput } from "../model/types"

export function useLoginMutation() {
  const navigate = useNavigate()
  const setUser = useAuthStore((state) => state.setUser)

  return useMutation({
    mutationFn: (data: LoginInput) => login({ data }),
    onError: (err: Error) => {
      toast.error(err.message || "حدث خطأ أثناء تسجيل الدخول")
    },
    onSuccess: (data) => {
      toast.success("تم تسجيل الدخول بنجاح")
      if (!data.data?.user) {
        toast.error("حدث خطأ أثناء تسجيل الدخول")
        return
      }
      setUser(data.data.user)
      navigate({ to: "/dashboard" })
    },
  })
}

export function useLogoutMutation() {
  const clearSession = useAuthStore((state) => state.clearSession)

  return useMutation({
    mutationFn: async () => {
      clearSession()
    },
  })
}

export function useUser() {
  const { user } = useAuthStore()
  return user
}