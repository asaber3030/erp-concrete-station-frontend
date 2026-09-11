import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { ClipboardCheck, Plus, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "#/shared/components/ui/button"
import { Input } from "#/shared/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "#/shared/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "#/shared/components/ui/dialog"
import { DocumentStatus, type StockCount } from "#/shared/types/warehouse"
import { listStockCounts, createStockCount, approveStockCount, type CreateStockCountInput } from "../api/warehouse-documents.api"
import { listWarehouses } from "#/features/master-resources/api/master-resources.api"
import { listItems } from "#/features/items/api/items.api"

export function StockCountsPage() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [selectedCount, setSelectedCount] = useState<StockCount | null>(null)

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

  // Form state
  const [formData, setFormData] = useState<CreateStockCountInput>({
    warehouseId: warehouses[0]?.id || 1,
    date: new Date().toISOString().split("T")[0],
    items: [{ itemId: items[0]?.id || 1, countedQty: 95.0 }],
  })

  const { data: paginatedCounts, isLoading } = useQuery({
    queryKey: ["stock-counts", page],
    queryFn: async () => listStockCounts({ data: { page, per_page: 15 } }),
  })

  const createMutation = useMutation({
    mutationFn: async (data: CreateStockCountInput) => createStockCount({ data }),
    onSuccess: (res: any) => {
      toast.success(res?.message || "تم إنشاء عملية الجرد الفعلي وحفظ لقطة النظام بنجاح")
      queryClient.invalidateQueries({ queryKey: ["stock-counts"] })
      setIsCreateOpen(false)
    },
    onError: (err: any) => {
      toast.error(err?.message || "حدث خطأ أثناء إنشاء جلسة الجرد الفعلي")
    },
  })

  const approveMutation = useMutation({
    mutationFn: async (id: number) => approveStockCount({ data: { id } }),
    onSuccess: (res: any) => {
      toast.success(res?.message || "تم اعتماد الجرد وتوليد وتسوية الفروقات المخزنية تلقائياً")
      queryClient.invalidateQueries({ queryKey: ["stock-counts"] })
      setSelectedCount(null)
    },
    onError: (err: any) => {
      toast.error(err?.message || "حدث خطأ أثناء اعتماد الجرد الفعلي")
    },
  })

  const getStatusBadge = (status: DocumentStatus) => {
    switch (status) {
      case DocumentStatus.DRAFT:
        return <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-amber-100 text-amber-800">قيد الجرد / مسودة</span>
      case DocumentStatus.POSTED:
        return <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800">مقر ومرحّل (Approved)</span>
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
            <ClipboardCheck className="size-6 text-teal-600" />
            الجرد الفعلي للمخزون (Physical Stock Count)
          </h1>
          <p className="text-sm text-slate-500 mt-1">تسجيل الجرد الفعلي للمستودعات، احتساب الفروقات تلقائياً (variance = countedQty - systemQty) واكتشاف التسويات التلقائية</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="gap-2 bg-teal-600 hover:bg-teal-700">
          <Plus className="size-4" /> إنشاء جلسة جرد جديد
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="text-right font-bold">معرف الجرد</TableHead>
              <TableHead className="text-right font-bold">التاريخ</TableHead>
              <TableHead className="text-right font-bold">المستودع</TableHead>
              <TableHead className="text-right font-bold">عدد الأصناف</TableHead>
              <TableHead className="text-right font-bold">الحالة</TableHead>
              <TableHead className="text-center font-bold">الإجراءات والاعتماد</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                  جاري التحميل...
                </TableCell>
              </TableRow>
            ) : paginatedCounts?.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                  لا توجد عمليات جرد فعلي
                </TableCell>
              </TableRow>
            ) : (
              paginatedCounts?.data.map((count) => {
                const whName = warehouses.find((w) => w.id === count.warehouseId)?.name || `#${count.warehouseId}`
                return (
                  <TableRow key={count.id} className="hover:bg-slate-50">
                    <TableCell className="font-mono font-semibold">#{count.id}</TableCell>
                    <TableCell className="text-slate-600">{count.date}</TableCell>
                    <TableCell className="font-medium">{whName}</TableCell>
                    <TableCell className="font-semibold">{count.items?.length || 0} أصناف</TableCell>
                    <TableCell>{getStatusBadge(count.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedCount(count)}>
                          عرض الفروقات
                        </Button>
                        {count.status === DocumentStatus.DRAFT && (
                          <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white" onClick={() => approveMutation.mutate(count.id)} disabled={approveMutation.isPending}>
                            <CheckCircle2 className="size-4 ml-1" /> اعتماد وتوليد تسوية تلقائية
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* View Variance Modal */}
      <Dialog
        open={!!selectedCount}
        onOpenChange={(open) => {
          if (!open) setSelectedCount(null)
        }}
      >
        <DialogContent className="max-w-2xl" dir="rtl">
          <DialogHeader>
            <DialogTitle>جدول فروقات الجرد الفعلي #{selectedCount?.id}</DialogTitle>
          </DialogHeader>
          <div className="py-2 space-y-3">
            <Table>
              <TableHeader className="bg-slate-100">
                <TableRow>
                  <TableHead className="text-right">رمز/اسم الصنف</TableHead>
                  <TableHead className="text-right">رصيد النظام (systemQty)</TableHead>
                  <TableHead className="text-right">الجرد الفعلي (countedQty)</TableHead>
                  <TableHead className="text-right">الفارق (Variance)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedCount?.items?.map((item, idx) => {
                  const itName = items.find((i) => i.id === item.itemId)?.name || `#${item.itemId}`
                  const variance = item.countedQty - item.systemQty
                  return (
                    <TableRow key={idx}>
                      <TableCell className="font-mono font-medium">{itName}</TableCell>
                      <TableCell className="font-semibold text-slate-700">{item.systemQty}</TableCell>
                      <TableCell className="font-semibold text-slate-900">{item.countedQty}</TableCell>
                      <TableCell>
                        {variance === 0 ? (
                          <span className="text-slate-500 font-semibold">مطابق (0)</span>
                        ) : variance > 0 ? (
                          <span className="text-emerald-600 font-bold">+{variance} (فائض)</span>
                        ) : (
                          <span className="text-rose-600 font-bold">{variance} (عجز)</span>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>

            {selectedCount?.status === DocumentStatus.DRAFT && (
              <div className="flex items-center gap-2 p-3 bg-amber-50 rounded text-xs text-amber-800 border border-amber-200">
                <AlertCircle className="size-4 shrink-0" />
                عند الضغط على اعتماد السند، سيقوم النظام تلقائياً بإنشاء وترحيل تسوية مخزنية (Stock Adjustment) للأصناف ذات الفروقات غير الصفرية.
              </div>
            )}
          </div>
          <DialogFooter className="gap-2 sm:justify-start">
            {selectedCount?.status === DocumentStatus.DRAFT && (
              <Button className="bg-teal-600 hover:bg-teal-700 text-white" onClick={() => approveMutation.mutate(selectedCount.id)} disabled={approveMutation.isPending}>
                اعتماد الجرد والترحيل التلقائي
              </Button>
            )}
            <Button variant="outline" onClick={() => setSelectedCount(null)}>
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle>بدء عملية جرد فعلي جديدة</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-xs font-semibold text-slate-700">المستودع (Warehouse)</label>
              <select
                value={formData.warehouseId}
                onChange={(e) => setFormData({ ...formData, warehouseId: Number(e.target.value) })}
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
              <label className="text-xs font-semibold text-slate-700">التاريخ</label>
              <Input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
            </div>

            {/* Items */}
            {formData.items.map((line, idx) => (
              <div key={idx} className="border rounded p-2 bg-slate-50 space-y-2">
                <div>
                  <label className="text-[10px] text-slate-500">اختر الصنف المجرود</label>
                  <select
                    value={line.itemId}
                    onChange={(e) => {
                      const newItems = [...formData.items]
                      newItems[idx].itemId = Number(e.target.value)
                      setFormData({ ...formData, items: newItems })
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
                <div>
                  <label className="text-[10px] text-slate-500">الكمية المقاسة فعلياً</label>
                  <Input
                    type="number"
                    value={line.countedQty}
                    onChange={(e) => {
                      const newItems = [...formData.items]
                      newItems[idx].countedQty = Number(e.target.value)
                      setFormData({ ...formData, items: newItems })
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <DialogFooter className="gap-2 sm:justify-start">
            <Button onClick={() => createMutation.mutate(formData)} disabled={createMutation.isPending}>
              إنشاء وحفظ لقطة النظام (Snapshot)
            </Button>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              إلغاء
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
