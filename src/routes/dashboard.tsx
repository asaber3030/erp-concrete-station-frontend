import { createFileRoute, redirect } from "@tanstack/react-router"

import { DashboardLayout } from "#/features/dashboard/ui/dashboard-layout"
import { getLoggedInUser } from "#/features/auth/api/auth.api"

export const Route = createFileRoute("/dashboard")({
  component: ProtectedDashboardLayout,
  beforeLoad: async () => {
    const user = await getLoggedInUser()
    if (!user) {
      throw redirect({
        to: "/login",
      })
    }
    console.log("loggedin: ", user)
    return {
      user,
    }
  },
})

function ProtectedDashboardLayout() {
  return <DashboardLayout />
}
