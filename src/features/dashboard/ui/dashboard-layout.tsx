import { Link, Outlet } from "@tanstack/react-router"
import { Building2, LayoutDashboard } from "lucide-react"

import { AccountSummary } from "#/features/auth/ui/account-summary"
import { dashboardResourceLinks } from "#/features/dashboard/model/resources"
import { Button } from "#/shared/components/ui/button"
import { APP_CONFIG } from "#/shared/config/app"

export function DashboardLayout() {
  return (
    <main dir="rtl" className="min-h-screen bg-[#f5f7fb] text-slate-950">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="border-l bg-white px-4 py-5">
          <div className="mb-6 flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-md bg-slate-950 text-white">
              <Building2 className="size-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">نظام الإدارة</p>
              <h1 className="text-base font-bold">{APP_CONFIG.appName}</h1>
            </div>
          </div>
          <nav className="grid gap-1">
            <Button asChild variant="ghost" className="justify-start">
              <Link to="/dashboard" activeProps={{ className: "bg-primary text-primary-foreground hover:bg-primary/90" }} activeOptions={{ exact: true }}>
                <LayoutDashboard />
                لوحة التحكم
              </Link>
            </Button>
            {dashboardResourceLinks.map((resource) => (
              <Button asChild key={resource.name} variant="ghost" className="justify-start">
                <Link
                  to={resource.path}
                  activeProps={{ className: "bg-primary text-primary-foreground hover:bg-primary/90" }}
                >
                  {resource.title}
                </Link>
              </Button>
            ))}
            <Button asChild variant="ghost" className="justify-start">
              <Link to="/dashboard/analytics" activeProps={{ className: "bg-primary text-primary-foreground hover:bg-primary/90" }}>
                التحليلات
              </Link>
            </Button>
            <Button asChild variant="ghost" className="justify-start">
              <Link to="/dashboard/account" activeProps={{ className: "bg-primary text-primary-foreground hover:bg-primary/90" }}>
                الحساب
              </Link>
            </Button>
          </nav>
        </aside>
        <div className="grid grid-rows-[auto_1fr]">
          <header className="border-b bg-white px-5 py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm text-muted-foreground">إدارة محطة الخرسانة</p>
                <h2 className="text-xl font-bold">تشغيل ومخزون وفواتير وصلاحيات في مساحة واحدة</h2>
              </div>
              <AccountSummary />
            </div>
          </header>
          <div className="p-5">
            <Outlet />
          </div>
        </div>
      </div>
    </main>
  )
}
