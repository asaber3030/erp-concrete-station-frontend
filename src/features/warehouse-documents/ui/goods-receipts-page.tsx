import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Plus, CheckCircle2, XCircle, FileText, ShoppingCart } from "lucide-react"
import { Button } from "#/shared/components/ui/button"
import { Input } from "#/shared/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "#/shared/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "#/shared/components/ui/dialog"
import { DocumentStatus, type GoodsReceipt } from "#/shared/types/warehouse"
import { listGoodsReceipts, createGoodsReceipt, postGoodsReceipt, cancelGoodsReceipt, type CreateGoodsReceiptInput } from "../api/warehouse-documents.api"
import { listSuppliers } from "#/features/suppliers/api/suppliers-api"
import { listWarehouses } from "#/features/master-resources/api/master-resources.api"
import { listItems } from "#/features/items/api/items.api"

export function GoodsReceiptsPage() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [warehouseIdFilter, setWarehouseIdFilter] = useState<number | undefined>()
  const [statusFilter, setStatusFilter] = useState<DocumentStatus | undefined>()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [selectedReceipt, setSelectedReceipt] = useState<GoodsReceipt | null>(null)

  // Master options
  const { data: suppliersData } = useQuery({
    queryKey: ["suppliers-select"],
    queryFn: async () => listSuppliers(),
  })
  const { data: warehousesData } = useQuery({
    queryKey: ["warehouses-select"],
    queryFn: async () => listWarehouses({ data: { page: 1, per_page: 100 } }),
  })
  const { data: itemsData } = useQuery({
    queryKey: ["items-select"],
    queryFn: async () => listItems({ data: { page: 1, per_page: 100 } }),
  })

  const suppliers = suppliersData?.data || []
  const warehouses = warehousesData?.data || []
  const items = itemsData?.data || []

  // Form State
  const [formData, setFormData] = useState<CreateGoodsReceiptInput>({
    number: `GR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    date: new Date().toISOString().split("T")[0],
    supplierId: suppliers[0]?.id || 1,
    warehouseId: warehouses[0]?.id || 1,
    items: [{ itemId: items[0]?.id || 1, quantity: 100, unitCost: 50 }],
  })

  const { data: paginatedReceipts, isLoading } = useQuery({
    queryKey: ["goods-receipts", page, warehouseIdFilter, statusFilter],
    queryFn: async () => {
      return await listGoodsReceipts({
        data: {
          page,
          per_page: 15,
          warehouseId: warehouseIdFilter,
          status: statusFilter,
        },
      })
    },
  })

  const createMutation = useMutation({
    mutationFn: async (data: CreateGoodsReceiptInput) => {
      return await createGoodsReceipt({ data })
    },
    onSuccess: (res: any) => {
      toast.success(res?.message || "تم حفظ مسودة سند الاستلام بنجاح")
      queryClient.invalidateQueries({ queryKey: ["goods-receipts"] })
      setIsCreateOpen(false)
      resetForm()
    },
    onError: (err: any) => {
      toast.error(err?.message || "حدث خطأ أثناء حفظ سند الاستلام")
    },
  })

  const postMutation = useMutation({
    mutationFn: async (id: number) => {
      return await postGoodsReceipt({ data: { id } })
    },
    onSuccess: (res: any) => {
      toast.success(res?.message || "تم ترحيل سند الاستلام بنجاح وتحديث الحركات المخزنية")
      queryClient.invalidateQueries({ queryKey: ["goods-receipts"] })
      setSelectedReceipt(null)
    },
    onError: (err: any) => {
      toast.error(err?.message || "حدث خطأ أثناء ترحيل سند الاستلام")
    },
  })

  const cancelMutation = useMutation({
    mutationFn: async (id: number) => {
      return await cancelGoodsReceipt({ data: { id } })
    },
    onSuccess: (res: any) => {
      toast.success(res?.message || "تم إلغاء سند الاستلام وتوليد القيود العكسية")
      queryClient.invalidateQueries({ queryKey: ["goods-receipts"] })
      setSelectedReceipt(null)
    },
    onError: (err: any) => {
      toast.error(err?.message || "حدث خطأ أثناء إلغاء سند الاستلام")
    },
  })

  function resetForm() {
    setFormData({
      number: `GR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split("T")[0],
      supplierId: suppliers[0]?.id || 1,
      warehouseId: warehouses[0]?.id || 1,
      items: [{ itemId: items[0]?.id || 1, quantity: 100, unitCost: 50 }],
    })
  }

  function addItemLine() {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { itemId: items[0]?.id || 1, quantity: 1, unitCost: 0 }],
    }))
  }

  function removeItemLine(index: number) {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }))
  }

  const getStatusBadge = (status: DocumentStatus) => {
    switch (status) {
      case DocumentStatus.DRAFT:
        return <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-amber-100 text-amber-800">مسودة (DRAFT)</span>
      case DocumentStatus.POSTED:
        return <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800">رحّل (POSTED)</span>
      case DocumentStatus.CANCELLED:
        return <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-rose-100 text-rose-800">ملغى (CANCELLED)</span>
    }
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-lg border shadow-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <ShoppingCart className="size-6 text-emerald-600" />
            سندات استلام البضائع (Goods Receipts)
          </h1>
          <p className="text-sm text-slate-500 mt-1">إدخال الشحنات والمواد الخام وقطع الغيار إلى المستودعات وتحديث متوسط التكلفة الموزون</p>
        </div>
        <Button
          onClick={() => {
            resetForm()
            setIsCreateOpen(true)
          }}
          className="gap-2 bg-emerald-600 hover:bg-emerald-700"
        >
          <Plus className="size-4" /> إنشاء سند استلام جديد
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-lg border shadow-sm">
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-700">المستودع:</label>
          <select
            value={warehouseIdFilter || ""}
            onChange={(e) => setWarehouseIdFilter(e.target.value ? Number(e.target.value) : undefined)}
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">جميع المستودعات</option>
            {warehouses.map((wh) => (
              <option key={wh.id} value={wh.id}>
                {wh.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-700">حالة المستند:</label>
          <select
            value={statusFilter || ""}
            onChange={(e) => setStatusFilter(e.target.value ? (e.target.value as DocumentStatus) : undefined)}
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">جميع الحالات</option>
            <option value={DocumentStatus.DRAFT}>مسودة (DRAFT)</option>
            <option value={DocumentStatus.POSTED}>مرحّل (POSTED)</option>
            <option value={DocumentStatus.CANCELLED}>ملغى (CANCELLED)</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="text-right font-bold">رقم المستند</TableHead>
              <TableHead className="text-right font-bold">التاريخ</TableHead>
              <TableHead className="text-right font-bold">المستودع والمورد</TableHead>
              <TableHead className="text-right font-bold">عدد العناصر</TableHead>
              <TableHead className="text-right font-bold">الحالة</TableHead>
              <TableHead className="text-center font-bold">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                  جاري التحميل...
                </TableCell>
              </TableRow>
            ) : paginatedReceipts?.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                  لا توجد سندات استلام
                </TableCell>
              </TableRow>
            ) : (
              paginatedReceipts?.data.map((receipt) => {
                const suppName = suppliers.find((s) => s.id === receipt.supplierId)?.name || receipt.supplierName || `#${receipt.supplierId}`
                const whName = warehouses.find((w) => w.id === receipt.warehouseId)?.name || receipt.warehouseName || `#${receipt.warehouseId}`
                return (
                  <TableRow key={receipt.id} className="hover:bg-slate-50">
                    <TableCell className="font-mono font-semibold">{receipt.number}</TableCell>
                    <TableCell className="text-slate-600">{receipt.date}</TableCell>
                    <TableCell className="text-xs text-slate-700">
                      <div className="font-medium text-slate-900">مستودع: {whName}</div>
                      <div className="text-slate-500">المورد: {suppName}</div>
                    </TableCell>
                    <TableCell className="font-semibold">{receipt.items?.length || 0} عناصر</TableCell>
                    <TableCell>{getStatusBadge(receipt.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedReceipt(receipt)}>
                          <FileText className="size-4 text-blue-600 ml-1" /> التفاصيل
                        </Button>
                        {receipt.status === DocumentStatus.DRAFT && (
                          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => postMutation.mutate(receipt.id)} disabled={postMutation.isPending}>
                            <CheckCircle2 className="size-4 ml-1" /> ترحيل (POST)
                          </Button>
                        )}
                        {receipt.status === DocumentStatus.POSTED && (
                          <Button variant="destructive" size="sm" onClick={() => cancelMutation.mutate(receipt.id)} disabled={cancelMutation.isPending}>
                            <XCircle className="size-4 ml-1" /> إلغاء (CANCEL)
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

      {/* Details Modal */}
      <Dialog
        open={!!selectedReceipt}
        onOpenChange={(open) => {
          if (!open) setSelectedReceipt(null)
        }}
      >
        <DialogContent className="max-w-xl" dir="rtl">
          <DialogHeader>
            <DialogTitle>تفاصيل سند الاستلام {selectedReceipt?.number}</DialogTitle>
          </DialogHeader>
          <div className="py-2 space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded">
              <div>
                <strong>تاريخ السند:</strong> {selectedReceipt?.date}
              </div>
              <div>
                <strong>الحالة:</strong> {selectedReceipt?.status}
              </div>
              <div>
                <strong>المستودع:</strong> #{selectedReceipt?.warehouseId}
              </div>
              <div>
                <strong>المورد:</strong> #{selectedReceipt?.supplierId}
              </div>
            </div>
            <Table>
              <TableHeader className="bg-slate-100">
                <TableRow>
                  <TableHead className="text-right">معرف الصنف</TableHead>
                  <TableHead className="text-right">الكمية المستلمة</TableHead>
                  <TableHead className="text-right">سعر الوحدة</TableHead>
                  <TableHead className="text-right">الإجمالي</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedReceipt?.items?.map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-mono">#{item.itemId}</TableCell>
                    <TableCell className="font-bold">{item.quantity}</TableCell>
                    <TableCell>{item.unitCost?.toFixed(2)} د.أ</TableCell>
                    <TableCell className="font-bold text-emerald-700">{(item.quantity * item.unitCost).toFixed(2)} د.أ</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedReceipt(null)}>
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl" dir="rtl">
          <DialogHeader>
            <DialogTitle>إنشاء سند استلام بضائع جديد (Goods Receipt Draft)</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700">رقم السند</label>
                <Input value={formData.number} onChange={(e) => setFormData({ ...formData, number: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700">التاريخ</label>
                <Input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700">المستودع (Warehouse)</label>
                <select
                  value={formData.warehouseId}
                  onChange={(e) => setFormData({ ...formData, warehouseId: Number(e.target.value) })}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                >
                  {warehouses.map((wh) => (
                    <option key={wh.id} value={wh.id}>
                      {wh.name}
                    </option>
                  ))}
                  {warehouses.length === 0 && <option value={1}>مستودع رئيسي (#1)</option>}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700">المورد (Supplier)</label>
                <select
                  value={formData.supplierId}
                  onChange={(e) => setFormData({ ...formData, supplierId: Number(e.target.value) })}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                >
                  {suppliers.map((supp) => (
                    <option key={supp.id} value={supp.id}>
                      {supp.name}
                    </option>
                  ))}
                  {suppliers.length === 0 && <option value={1}>مورد افتراضي (#1)</option>}
                </select>
              </div>
            </div>

            {/* Item lines */}
            <div className="border rounded-md p-3 space-y-3 bg-slate-50">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-800">بنود المستند (Items)</h4>
                <Button size="sm" variant="outline" onClick={addItemLine}>
                  + إضافة صنف
                </Button>
              </div>
              {formData.items.map((line, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-white p-2 rounded border">
                  <div className="col-span-5">
                    <label className="text-[10px] text-slate-500">اختر الصنف</label>
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
                  <div className="col-span-3">
                    <label className="text-[10px] text-slate-500">الكمية (Quantity)</label>
                    <Input
                      type="number"
                      value={line.quantity}
                      onChange={(e) => {
                        const newItems = [...formData.items]
                        newItems[idx].quantity = Number(e.target.value)
                        setFormData({ ...formData, items: newItems })
                      }}
                    />
                  </div>
                  <div className="col-span-3">
                    <label className="text-[10px] text-slate-500">سعر الوحدة (Unit Cost)</label>
                    <Input
                      type="number"
                      value={line.unitCost}
                      onChange={(e) => {
                        const newItems = [...formData.items]
                        newItems[idx].unitCost = Number(e.target.value)
                        setFormData({ ...formData, items: newItems })
                      }}
                    />
                  </div>
                  <div className="col-span-1 text-center">
                    <Button variant="ghost" size="icon" onClick={() => removeItemLine(idx)} disabled={formData.items.length === 1}>
                      <XCircle className="size-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter className="gap-2 sm:justify-start">
            <Button onClick={() => createMutation.mutate(formData)} disabled={createMutation.isPending}>
              حفظ كمسودة (Save Draft)
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
