import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { updateAccount, type UpdateAccountInput } from "../api/account-api"
import { useAuthStore } from "#/features/auth/model/store"

export function useUpdateAccountMutation() {
  const setUser = useAuthStore((state) => state.setUser)

  return useMutation({
    mutationFn: (data: UpdateAccountInput) => updateAccount({ data }),
    onSuccess: (res) => {
      if (res.data) {
        setUser(res.data)
      }
      toast.success("تم تحديث الحساب بنجاح")
    },
    onError: (err: Error) => {
      toast.error(err.message || "حدث خطأ أثناء تحديث الحساب")
    },
  })
}
