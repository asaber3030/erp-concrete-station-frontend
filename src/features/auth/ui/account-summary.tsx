import { Link } from "@tanstack/react-router"

import { Button } from "#/shared/components/ui/button"
import { useLogoutMutation } from "../model/use-auth"
import { useAuthStore } from "../model/store"

export function AccountSummary() {
  const user = useAuthStore((state) => state.user)
  const logout = useLogoutMutation()

  if (!user) {
    return (
      <Button asChild variant="outline">
        <Link to="/login">تسجيل الدخول</Link>
      </Button>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <div className="text-left">
        <p className="text-xs text-muted-foreground">المستخدم الحالي</p>
        <p className="text-sm font-semibold">{user.name}</p>
      </div>
      <Button variant="outline" onClick={() => logout.mutate()}>
        تسجيل الخروج
      </Button>
    </div>
  )
}
