import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { SlidersHorizontal, Plus, CheckCircle2, ArrowRightLeft } from "lucide-react"
import { Button } from "#/shared/components/ui/button"
import { Input } from "#/shared/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "#/shared/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "#/shared/components/ui/dialog"
import { DocumentStatus } from "#/shared/types/warehouse"
import {
  listOpeningBalances,
  createOpeningBalance,
  postOpeningBalance,
  listStockAdjustments,
  createStockAdjustment,
  postStockAdjustment,
  type CreateOpeningBalanceInput,
  type CreateStockAdjustmentInput,
} from "../api/warehouse-documents.api"
import { listWarehouses } from "#/features/master-resources/api/master-resources.api"
import { listItems } from "#/features/items/api/items.api"

export function StockAdjustmentsPage() {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<"opening" | "adjustments">("adjustments")
  const [page, setPage] = useState(1)

  // Dialog states
  const [isOpeningOpen, setIsOpeningOpen] = useState(false)
  const [isAdjustmentOpen, setIsAdjustmentOpen] = useState(false)

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

  // Forms
  const [openingForm, setOpeningForm] = useState<CreateOpeningBalanceInput>({
    date: new Date().toISOString().split("T")[0],
    warehouseId: warehouses[0]?.id || 1,
    items: [{ itemId: items[0]?.id || 1, quantity: 1000, unitCost: 45.0 }],
  })

  const [adjustmentForm, setAdjustmentForm] = useState<CreateStockAdjustmentInput>({
    date: new Date().toISOString().split("T")[0],
    warehouseId: warehouses[0]?.id || 1,
    reason: "تسوية عجز/زيادة مخزنية",
    items: [{ itemId: items[0]?.id || 1, quantity: 5.0, unitCost: 45.0 }],
  })

  // Queries
  const { data: openingBalances, isLoading: isOpeningLoading } = useQuery({
    queryKey: ["opening-balances", page],
    queryFn: async () => listOpeningBalances({ data: { page, per_page: 15 } }),
    enabled: activeTab === "opening",
  })

  const { data: adjustments, isLoading: isAdjustmentLoading } = useQuery({
    queryKey: ["stock-adjustments", page],
    queryFn: async () => listStockAdjustments({ data: { page, per_page: 15 } }),
    enabled: activeTab === "adjustments",
  })

  // Mutations
  const createOpeningMutation = useMutation({
    mutationFn: async (data: CreateOpeningBalanceInput) => createOpeningBalance({ data }),
    onSuccess: (res: any) => {
      toast.success(res?.message || "تم تسجيل مسودة الرصيد الافتتاحي بنجاح")
      queryClient.invalidateQueries({ queryKey: ["opening-balances"] })
      setIsOpeningOpen(false)
    },
    onError: (err: any) => {
      toast.error(err?.message || "حدث خطأ أثناء حفظ الرصيد الافتتاحي")
    },
  })

  const postOpeningMutation = useMutation({
    mutationFn: async (id: number) => postOpeningBalance({ data: { id } }),
    onSuccess: (res: any) => {
      toast.success(res?.message || "تم اعتماد وترحيل الرصيد الافتتاحي بنجاح")
      queryClient.invalidateQueries({ queryKey: ["opening-balances"] })
    },
    onError: (err: any) => {
      toast.error(err?.message || "حدث خطأ أثناء ترحيل الرصيد الافتتاحي")
    },
  })

  const createAdjustmentMutation = useMutation({
    mutationFn: async (data: CreateStockAdjustmentInput) => createStockAdjustment({ data }),
    onSuccess: (res: any) => {
      toast.success(res?.message || "تم تسجيل مسودة التسوية المخزنية بنجاح")
      queryClient.invalidateQueries({ queryKey: ["stock-adjustments"] })
      setIsAdjustmentOpen(false)
    },
    onError: (err: any) => {
      toast.error(err?.message || "حدث خطأ أثناء تسجيل التسوية المخزنية")
    },
  })

  const postAdjustmentMutation = useMutation({
    mutationFn: async (id: number) => postStockAdjustment({ data: { id } }),
    onSuccess: (res: any) => {
      toast.success(res?.message || "تم ترحيل التسوية المخزنية وتحديث دفتر المخزون بنجاح")
      queryClient.invalidateQueries({ queryKey: ["stock-adjustments"] })
    },
    onError: (err: any) => {
      toast.error(err?.message || "حدث خطأ أثناء ترحيل التسوية المخزنية")
    },
  })

  const getStatusBadge = (status: DocumentStatus) => {
    switch (status) {
      case DocumentStatus.DRAFT:
        return <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-amber-100 text-amber-800">مسودة</span>
      case DocumentStatus.POSTED:
        return <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800">مرحّل</span>
      case DocumentStatus.CANCELLED:
        return <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-rose-100 text-rose-800">ملغى</span>
    }
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-lg border shadow-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <SlidersHorizontal className="size-6 text-purple-600" />
            التسويات وتثبيت الأرصدة الافتتاحية (Adjustments & Opening Balances)
          </h1>
          <p className="text-sm text-slate-500 mt-1">تسجيل الأرصدة الافتتاحية الأولية وحركات التسوية الزائدة والمخرجة وتأثيرها على قيود التتبع</p>
        </div>
        <div className="flex items-center gap-2">
          {activeTab === "opening" ? (
            <Button onClick={() => setIsOpeningOpen(true)} className="gap-2 bg-purple-600 hover:bg-purple-700">
              <Plus className="size-4" /> إضافة رصيد افتتاحي
            </Button>
          ) : (
            <Button onClick={() => setIsAdjustmentOpen(true)} className="gap-2 bg-blue-600 hover:bg-blue-700">
              <Plus className="size-4" /> إنشاء تسوية مخزنية
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-4">
        <button
          onClick={() => setActiveTab("adjustments")}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === "adjustments" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}
        >
          التسويات المخزنية (Stock Adjustments)
        </button>
        <button
          onClick={() => setActiveTab("opening")}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === "opening" ? "border-purple-600 text-purple-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}
        >
          الأرصدة الافتتاحية (Opening Balances)
        </button>
      </div>

      {/* Adjustments Tab */}
      {activeTab === "adjustments" && (
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="text-right font-bold">المعرف</TableHead>
                <TableHead className="text-right font-bold">التاريخ والمستودع</TableHead>
                <TableHead className="text-right font-bold">السبب (Reason)</TableHead>
                <TableHead className="text-right font-bold">عدد الأصناف</TableHead>
                <TableHead className="text-right font-bold">الحالة</TableHead>
                <TableHead className="text-center font-bold">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isAdjustmentLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                    جاري التحميل...
                  </TableCell>
                </TableRow>
              ) : adjustments?.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                    لا توجد تسويات مخزنية
                  </TableCell>
                </TableRow>
              ) : (
                adjustments?.data.map((adj) => (
                  <TableRow key={adj.id} className="hover:bg-slate-50">
                    <TableCell className="font-mono font-semibold">#{adj.id}</TableCell>
                    <TableCell className="text-xs">
                      <div className="font-medium text-slate-900">{adj.date}</div>
                      <div className="text-slate-500">مستودع #{adj.warehouseId}</div>
                    </TableCell>
                    <TableCell className="text-slate-700 text-sm">{adj.reason || "-"}</TableCell>
                    <TableCell className="font-semibold">{adj.items?.length || 0} اصناف</TableCell>
                    <TableCell>{getStatusBadge(adj.status)}</TableCell>
                    <TableCell className="text-center">
                      {adj.status === DocumentStatus.DRAFT && (
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => postAdjustmentMutation.mutate(adj.id)} disabled={postAdjustmentMutation.isPending}>
                          <CheckCircle2 className="size-4 ml-1" /> ترحيل التسوية
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Opening Balances Tab */}
      {activeTab === "opening" && (
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="text-right font-bold">المعرف</TableHead>
                <TableHead className="text-right font-bold">التاريخ والمستودع</TableHead>
                <TableHead className="text-right font-bold">عدد الأصناف</TableHead>
                <TableHead className="text-right font-bold">الحالة</TableHead>
                <TableHead className="text-center font-bold">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isOpeningLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                    جاري التحميل...
                  </TableCell>
                </TableRow>
              ) : openingBalances?.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                    لا توجد أرصدة افتتاحية مسجلة
                  </TableCell>
                </TableRow>
              ) : (
                openingBalances?.data.map((openB) => (
                  <TableRow key={openB.id} className="hover:bg-slate-50">
                    <TableCell className="font-mono font-semibold">#{openB.id}</TableCell>
                    <TableCell className="text-xs">
                      <div className="font-medium text-slate-900">{openB.date}</div>
                      <div className="text-slate-500">مستودع #{openB.warehouseId}</div>
                    </TableCell>
                    <TableCell className="font-semibold">{openB.items?.length || 0} اصناف</TableCell>
                    <TableCell>{getStatusBadge(openB.status)}</TableCell>
                    <TableCell className="text-center">
                      {openB.status === DocumentStatus.DRAFT && (
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white" onClick={() => postOpeningMutation.mutate(openB.id)} disabled={postOpeningMutation.isPending}>
                          <CheckCircle2 className="size-4 ml-1" /> اعتماد وترحيل الرصيد الافتتاحي
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Adjustment Dialog */}
      <Dialog open={isAdjustmentOpen} onOpenChange={setIsAdjustmentOpen}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle>تسجيل تسوية مخزنية جديدة</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-xs font-semibold text-slate-700">المستودع (Warehouse)</label>
              <select
                value={adjustmentForm.warehouseId}
                onChange={(e) => setAdjustmentForm({ ...adjustmentForm, warehouseId: Number(e.target.value) })}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
              >
                {warehouses.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name}
                  </option>
                ))}
                {warehouses.length === 0 && <option value={1}>مستودع #1</option>}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700">سبب التسوية</label>
              <Input value={adjustmentForm.reason} onChange={(e) => setAdjustmentForm({ ...adjustmentForm, reason: e.target.value })} />
            </div>
            {adjustmentForm.items.map((line, idx) => (
              <div key={idx} className="border rounded p-2 bg-slate-50 space-y-2">
                <div>
                  <label className="text-[10px] text-slate-500">اختر الصنف</label>
                  <select
                    value={line.itemId}
                    onChange={(e) => {
                      const newItems = [...adjustmentForm.items]
                      newItems[idx].itemId = Number(e.target.value)
                      setAdjustmentForm({ ...adjustmentForm, items: newItems })
                    }}
                    className="w-full h-9 rounded border border-input bg-background text-xs px-2"
                  >
                    {items.map((it) => (
                      <option key={it.id} value={it.id}>
                        {it.name} ({it.code})
                      </option>
                    ))}
                    {items.length === 0 && <option value={1}>صنف #1</option>}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-500">فارق الكمية (+ فائض / - عجز)</label>
                    <Input
                      type="number"
                      value={line.quantity}
                      onChange={(e) => {
                        const newItems = [...adjustmentForm.items]
                        newItems[idx].quantity = Number(e.target.value)
                        setAdjustmentForm({ ...adjustmentForm, items: newItems })
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500">سعر التقييم (Unit Cost)</label>
                    <Input
                      type="number"
                      value={line.unitCost}
                      onChange={(e) => {
                        const newItems = [...adjustmentForm.items]
                        newItems[idx].unitCost = Number(e.target.value)
                        setAdjustmentForm({ ...adjustmentForm, items: newItems })
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <DialogFooter className="gap-2 sm:justify-start">
            <Button onClick={() => createAdjustmentMutation.mutate(adjustmentForm)} disabled={createAdjustmentMutation.isPending}>
              حفظ تسوية مسودة
            </Button>
            <Button variant="outline" onClick={() => setIsAdjustmentOpen(false)}>
              إلغاء
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Opening Balance Dialog */}
      <Dialog open={isOpeningOpen} onOpenChange={setIsOpeningOpen}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle>تسجيل رصيد افتتاحي للمستودع</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-xs font-semibold text-slate-700">المستودع (Warehouse)</label>
              <select
                value={openingForm.warehouseId}
                onChange={(e) => setOpeningForm({ ...openingForm, warehouseId: Number(e.target.value) })}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
              >
                {warehouses.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name}
                  </option>
                ))}
                {warehouses.length === 0 && <option value={1}>مستودع #1</option>}
              </select>
            </div>
            {openingForm.items.map((line, idx) => (
              <div key={idx} className="border rounded p-2 bg-slate-50 space-y-2">
                <div>
                  <label className="text-[10px] text-slate-500">اختر الصنف</label>
                  <select
                    value={line.itemId}
                    onChange={(e) => {
                      const newItems = [...openingForm.items]
                      newItems[idx].itemId = Number(e.target.value)
                      setOpeningForm({ ...openingForm, items: newItems })
                    }}
                    className="w-full h-9 rounded border border-input bg-background text-xs px-2"
                  >
                    {items.map((it) => (
                      <option key={it.id} value={it.id}>
                        {it.name} ({it.code})
                      </option>
                    ))}
                    {items.length === 0 && <option value={1}>صنف #1</option>}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-500">الكمية الافتتاحية</label>
                    <Input
                      type="number"
                      value={line.quantity}
                      onChange={(e) => {
                        const newItems = [...openingForm.items]
                        newItems[idx].quantity = Number(e.target.value)
                        setOpeningForm({ ...openingForm, items: newItems })
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500">التكلفة الموزونة للوحدة</label>
                    <Input
                      type="number"
                      value={line.unitCost}
                      onChange={(e) => {
                        const newItems = [...openingForm.items]
                        newItems[idx].unitCost = Number(e.target.value)
                        setOpeningForm({ ...openingForm, items: newItems })
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <DialogFooter className="gap-2 sm:justify-start">
            <Button onClick={() => createOpeningMutation.mutate(openingForm)} disabled={createOpeningMutation.isPending}>
              حفظ مسودة الرصيد الافتتاحي
            </Button>
            <Button variant="outline" onClick={() => setIsOpeningOpen(false)}>
              إلغاء
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
