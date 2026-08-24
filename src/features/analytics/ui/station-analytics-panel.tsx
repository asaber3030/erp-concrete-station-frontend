import { useState } from "react"
import { BarChart3 } from "lucide-react"

import { Button } from "#/shared/components/ui/button"
import { Input } from "#/shared/components/ui/input"
import { useStationAnalyticsQuery } from "../hooks/use-analytics"

export function StationAnalyticsPanel() {
  const [stationId, setStationId] = useState("")
  const [month, setMonth] = useState("2026-08")
  const [submitted, setSubmitted] = useState({ stationId: "", month: "2026-08" })
  const query = useStationAnalyticsQuery(submitted.stationId, submitted.month)

  return (
    <section className="grid gap-4">
      <div>
        <h2 className="text-2xl font-bold">تحليل المحطات الشهري</h2>
        <p className="mt-1 text-sm text-muted-foreground">عرض مخزون المحطة وحركاتها وإهلاكاتها وتسوياتها لشهر محدد.</p>
      </div>
      <div className="flex flex-wrap items-end gap-3 rounded-md border bg-white p-4">
        <Input className="w-[260px]" placeholder="معرف المحطة" value={stationId} onChange={(event) => setStationId(event.target.value)} />
        <Input className="w-[160px]" placeholder="YYYY-MM" value={month} onChange={(event) => setMonth(event.target.value)} />
        <Button onClick={() => setSubmitted({ stationId, month })}>
          <BarChart3 />
          عرض
        </Button>
      </div>
      <div className="rounded-md border bg-white p-4">
        {query.isFetching && <p className="text-sm text-muted-foreground">جاري تحميل التحليل</p>}
        {query.error && <p className="text-sm text-destructive">{query.error.message}</p>}
        {query.data && (
          <div className="grid gap-3 text-sm">
            <p>المخزون: {(query.data.inventory ?? []).length.toLocaleString("ar-EG")} عنصر</p>
            <p>الحركات: {(query.data.movements ?? []).length.toLocaleString("ar-EG")} عنصر</p>
            <p>الإهلاكات: {(query.data.disposals ?? []).length.toLocaleString("ar-EG")} عنصر</p>
            <p>التسويات: {(query.data.settlements ?? []).length.toLocaleString("ar-EG")} عنصر</p>
          </div>
        )}
        {!query.data && !query.isFetching && <p className="text-sm text-muted-foreground">أدخل معرف المحطة والشهر لعرض البيانات.</p>}
      </div>
    </section>
  )
}
