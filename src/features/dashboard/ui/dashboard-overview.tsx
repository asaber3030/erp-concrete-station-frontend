import { Link } from "@tanstack/react-router"
import { dashboardResourceLinks } from "../model/resources"

export type DashboardOverviewData = Record<string, number>

export function DashboardOverview({ data }: { data: DashboardOverviewData }) {
  return (
    <section className="grid gap-4">
      <div>
        <h2 className="text-2xl font-bold">لوحة التحكم</h2>
        <p className="mt-1 text-sm text-muted-foreground">نظرة عامة على كل موارد النظام وروابط مباشرة لصفحات الإدارة.</p>
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {dashboardResourceLinks.map((resource) => (
          <Link key={resource.name} to={resource.path} className="rounded-md border bg-white p-4 text-right shadow-sm transition hover:border-slate-400">
            <p className="text-sm text-muted-foreground">صفحة إدارة</p>
            <h3 className="mt-2 text-lg font-semibold">{resource.title}</h3>
            <p className="mt-3 text-3xl font-bold">{(data[resource.name] ?? 0).toLocaleString("ar-EG")}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}
