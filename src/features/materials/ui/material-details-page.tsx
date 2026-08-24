import { useState } from "react"
import { Link } from "@tanstack/react-router"
import { ArrowRight, Boxes, Package, History, Trash2, Scale, Tag, CheckCircle2, XCircle, AlertTriangle } from "lucide-react"
import { Button } from "#/shared/components/ui/button"
import { useMaterialQuery } from "../hooks/use-materials"

type MaterialDetailsPageProps = {
  materialId: number
}

export function MaterialDetailsPage({ materialId }: MaterialDetailsPageProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "movements" | "settlements" | "disposals">("overview")

  const { data: material, isLoading } = useMaterialQuery(materialId)

  if (isLoading && !material) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-muted-foreground">جاري تحميل تفاصيل المادة...</p>
      </div>
    )
  }

  if (!material) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <p className="text-destructive font-semibold">المادة غير موجودة</p>
        <Link to="/dashboard/materials" search={{ page: 1, per_page: 15 }}>
          <Button variant="outline">
            <ArrowRight className="size-4" />
            العودة لقائمة المواد
          </Button>
        </Link>
      </div>
    )
  }

  const inventoryOnHand = material.inventory?.quantityOnHand ? Number(material.inventory.quantityOnHand) : 0
  const reorderLevelNum = material.reorderLevel ? Number(material.reorderLevel) : 0
  const isLowStock = inventoryOnHand <= reorderLevelNum

  const stockMovements = material.stockMovements ?? []
  const settlements = material.settlements ?? []
  const disposals = material.disposals ?? []

  return (
    <div className="grid gap-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
        <div className="flex items-center gap-3">
          <Link to="/dashboard/materials" search={{ page: 1, per_page: 15 }}>
            <Button variant="ghost" size="icon" title="الرجوع">
              <ArrowRight className="size-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">{material.name}</h2>
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">{material.sku}</span>
              {material.isActive ? (
                <span className="flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800">
                  <CheckCircle2 className="size-3" />
                  نشط
                </span>
              ) : (
                <span className="flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-800">
                  <XCircle className="size-3" />
                  غير نشط
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              التصنيف: {material.category?.name || "-"} | الوحدة: {material.unit?.name || "-"} ({material.unit?.symbol || ""})
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Overview Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-sm font-medium">الرصيد المتاح بالمخزون</span>
            <Boxes className="size-4 text-primary" />
          </div>
          <p className="mt-2 text-3xl font-extrabold">{inventoryOnHand.toLocaleString("ar-EG")}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {material.inventory?.lastCountedAt ? `آخر جرد: ${new Date(material.inventory.lastCountedAt).toLocaleDateString("ar-EG")}` : "لم يتم الجرد بعد"}
          </p>
        </div>

        <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-sm font-medium">سعر الوحدة</span>
            <Tag className="size-4 text-primary" />
          </div>
          <p className="mt-2 text-3xl font-extrabold">{Number(material.unitPrice).toLocaleString("ar-EG")} ج.م</p>
          <p className="mt-1 text-xs text-muted-foreground">سعر الوحدة الافتراضي</p>
        </div>

        <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-sm font-medium">حد إعادة الطلب</span>
            <Package className="size-4 text-primary" />
          </div>
          <p className="mt-2 text-3xl font-extrabold">{reorderLevelNum.toLocaleString("ar-EG")}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {isLowStock ? (
              <span className="inline-flex items-center gap-1 text-amber-700 font-semibold">
                <AlertTriangle className="size-3" /> منخفض - يتطلب إعادة الطلب
              </span>
            ) : (
              "الرصيد في المستوى الآمن"
            )}
          </p>
        </div>

        <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-sm font-medium">حركات المخزون</span>
            <History className="size-4 text-primary" />
          </div>
          <p className="mt-2 text-3xl font-extrabold">{stockMovements.length}</p>
          <p className="mt-1 text-xs text-muted-foreground">حركة وارد وصادر مسجلة</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b text-sm font-medium">
        <button
          type="button"
          onClick={() => setActiveTab("overview")}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 transition-colors ${
            activeTab === "overview" ? "border-primary text-primary font-bold" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Package className="size-4" />
          بيانات المادة والمخزون
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
        <div className="grid gap-6 md:grid-cols-2">
          {/* Card 1: Details */}
          <div className="rounded-lg border bg-white p-5 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-base font-bold">
              <Tag className="size-4 text-primary" />
              البيانات الأساسية
            </h3>
            <div className="grid gap-3 text-sm">
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">اسم المادة:</span>
                <span className="font-semibold">{material.name}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">السيريال / SKU:</span>
                <span className="font-semibold">{material.sku}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">التصنيف:</span>
                <span className="font-semibold">{material.category?.name ?? "-"}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">الوحدة:</span>
                <span className="font-semibold">{material.unit?.name ?? "-"}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">سعر الوحدة:</span>
                <span className="font-semibold">{material.unitPrice} ج.م</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">الحالة التشغيلية:</span>
                <span className={`font-semibold ${material.isActive ? "text-green-600" : "text-red-600"}`}>{material.isActive ? "نشط" : "غير نشط"}</span>
              </div>
            </div>
          </div>

          {/* Card 2: Inventory Status */}
          <div className="rounded-lg border bg-white p-5 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-base font-bold">
              <Boxes className="size-4 text-primary" />
              حالة المخزون المباشرة
            </h3>
            <div className="grid gap-4 text-sm">
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">الرصيد المتاح المتبقي:</span>
                <span className="font-bold text-lg text-primary">{inventoryOnHand.toLocaleString("ar-EG")}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">حد إعادة الطلب:</span>
                <span className="font-semibold">{reorderLevelNum.toLocaleString("ar-EG")}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">تاريخ آخر عمليات جرد:</span>
                <span className="font-semibold">{material.inventory?.lastCountedAt ? new Date(material.inventory.lastCountedAt).toLocaleDateString("ar-EG") : "غير مسجل"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">تقييم المخزون الحالي:</span>
                <span className="font-bold text-emerald-700">{(inventoryOnHand * Number(material.unitPrice || 0)).toLocaleString("ar-EG")} ج.م</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STOCK MOVEMENTS */}
      {activeTab === "movements" && (
        <div className="rounded-lg border bg-white p-5 shadow-sm">
          <h3 className="mb-4 flex items-center gap-2 text-base font-bold">
            <History className="size-4 text-primary" />
            سجل حركات الوارد والصادر
          </h3>
          {stockMovements.length === 0 ? (
            <p className="text-sm text-muted-foreground">لا توجد حركات مخزون مسجلة لهذه المادة.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-sm">
                <thead className="border-b bg-muted/50 text-xs font-semibold text-muted-foreground">
                  <tr>
                    <th className="p-3">نوع الحركة</th>
                    <th className="p-3">الكمية</th>
                    <th className="p-3">رقم المرجع</th>
                    <th className="p-3">المحطة</th>
                    <th className="p-3">المورد</th>
                    <th className="p-3">رقم الفاتورة</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {stockMovements.map((m) => (
                    <tr key={m.id} className="hover:bg-muted/30">
                      <td className="p-3">
                        <span className={`inline-block rounded px-2.5 py-0.5 text-xs font-semibold ${m.type === "incoming" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>
                          {m.type === "incoming" ? "وارد (+)" : "صادر (-)"}
                        </span>
                      </td>
                      <td className="p-3 font-bold">{Number(m.quantity).toLocaleString("ar-EG")}</td>
                      <td className="p-3 font-mono text-xs">{m.referenceNumber || "-"}</td>
                      <td className="p-3">{m.station?.name || "-"}</td>
                      <td className="p-3 text-xs">{m.supplier?.name || "-"}</td>
                      <td className="p-3 text-xs">{m.invoice?.invoiceNumber || "-"}</td>
                    </tr>
                  ))}
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
            سجل التسويات الجردية
          </h3>
          {settlements.length === 0 ? (
            <p className="text-sm text-muted-foreground">لا توجد تسويات جردية مسجلة لهذه المادة.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-sm">
                <thead className="border-b bg-muted/50 text-xs font-semibold text-muted-foreground">
                  <tr>
                    <th className="p-3">نوع التسوية</th>
                    <th className="p-3">الرصيد السابق</th>
                    <th className="p-3">كمية التعديل</th>
                    <th className="p-3">الرصيد الجديد</th>
                    <th className="p-3">المحطة</th>
                    <th className="p-3">بواسطة</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {settlements.map((s) => (
                    <tr key={s.id} className="hover:bg-muted/30">
                      <td className="p-3">
                        <span className={`inline-block rounded px-2.5 py-0.5 text-xs font-semibold ${s.type === "positive" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                          {s.type === "positive" ? "تسوية إيجابية (+)" : "تسوية سلبية (-)"}
                        </span>
                      </td>
                      <td className="p-3 text-muted-foreground">{s.previousQty ?? "-"}</td>
                      <td className="p-3 font-bold">{Number(s.quantity).toLocaleString("ar-EG")}</td>
                      <td className="p-3 font-bold text-primary">{s.newQty ?? "-"}</td>
                      <td className="p-3">{s.station?.name || "-"}</td>
                      <td className="p-3 text-xs">{s.createdBy?.name || "-"}</td>
                    </tr>
                  ))}
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
            سجل طلبات الإهلاك
          </h3>
          {disposals.length === 0 ? (
            <p className="text-sm text-muted-foreground">لا توجد طلبات إهلاك مسجلة لهذه المادة.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-sm">
                <thead className="border-b bg-muted/50 text-xs font-semibold text-muted-foreground">
                  <tr>
                    <th className="p-3">الكمية المهلكة</th>
                    <th className="p-3">الحالة</th>
                    <th className="p-3">السبب</th>
                    <th className="p-3">المحطة</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {disposals.map((d) => (
                    <tr key={d.id} className="hover:bg-muted/30">
                      <td className="p-3 font-bold">{Number(d.quantity).toLocaleString("ar-EG")}</td>
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
                      <td className="p-3">{d.station?.name || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
