import { useState } from "react"
import { Link } from "@tanstack/react-router"
import { ArrowRight, Building2, MapPin, Phone, Boxes, History, Trash2, Scale, Package, CheckCircle2, XCircle, AlertTriangle, Tag } from "lucide-react"
import { useDisposalsQuery } from "#/features/disposals/hooks/use-disposals"
import { useInventoryQuery } from "#/features/inventory/hooks/use-inventory"
import { useMaterialsQuery } from "#/features/materials/hooks/use-materials"
import { useSettlementsQuery } from "#/features/settlements/hooks/use-settlements"
import { useStockMovementsQuery } from "#/features/stock-movements/hooks/use-stock-movements"
import { Button } from "#/shared/components/ui/button"
import { useStationQuery } from "../hooks/use-stations"
import type { Station } from "../model/types"

type StationDetailsPageProps = {
  stationId: string
  initialData?: Station | null
}

export function StationDetailsPage({ stationId, initialData }: StationDetailsPageProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "movements" | "settlements" | "disposals">("overview")

  const { data: station, isLoading } = useStationQuery(stationId, initialData!)
  const { data: inventoryData } = useInventoryQuery({ stationId })
  const { data: movementsData } = useStockMovementsQuery({ stationId })
  const { data: disposalsData } = useDisposalsQuery({ stationId })
  const { data: settlementsData } = useSettlementsQuery({ stationId })
  const { data: materialsData } = useMaterialsQuery()

  const inventoryItems = inventoryData?.data ?? []
  const stockMovements = movementsData?.data ?? []
  const disposals = disposalsData?.data ?? []
  const settlements = settlementsData?.data ?? []
  const materials = materialsData?.data ?? []

  const getMaterialDetails = (id?: number | string) => {
    if (!id) return { name: "-", sku: "-", reorderLevel: 0, category: "-", unit: "-" }
    const mat = materials.find((m) => String(m.id) === String(id))
    if (!mat) return { name: `مادة #${id}`, sku: "-", reorderLevel: 0, category: "-", unit: "-" }
    return {
      name: mat.name,
      sku: mat.sku,
      reorderLevel: mat.reorderLevel ?? 0,
      category: mat.category?.name ?? "-",
      unit: mat.unit?.name ?? "-",
    }
  }

  if (isLoading && !station) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-muted-foreground">جاري تحميل تفاصيل المحطة...</p>
      </div>
    )
  }

  if (!station) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <p className="text-destructive font-semibold">المحطة غير موجودة</p>
        <Link to="/dashboard/stations">
          <Button variant="outline">
            <ArrowRight className="size-4" />
            العودة لقائمة المحطات
          </Button>
        </Link>
      </div>
    )
  }

  const totalStock = inventoryItems.reduce((acc, item) => acc + (item.quantityOnHand ?? item.quantity ?? 0), 0)
  const pendingDisposalsCount = disposals.filter((d) => d.status === "pending").length

  return (
    <div className="grid gap-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
        <div className="flex items-center gap-3">
          <Link to="/dashboard/stations">
            <Button variant="ghost" size="icon" title="الرجوع">
              <ArrowRight className="size-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">{station.name}</h2>
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">{station.code}</span>
              {station.isActive ? (
                <span className="flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800">
                  <CheckCircle2 className="size-3" />
                  نشطة
                </span>
              ) : (
                <span className="flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-800">
                  <XCircle className="size-3" />
                  غير نشطة
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-muted-foreground flex items-center gap-2">
              <MapPin className="size-3.5 text-muted-foreground" />
              {station.location || "لا يوجد عنوان محدد"}
            </p>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-sm font-medium">المواد المخزنة</span>
            <Boxes className="size-4 text-primary" />
          </div>
          <p className="mt-2 text-3xl font-extrabold">{inventoryItems.length}</p>
          <p className="mt-1 text-xs text-muted-foreground">صنف مسجل بالمحطة</p>
        </div>

        <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-sm font-medium">إجمالي الكميات الأرصدة</span>
            <Building2 className="size-4 text-primary" />
          </div>
          <p className="mt-2 text-3xl font-extrabold">{totalStock.toLocaleString("ar-EG")}</p>
          <p className="mt-1 text-xs text-muted-foreground">مجموع كميات المواد بالمحطة</p>
        </div>

        <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-sm font-medium">سجل الحركات</span>
            <History className="size-4 text-primary" />
          </div>
          <p className="mt-2 text-3xl font-extrabold">{stockMovements.length}</p>
          <p className="mt-1 text-xs text-muted-foreground">حركة مخزون مسجلة بالمحطة</p>
        </div>

        <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-sm font-medium">طلبات الإهلاك</span>
            <Trash2 className="size-4 text-destructive" />
          </div>
          <p className="mt-2 text-3xl font-extrabold">{disposals.length}</p>
          <p className="mt-1 text-xs text-muted-foreground">{pendingDisposalsCount > 0 ? `${pendingDisposalsCount} بانتظار الاعتماد` : "لا يوجد طلبات معلقة"}</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b text-sm font-medium">
        <button
          type="button"
          onClick={() => setActiveTab("overview")}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 transition-colors ${
            activeTab === "overview" ? "border-primary text-primary font-bold" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Building2 className="size-4" />
          بيانات المحطة والأرصدة
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("movements")}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 transition-colors ${
            activeTab === "movements" ? "border-primary text-primary font-bold" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <History className="size-4" />
          حركات المخزون ({stockMovements.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("settlements")}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 transition-colors ${
            activeTab === "settlements" ? "border-primary text-primary font-bold" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Scale className="size-4" />
          التسويات ({settlements.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("disposals")}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 transition-colors ${
            activeTab === "disposals" ? "border-primary text-primary font-bold" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Trash2 className="size-4" />
          الإهلاكات ({disposals.length})
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="grid gap-6 md:grid-cols-3">
          {/* Station Details Card */}
          <div className="rounded-lg border bg-white p-5 shadow-sm md:col-span-1">
            <h3 className="mb-4 flex items-center gap-2 text-base font-bold">
              <Building2 className="size-4 text-primary" />
              بيانات المحطة التفصيلية
            </h3>
            <div className="grid gap-3 text-sm">
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">كود المحطة:</span>
                <span className="font-semibold">{station.code}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">الموقع:</span>
                <span className="font-semibold">{station.location || "-"}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">الهاتف:</span>
                <span className="font-semibold">{station.phone || "-"}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">الحالة التشغيلية:</span>
                <span className={`font-semibold ${station.isActive ? "text-green-600" : "text-red-600"}`}>{station.isActive ? "نشطة" : "غير نشطة"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">تاريخ الإنشاء:</span>
                <span className="font-semibold">{station.createdAt ? new Date(station.createdAt).toLocaleDateString("ar-EG") : "-"}</span>
              </div>
            </div>
          </div>

          {/* Station Materials Inventory Table */}
          <div className="rounded-lg border bg-white p-5 shadow-sm md:col-span-2">
            <h3 className="mb-4 flex items-center gap-2 text-base font-bold">
              <Boxes className="size-4 text-primary" />
              أرصدة المواد في المحطة
            </h3>
            {inventoryItems.length === 0 ? (
              <p className="text-sm text-muted-foreground">لا يوجد مخزون مسجل في هذه المحطة حالياً.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right text-sm">
                  <thead className="border-b bg-muted/50 text-xs font-semibold text-muted-foreground">
                    <tr>
                      <th className="p-3">اسم المادة</th>
                      <th className="p-3">SKU</th>
                      <th className="p-3">الرصيد المتاح</th>
                      <th className="p-3">الكمية المحجوزة</th>
                      <th className="p-3">حالة الرصيد</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {inventoryItems.map((item) => {
                      const mat = getMaterialDetails(item.materialId)
                      const currentQty = item.quantityOnHand ?? item.quantity ?? 0
                      const isLow = currentQty <= mat.reorderLevel

                      return (
                        <tr key={item.id} className="hover:bg-muted/30">
                          <td className="p-3 font-semibold">{mat.name}</td>
                          <td className="p-3 font-mono text-xs text-muted-foreground">{mat.sku}</td>
                          <td className="p-3 font-bold text-primary">{currentQty.toLocaleString("ar-EG")}</td>
                          <td className="p-3 text-muted-foreground">{(item.reservedQuantity ?? 0).toLocaleString("ar-EG")}</td>
                          <td className="p-3">
                            {isLow ? (
                              <span className="inline-flex items-center gap-1 rounded bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">
                                <AlertTriangle className="size-3" />
                                منخفض
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-800">
                                <CheckCircle2 className="size-3" />
                                كافٍ
                              </span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: STOCK MOVEMENTS */}
      {activeTab === "movements" && (
        <div className="rounded-lg border bg-white p-5 shadow-sm">
          <h3 className="mb-4 flex items-center gap-2 text-base font-bold">
            <History className="size-4 text-primary" />
            سجل حركات المخزون بالمحطة
          </h3>
          {stockMovements.length === 0 ? (
            <p className="text-sm text-muted-foreground">لا توجد حركات مخزون مسجلة لهذه المحطة.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-sm">
                <thead className="border-b bg-muted/50 text-xs font-semibold text-muted-foreground">
                  <tr>
                    <th className="p-3">التاريخ</th>
                    <th className="p-3">المادة</th>
                    <th className="p-3">نوع الحركة</th>
                    <th className="p-3">رقم المرجع</th>
                    <th className="p-3">الكمية</th>
                    <th className="p-3">المورد / الفاتورة</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {stockMovements.map((m) => {
                    const mat = getMaterialDetails(m.materialId)
                    return (
                      <tr key={m.id} className="hover:bg-muted/30">
                        <td className="p-3 text-xs text-muted-foreground">{m.movementDate || m.createdAt ? new Date(m.movementDate || m.createdAt!).toLocaleDateString("ar-EG") : "-"}</td>
                        <td className="p-3 font-semibold">{mat.name}</td>
                        <td className="p-3">
                          <span className={`inline-block rounded px-2.5 py-0.5 text-xs font-semibold ${m.type === "incoming" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>
                            {m.type === "incoming" ? "وارد" : "صادر"}
                          </span>
                        </td>
                        <td className="p-3 font-mono text-xs">{m.referenceNumber || "-"}</td>
                        <td className="p-3 font-bold">{m.quantity?.toLocaleString("ar-EG")}</td>
                        <td className="p-3 text-xs text-muted-foreground">
                          {m.supplierId ? `مورد #${m.supplierId}` : ""} {m.invoiceId ? `| فاتورة #${m.invoiceId}` : "-"}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SETTLEMENTS */}
      {activeTab === "settlements" && (
        <div className="rounded-lg border bg-white p-5 shadow-sm">
          <h3 className="mb-4 flex items-center gap-2 text-base font-bold">
            <Scale className="size-4 text-primary" />
            سجل التسويات الجردية بالمحطة
          </h3>
          {settlements.length === 0 ? (
            <p className="text-sm text-muted-foreground">لا توجد تسويات جردية مسجلة لهذه المحطة.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-sm">
                <thead className="border-b bg-muted/50 text-xs font-semibold text-muted-foreground">
                  <tr>
                    <th className="p-3">التاريخ</th>
                    <th className="p-3">المادة</th>
                    <th className="p-3">نوع التسوية</th>
                    <th className="p-3">الرصيد السابق</th>
                    <th className="p-3">كمية التعديل</th>
                    <th className="p-3">الرصيد الجديد</th>
                    <th className="p-3">السبب</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {settlements.map((s) => {
                    const mat = getMaterialDetails(s.materialId)
                    return (
                      <tr key={s.id} className="hover:bg-muted/30">
                        <td className="p-3 text-xs text-muted-foreground">{s.settlementDate ? new Date(s.settlementDate).toLocaleDateString("ar-EG") : "-"}</td>
                        <td className="p-3 font-semibold">{mat.name}</td>
                        <td className="p-3">
                          <span className={`inline-block rounded px-2.5 py-0.5 text-xs font-semibold ${s.type === "positive" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                            {s.type === "positive" ? "تسوية إيجابية (+)" : "تسوية سلبية (-)"}
                          </span>
                        </td>
                        <td className="p-3 text-muted-foreground">{s.previousQty ?? "-"}</td>
                        <td className="p-3 font-bold">{s.quantity?.toLocaleString("ar-EG")}</td>
                        <td className="p-3 font-bold text-primary">{s.newQty ?? "-"}</td>
                        <td className="p-3 text-xs text-muted-foreground">{s.reason}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: DISPOSALS */}
      {activeTab === "disposals" && (
        <div className="rounded-lg border bg-white p-5 shadow-sm">
          <h3 className="mb-4 flex items-center gap-2 text-base font-bold">
            <Trash2 className="size-4 text-destructive" />
            سجل طلبات الإهلاك بالمحطة
          </h3>
          {disposals.length === 0 ? (
            <p className="text-sm text-muted-foreground">لا توجد طلبات إهلاك مسجلة لهذه المحطة.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-sm">
                <thead className="border-b bg-muted/50 text-xs font-semibold text-muted-foreground">
                  <tr>
                    <th className="p-3">التاريخ</th>
                    <th className="p-3">المادة</th>
                    <th className="p-3">الكمية المهلكة</th>
                    <th className="p-3">سعر الوحدة</th>
                    <th className="p-3">الإجمالي</th>
                    <th className="p-3">الحالة</th>
                    <th className="p-3">السبب</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {disposals.map((d) => {
                    const mat = getMaterialDetails(d.materialId)
                    return (
                      <tr key={d.id} className="hover:bg-muted/30">
                        <td className="p-3 text-xs text-muted-foreground">{d.disposalDate ? new Date(d.disposalDate).toLocaleDateString("ar-EG") : "-"}</td>
                        <td className="p-3 font-semibold">{mat.name}</td>
                        <td className="p-3 font-bold">{d.quantity?.toLocaleString("ar-EG")}</td>
                        <td className="p-3 text-xs">{d.unitPrice ? `${d.unitPrice} ج.م` : "-"}</td>
                        <td className="p-3 text-xs font-semibold">{d.totalPrice ? `${d.totalPrice} ج.م` : "-"}</td>
                        <td className="p-3">
                          <span
                            className={`inline-block rounded px-2.5 py-0.5 text-xs font-semibold ${
                              d.status === "approved" ? "bg-green-100 text-green-800" : d.status === "rejected" ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {d.status === "approved" ? "معتمد" : d.status === "rejected" ? "مرفوض" : "قيد الانتظار"}
                          </span>
                        </td>
                        <td className="p-3 text-xs text-muted-foreground">{d.reason || "-"}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
