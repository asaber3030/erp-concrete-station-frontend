import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Plus, CheckCircle2, XCircle, ArrowUpRight } from "lucide-react"
import { Button } from "#/shared/components/ui/button"
import { Input } from "#/shared/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "#/shared/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "#/shared/components/ui/dialog"
import { DocumentStatus } from "#/shared/types/warehouse"
import { listInventoryIssues, createInventoryIssue, postInventoryIssue, cancelInventoryIssue, type CreateInventoryIssueInput } from "../api/warehouse-documents.api"
import { listWarehouses, listEquipment, listCostCenters } from "#/features/master-resources/api/master-resources.api"
import { listItems } from "#/features/items/api/items.api"

export function InventoryIssuesPage() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<DocumentStatus | undefined>()
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  // Master Options
  const { data: warehousesData } = useQuery({
    queryKey: ["warehouses-select"],
    queryFn: async () => listWarehouses({ data: { page: 1, per_page: 100 } }),
  })
  const { data: equipmentData } = useQuery({
    queryKey: ["equipment-select"],
    queryFn: async () => listEquipment({ data: { page: 1, per_page: 100 } }),
  })
  const { data: costCentersData } = useQuery({
    queryKey: ["cost-centers-select"],
    queryFn: async () => listCostCenters({ data: { page: 1, per_page: 100 } }),
  })
  const { data: itemsData } = useQuery({
    queryKey: ["items-select"],
    queryFn: async () => listItems({ data: { page: 1, per_page: 100 } }),
  })

  const warehouses = warehousesData?.data || []
  const equipmentList = equipmentData?.data || []
  const costCenters = costCentersData?.data || []
  const items = itemsData?.data || []

  // Form State
  const [formData, setFormData] = useState<CreateInventoryIssueInput>({
    number: `ISS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    date: new Date().toISOString().split("T")[0],
    warehouseId: warehouses[0]?.id || 1,
    equipmentId: undefined,
    costCenterId: undefined,
    items: [{ itemId: items[0]?.id || 1, quantity: 2 }],
  })

  const { data: paginatedIssues, isLoading } = useQuery({
    queryKey: ["inventory-issues", page, statusFilter],
    queryFn: async () => {
      return await listInventoryIssues({
        data: { page, per_page: 15, status: statusFilter },
      })
    },
  })

  const createMutation = useMutation({
    mutationFn: async (data: CreateInventoryIssueInput) => {
      return await createInventoryIssue({ data })
    },
    onSuccess: (res: any) => {
      toast.success(res?.message || "تم إنشاء مسودة إذن الصرف بنجاح")
      queryClient.invalidateQueries({ queryKey: ["inventory-issues"] })
      setIsCreateOpen(false)
      resetForm()
    },
    onError: (err: any) => {
      toast.error(err?.message || "حدث خطأ أثناء حفظ إذن الصرف")
    },
  })

  const postMutation = useMutation({
    mutationFn: async (id: number) => {
      return await postInventoryIssue({ data: { id } })
    },
    onSuccess: (res: any) => {
      toast.success(res?.message || "تم ترحيل إذن الصرف وخصم المواد من المخزون بنجاح")
      queryClient.invalidateQueries({ queryKey: ["inventory-issues"] })
    },
    onError: (err: any) => {
      toast.error(err?.message || "حدث خطأ أثناء ترحيل إذن الصرف")
    },
  })

  const cancelMutation = useMutation({
    mutationFn: async (id: number) => {
      return await cancelInventoryIssue({ data: { id } })
    },
    onSuccess: (res: any) => {
      toast.success(res?.message || "تم إلغاء إذن الصرف وإعادة المواد للمخزون")
      queryClient.invalidateQueries({ queryKey: ["inventory-issues"] })
    },
    onError: (err: any) => {
      toast.error(err?.message || "حدث خطأ أثناء إلغاء إذن الصرف")
    },
  })

  function resetForm() {
    setFormData({
      number: `ISS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split("T")[0],
      warehouseId: warehouses[0]?.id || 1,
      equipmentId: undefined,
      costCenterId: undefined,
      items: [{ itemId: items[0]?.id || 1, quantity: 2 }],
    })
  }

  function addItemLine() {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { itemId: items[0]?.id || 1, quantity: 1 }],
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
            <ArrowUpRight className="size-6 text-indigo-600" />
            أذونات صرف المواد والمعدات (Inventory Issues)
          </h1>
          <p className="text-sm text-slate-500 mt-1">صرف قطع الغيار والوقود والمستهلكات لصالح المعدات أو مراكز التكلفة بمتوسط التكلفة الموزون</p>
        </div>
        <Button
          onClick={() => {
            resetForm()
            setIsCreateOpen(true)
          }}
          className="gap-2 bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="size-4" /> إنشاء إذن صرف جديد
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="text-right font-bold">رقم المستند</TableHead>
              <TableHead className="text-right font-bold">التاريخ</TableHead>
              <TableHead className="text-right font-bold">المستودع والمقصد</TableHead>
              <TableHead className="text-right font-bold">عدد البنود</TableHead>
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
            ) : paginatedIssues?.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                  لا توجد أذونات صرف
                </TableCell>
              </TableRow>
            ) : (
              paginatedIssues?.data.map((issue) => {
                const whName = warehouses.find((w) => w.id === issue.warehouseId)?.name || issue.warehouseName || `#${issue.warehouseId}`
                const eqName = issue.equipmentId ? equipmentList.find((e) => e.id === issue.equipmentId)?.name || issue.equipmentName || `#${issue.equipmentId}` : null
                const ccName = issue.costCenterId ? costCenters.find((c) => c.id === issue.costCenterId)?.name || issue.costCenterName || `#${issue.costCenterId}` : null
                return (
                  <TableRow key={issue.id} className="hover:bg-slate-50">
                    <TableCell className="font-mono font-semibold">{issue.number}</TableCell>
                    <TableCell className="text-slate-600">{issue.date}</TableCell>
                    <TableCell className="text-xs text-slate-700">
                      <div className="font-medium text-slate-900">مستودع: {whName}</div>
                      {eqName && <div className="text-slate-500">معدة: {eqName}</div>}
                      {ccName && <div className="text-slate-500">مركز تكلفة: {ccName}</div>}
                    </TableCell>
                    <TableCell className="font-semibold">{issue.items?.length || 0} بنود</TableCell>
                    <TableCell>{getStatusBadge(issue.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        {issue.status === DocumentStatus.DRAFT && (
                          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => postMutation.mutate(issue.id)} disabled={postMutation.isPending}>
                            <CheckCircle2 className="size-4 ml-1" /> ترحيل الصرف
                          </Button>
                        )}
                        {issue.status === DocumentStatus.POSTED && (
                          <Button variant="destructive" size="sm" onClick={() => cancelMutation.mutate(issue.id)} disabled={cancelMutation.isPending}>
                            <XCircle className="size-4 ml-1" /> إلغاء الصرف
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

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-xl" dir="rtl">
          <DialogHeader>
            <DialogTitle>إنشاء إذن صرف جديد (Inventory Issue Draft)</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700">رقم الإذن</label>
                <Input value={formData.number} onChange={(e) => setFormData({ ...formData, number: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700">التاريخ</label>
                <Input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700">المستودع المصدر</label>
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
                <label className="text-xs font-semibold text-slate-700">المعدة (اختياري)</label>
                <select
                  value={formData.equipmentId || ""}
                  onChange={(e) => setFormData({ ...formData, equipmentId: e.target.value ? Number(e.target.value) : undefined })}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                >
                  <option value="">لا توجد معدة</option>
                  {equipmentList.map((eq) => (
                    <option key={eq.id} value={eq.id}>
                      {eq.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700">مركز التكلفة (اختياري)</label>
                <select
                  value={formData.costCenterId || ""}
                  onChange={(e) => setFormData({ ...formData, costCenterId: e.target.value ? Number(e.target.value) : undefined })}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                >
                  <option value="">لا يوجد مركز تكلفة</option>
                  {costCenters.map((cc) => (
                    <option key={cc.id} value={cc.id}>
                      {cc.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Items */}
            <div className="border rounded-md p-3 space-y-3 bg-slate-50">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-800">الأصناف المصروفة</h4>
                <Button size="sm" variant="outline" onClick={addItemLine}>
                  + إضافة بند
                </Button>
              </div>
              {formData.items.map((line, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-white p-2 rounded border">
                  <div className="col-span-7">
                    <label className="text-[10px] text-slate-500">اختر الصنف المصروف</label>
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
                  <div className="col-span-5">
                    <label className="text-[10px] text-slate-500">الكمية المصروفة</label>
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
                </div>
              ))}
            </div>
          </div>
          <DialogFooter className="gap-2 sm:justify-start">
            <Button onClick={() => createMutation.mutate(formData)} disabled={createMutation.isPending}>
              حفظ المسودة
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
