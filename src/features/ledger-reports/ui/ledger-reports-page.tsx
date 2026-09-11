import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { BarChart3, Filter, Calendar, Layers, DollarSign, Wrench, Building, Truck, ShieldAlert } from "lucide-react"
import { Button } from "#/shared/components/ui/button"
import { Input } from "#/shared/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "#/shared/components/ui/table"
import {
  getCurrentStockReport,
  getStockLedgerReport,
  getInventoryValuationReport,
  getMaterialConsumptionReport,
  getEquipmentCostReport,
  getCostCenterUsageReport,
  getIncomingMaterialsReport,
  getSparePartsUsageReport,
  type ReportQueryParams,
} from "../api/ledger-reports.api"
import { listWarehouses } from "#/features/master-resources/api/master-resources.api"
import { listItems } from "#/features/items/api/items.api"

type ReportType = "current-stock" | "stock-ledger" | "inventory-valuation" | "material-consumption" | "equipment-cost" | "cost-center-usage" | "incoming-materials" | "spare-parts-usage"

export function LedgerReportsPage() {
  const [activeReport, setActiveReport] = useState<ReportType>("current-stock")
  const [warehouseId, setWarehouseId] = useState<number | undefined>()
  const [itemId, setItemId] = useState<number | undefined>()
  const [dateFrom, setDateFrom] = useState<string>("")
  const [dateTo, setDateTo] = useState<string>("")
  const [page, setPage] = useState(1)

  // Master options
  const { data: warehousesData } = useQuery({
    queryKey: ["warehouses-select"],
    queryFn: async () => listWarehouses({ data: { page: 1, per_page: 100 } }),
  })
  const { data: itemsData } = useQuery({
    queryKey: ["items-select"],
    queryFn: async () => listItems({ data: { page: 1, per_page: 100 } }),
  })

  const warehouses = warehousesData?.data || []
  const items = itemsData?.data || []

  const queryParams: ReportQueryParams = {
    warehouseId: warehouseId || undefined,
    itemId: itemId || undefined,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
    page,
    per_page: 15,
  }

  // Report Queries
  const currentStockQ = useQuery({
    queryKey: ["report-current-stock", queryParams],
    queryFn: async () => getCurrentStockReport({ data: queryParams }),
    enabled: activeReport === "current-stock",
  })

  const stockLedgerQ = useQuery({
    queryKey: ["report-stock-ledger", queryParams],
    queryFn: async () => getStockLedgerReport({ data: queryParams }),
    enabled: activeReport === "stock-ledger",
  })

  const valuationQ = useQuery({
    queryKey: ["report-inventory-valuation", queryParams],
    queryFn: async () => getInventoryValuationReport({ data: queryParams }),
    enabled: activeReport === "inventory-valuation",
  })

  const consumptionQ = useQuery({
    queryKey: ["report-material-consumption", queryParams],
    queryFn: async () => getMaterialConsumptionReport({ data: queryParams }),
    enabled: activeReport === "material-consumption",
  })

  const equipmentCostQ = useQuery({
    queryKey: ["report-equipment-cost", queryParams],
    queryFn: async () => getEquipmentCostReport({ data: queryParams }),
    enabled: activeReport === "equipment-cost",
  })

  const costCenterQ = useQuery({
    queryKey: ["report-cost-center-usage", queryParams],
    queryFn: async () => getCostCenterUsageReport({ data: queryParams }),
    enabled: activeReport === "cost-center-usage",
  })

  const incomingQ = useQuery({
    queryKey: ["report-incoming-materials", queryParams],
    queryFn: async () => getIncomingMaterialsReport({ data: queryParams }),
    enabled: activeReport === "incoming-materials",
  })

  const sparePartsQ = useQuery({
    queryKey: ["report-spare-parts-usage", queryParams],
    queryFn: async () => getSparePartsUsageReport({ data: queryParams }),
    enabled: activeReport === "spare-parts-usage",
  })

  const reportTabs: { id: ReportType; label: string; icon: any }[] = [
    { id: "current-stock", label: "الرصيد التراكمي والتقييم الحظي", icon: Layers },
    { id: "stock-ledger", label: "دفتر التتبع الزمني (Stock Ledger)", icon: BarChart3 },
    { id: "inventory-valuation", label: "تقييم المخزون المالي", icon: DollarSign },
    { id: "material-consumption", label: "استهلاك المواد الخام", icon: Calendar },
    { id: "equipment-cost", label: "تكاليف المعدات والآليات", icon: Wrench },
    { id: "cost-center-usage", label: "تحليل مراكز التكلفة", icon: Building },
    { id: "incoming-materials", label: "توريدات الموردين", icon: Truck },
    { id: "spare-parts-usage", label: "سجل قطع الغيار", icon: ShieldAlert },
  ]

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="bg-white p-5 rounded-lg border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <BarChart3 className="size-6 text-indigo-600" />
            مركز التقارير الديناميكية لدفتر المخزون والتكلفة الموزونة
          </h1>
          <p className="text-sm text-slate-500 mt-1">تقارير فورية ومحتسبة ديناميكياً من قيود دفتر التتبع غير القابلة للتقادمي (Immutable Ledger Entries)</p>
        </div>
      </div>

      {/* Global Report Filters */}
      <div className="bg-white p-4 rounded-lg border shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <Filter className="size-4 text-indigo-600" /> فلترة التقارير:
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="text-[11px] font-semibold text-slate-600">المستودع</label>
            <select
              value={warehouseId || ""}
              onChange={(e) => setWarehouseId(e.target.value ? Number(e.target.value) : undefined)}
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">جميع المستودعات</option>
              {warehouses.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-slate-600">الصنف / المادة</label>
            <select
              value={itemId || ""}
              onChange={(e) => setItemId(e.target.value ? Number(e.target.value) : undefined)}
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">جميع الأصناف</option>
              {items.map((it) => (
                <option key={it.id} value={it.id}>
                  {it.name} ({it.code})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-slate-600">من تاريخ</label>
            <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-slate-600">إلى تاريخ</label>
            <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Report Selection Tabs */}
      <div className="flex flex-wrap gap-2 border-b pb-3">
        {reportTabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeReport === tab.id
          return (
            <Button
              key={tab.id}
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setActiveReport(tab.id)
                setPage(1)
              }}
              className={`gap-1.5 ${isActive ? "bg-indigo-600 hover:bg-indigo-700 text-white" : ""}`}
            >
              <Icon className="size-4" />
              {tab.label}
            </Button>
          )
        })}
      </div>

      {/* Report Data Container */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden p-2">
        {/* 1. Current Stock Report */}
        {activeReport === "current-stock" && (
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="text-right font-bold">رمز الصنف</TableHead>
                <TableHead className="text-right font-bold">اسم الصنف</TableHead>
                <TableHead className="text-right font-bold">نوع الصنف</TableHead>
                <TableHead className="text-right font-bold">المستودع</TableHead>
                <TableHead className="text-right font-bold">الرصيد الفعلي</TableHead>
                <TableHead className="text-right font-bold">متوسط التكلفة الموزون</TableHead>
                <TableHead className="text-right font-bold">إجمالي التقييم (Valuation)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentStockQ.isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    جاري التحميل...
                  </TableCell>
                </TableRow>
              ) : currentStockQ.data?.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    لا توجد بيانات
                  </TableCell>
                </TableRow>
              ) : (
                currentStockQ.data?.data.map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-mono font-semibold">{item.itemCode}</TableCell>
                    <TableCell className="font-medium text-slate-900">{item.itemName}</TableCell>
                    <TableCell className="text-xs">{item.itemType}</TableCell>
                    <TableCell className="text-xs">{item.warehouseName || `مستودع #${item.warehouseId}`}</TableCell>
                    <TableCell className="font-bold text-emerald-700">{item.currentStock}</TableCell>
                    <TableCell className="font-mono">{item.avgCost ? `${item.avgCost.toFixed(2)} د.أ` : "0.00"}</TableCell>
                    <TableCell className="font-bold text-indigo-700 font-mono">{item.totalValuation ? `${item.totalValuation.toFixed(2)} د.أ` : "0.00"}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}

        {/* 2. Stock Ledger Report */}
        {activeReport === "stock-ledger" && (
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="text-right font-bold">التاريخ والوقت</TableHead>
                <TableHead className="text-right font-bold">نوع الحركة (Transaction)</TableHead>
                <TableHead className="text-right font-bold">الاتجاه</TableHead>
                <TableHead className="text-right font-bold">الصنف والمستودع</TableHead>
                <TableHead className="text-right font-bold">الكمية</TableHead>
                <TableHead className="text-right font-bold">تكلفة الوحدة</TableHead>
                <TableHead className="text-right font-bold">الإجمالي والرصيد التراكمي</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stockLedgerQ.isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    جاري تحميل سجلات الدفتر...
                  </TableCell>
                </TableRow>
              ) : stockLedgerQ.data?.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    لا توجد حركات لدفتر التتبع
                  </TableCell>
                </TableRow>
              ) : (
                stockLedgerQ.data?.data.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="text-xs text-slate-600">{row.date}</TableCell>
                    <TableCell className="font-mono text-xs font-bold">{row.transactionType}</TableCell>
                    <TableCell>
                      {row.direction === "IN" ? (
                        <span className="px-2 py-0.5 text-xs font-bold bg-emerald-100 text-emerald-800 rounded">دخول (IN)</span>
                      ) : (
                        <span className="px-2 py-0.5 text-xs font-bold bg-rose-100 text-rose-800 rounded">خروج (OUT)</span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs">
                      <div>
                        #{row.itemCode} {row.itemName}
                      </div>
                      <div className="text-slate-500">#{row.warehouseName || row.warehouseId}</div>
                    </TableCell>
                    <TableCell className="font-bold">{row.quantity}</TableCell>
                    <TableCell className="font-mono text-xs">{row.unitCost?.toFixed(2)} د.أ</TableCell>
                    <TableCell className="text-xs">
                      <div className="font-bold text-indigo-700">{row.totalCost?.toFixed(2)} د.أ</div>
                      <div className="text-slate-500">الرصيد بعد الحركة: {row.balanceAfter}</div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}

        {/* 3. Inventory Valuation */}
        {activeReport === "inventory-valuation" && (
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="text-right font-bold">التصنيف (Category)</TableHead>
                <TableHead className="text-right font-bold">المستودع</TableHead>
                <TableHead className="text-right font-bold">عدد الأصناف</TableHead>
                <TableHead className="text-right font-bold">إجمالي الكميات</TableHead>
                <TableHead className="text-right font-bold">القيمة المالية الإجمالية</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {valuationQ.isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    جاري التحميل...
                  </TableCell>
                </TableRow>
              ) : valuationQ.data?.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    لا توجد بيانات تقييم مالية
                  </TableCell>
                </TableRow>
              ) : (
                valuationQ.data?.data.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-bold">{row.categoryName}</TableCell>
                    <TableCell>{row.warehouseName}</TableCell>
                    <TableCell>{row.totalItems}</TableCell>
                    <TableCell className="font-semibold text-slate-700">{row.totalQuantity}</TableCell>
                    <TableCell className="font-bold text-emerald-700 font-mono text-base">{row.totalValuation?.toFixed(2)} د.أ</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}

        {/* 4. Material Consumption */}
        {activeReport === "material-consumption" && (
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="text-right font-bold">المادة الخام</TableHead>
                <TableHead className="text-right font-bold">الكمية النظرية (Theoretical)</TableHead>
                <TableHead className="text-right font-bold">الكمية الفعلية (Actual)</TableHead>
                <TableHead className="text-right font-bold">الفارق (Variance)</TableHead>
                <TableHead className="text-right font-bold">إجمالي التكلفة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {consumptionQ.isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    جاري التحميل...
                  </TableCell>
                </TableRow>
              ) : consumptionQ.data?.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    لا توجد بيانات استهلاك مواد
                  </TableCell>
                </TableRow>
              ) : (
                consumptionQ.data?.data.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-bold">
                      {row.itemName} ({row.itemCode})
                    </TableCell>
                    <TableCell className="font-semibold">{row.totalTheoreticalQty}</TableCell>
                    <TableCell className="font-semibold text-slate-900">{row.totalActualQty}</TableCell>
                    <TableCell className={row.varianceQty > 0 ? "text-rose-600 font-bold" : "text-emerald-600 font-bold"}>{row.varianceQty}</TableCell>
                    <TableCell className="font-bold text-indigo-700 font-mono">{row.totalCost?.toFixed(2)} د.أ</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}

        {/* 5. Equipment Cost */}
        {activeReport === "equipment-cost" && (
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="text-right font-bold">رمز واسم المعدة</TableHead>
                <TableHead className="text-right font-bold">عدد مرات الصرف</TableHead>
                <TableHead className="text-right font-bold">إجمالي تكلفة المواد والقطع المصنوعة لها</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {equipmentCostQ.isLoading ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8">
                    جاري التحميل...
                  </TableCell>
                </TableRow>
              ) : equipmentCostQ.data?.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8">
                    لا توجد تكاليف مسجلة للمعدات
                  </TableCell>
                </TableRow>
              ) : (
                equipmentCostQ.data?.data.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-bold">
                      {row.equipmentName} ({row.equipmentCode})
                    </TableCell>
                    <TableCell className="font-semibold">{row.totalIssuesCount}</TableCell>
                    <TableCell className="font-bold text-purple-700 font-mono text-base">{row.totalCost?.toFixed(2)} د.أ</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}

        {/* 6. Cost Center Usage */}
        {activeReport === "cost-center-usage" && (
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="text-right font-bold">رمز واسم مركز التكلفة</TableHead>
                <TableHead className="text-right font-bold">عدد أذونات الصرف</TableHead>
                <TableHead className="text-right font-bold">إجمالي تكلفة المواد والمستهلكات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {costCenterQ.isLoading ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8">
                    جاري التحميل...
                  </TableCell>
                </TableRow>
              ) : costCenterQ.data?.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8">
                    لا توجد مصاريف لمراكز التكلفة
                  </TableCell>
                </TableRow>
              ) : (
                costCenterQ.data?.data.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-bold">
                      {row.costCenterName} ({row.costCenterCode})
                    </TableCell>
                    <TableCell className="font-semibold">{row.totalIssuesCount}</TableCell>
                    <TableCell className="font-bold text-cyan-700 font-mono text-base">{row.totalCost?.toFixed(2)} د.أ</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}

        {/* 7. Incoming Materials */}
        {activeReport === "incoming-materials" && (
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="text-right font-bold">المورد</TableHead>
                <TableHead className="text-right font-bold">الصنف المستلم</TableHead>
                <TableHead className="text-right font-bold">إجمالي الكميات المستلمة</TableHead>
                <TableHead className="text-right font-bold">متوسط سعر الوحدة المشتراة</TableHead>
                <TableHead className="text-right font-bold">إجمالي قيمة التوريدات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {incomingQ.isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    جاري التحميل...
                  </TableCell>
                </TableRow>
              ) : incomingQ.data?.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    لا توجد توريدات للموردين
                  </TableCell>
                </TableRow>
              ) : (
                incomingQ.data?.data.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-bold">{row.supplierName}</TableCell>
                    <TableCell>
                      {row.itemName} ({row.itemCode})
                    </TableCell>
                    <TableCell className="font-semibold text-slate-800">{row.totalReceivedQty}</TableCell>
                    <TableCell className="font-mono text-xs">{row.avgUnitCost?.toFixed(2)} د.أ</TableCell>
                    <TableCell className="font-bold text-emerald-700 font-mono">{row.totalCost?.toFixed(2)} د.أ</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}

        {/* 8. Spare Parts Usage */}
        {activeReport === "spare-parts-usage" && (
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="text-right font-bold">قطعة الغيار (SPARE_PART)</TableHead>
                <TableHead className="text-right font-bold">المعدة المستهدفة</TableHead>
                <TableHead className="text-right font-bold">الكمية المصروفة</TableHead>
                <TableHead className="text-right font-bold">إجمالي التكلفة الموزونة</TableHead>
                <TableHead className="text-right font-bold">تاريخ آخر صرف</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sparePartsQ.isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    جاري التحميل...
                  </TableCell>
                </TableRow>
              ) : sparePartsQ.data?.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    لا توجد حركات لقطع الغيار
                  </TableCell>
                </TableRow>
              ) : (
                sparePartsQ.data?.data.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-bold">
                      {row.itemName} ({row.itemCode})
                    </TableCell>
                    <TableCell>{row.equipmentName || "-"}</TableCell>
                    <TableCell className="font-bold text-slate-900">{row.totalIssuedQty}</TableCell>
                    <TableCell className="font-bold text-amber-700 font-mono">{row.totalCost?.toFixed(2)} د.أ</TableCell>
                    <TableCell className="text-xs text-slate-500">{row.lastIssuedDate}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}
