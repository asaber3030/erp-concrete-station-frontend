import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Warehouse as WarehouseIcon, Plus, Search, Trash2, Edit, CheckCircle2, MapPin, Building2 } from "lucide-react"
import { Button } from "#/shared/components/ui/button"
import { Input } from "#/shared/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "#/shared/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "#/shared/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "#/shared/components/ui/card"
import { Switch } from "#/shared/components/ui/switch"
import type { Warehouse } from "#/shared/types/warehouse"
import { listWarehouses, createWarehouse, updateWarehouse, deleteWarehouse, type CreateWarehouseInput } from "../api/master-resources.api"

export function WarehousesPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null)

  const [formData, setFormData] = useState<CreateWarehouseInput>({
    code: "",
    name: "",
    location: "",
    is_active: true,
  })

  const { data: paginatedWarehouses, isLoading } = useQuery({
    queryKey: ["warehouses-list", page, search],
    queryFn: async () => listWarehouses({ data: { page, per_page: 15, search: search || undefined } }),
  })

  const createMutation = useMutation({
    mutationFn: async (data: CreateWarehouseInput) => createWarehouse({ data }),
    onSuccess: (res: any) => {
      toast.success(res?.message || "تم إضافة المستودع بنجاح")
      queryClient.invalidateQueries({ queryKey: ["warehouses-list"] })
      setIsCreateOpen(false)
      resetForm()
    },
    onError: (err: any) => {
      toast.error(err?.message || "حدث خطأ أثناء إضافة المستودع")
    },
  })

  const updateMutation = useMutation({
    mutationFn: async (data: CreateWarehouseInput & { id: number }) => updateWarehouse({ data }),
    onSuccess: (res: any) => {
      toast.success(res?.message || "تم تعديل بيانات المستودع بنجاح")
      queryClient.invalidateQueries({ queryKey: ["warehouses-list"] })
      setEditingWarehouse(null)
      resetForm()
    },
    onError: (err: any) => {
      toast.error(err?.message || "حدث خطأ أثناء تعديل البيانات")
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => deleteWarehouse({ data: { id } }),
    onSuccess: (res: any) => {
      toast.success(res?.message || "تم حذف المستودع بنجاح")
      queryClient.invalidateQueries({ queryKey: ["warehouses-list"] })
    },
    onError: (err: any) => {
      toast.error(err?.message || "حدث خطأ أثناء حذف المستودع")
    },
  })

  function resetForm() {
    setFormData({
      code: "",
      name: "",
      location: "",
      is_active: true,
    })
  }

  function handleEdit(wh: Warehouse) {
    setEditingWarehouse(wh)
    setFormData({
      code: wh.code || "",
      name: wh.name,
      location: wh.location || "",
      is_active: wh.is_active ?? true,
    })
  }

  const items = paginatedWarehouses?.data || []
  const totalCount = paginatedWarehouses?.meta?.total ?? items.length
  const activeCount = items.filter((i) => i.is_active !== false).length
  const lastPage = paginatedWarehouses?.meta?.last_page ?? 1

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-lg border shadow-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <WarehouseIcon className="size-6 text-blue-600" />
            إدارة المستودعات والمخازن (Warehouses Management)
          </h1>
          <p className="text-sm text-slate-500 mt-1">إدارة مستودعات المواد الخام وقطع الغيار والمحروقات والموقع الجغرافي للمحطة</p>
        </div>
        <Button
          onClick={() => {
            resetForm()
            setIsCreateOpen(true)
          }}
          className="gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="size-4" /> إضافة مستودع جديد
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border shadow-sm bg-gradient-to-br from-blue-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">إجمالي المستودعات</CardTitle>
            <Building2 className="size-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{totalCount}</div>
            <p className="text-xs text-slate-500 mt-1">مستودعات رئيسية وفرعية</p>
          </CardContent>
        </Card>

        <Card className="border shadow-sm bg-gradient-to-br from-emerald-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">المستودعات النشطة</CardTitle>
            <CheckCircle2 className="size-5 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-700">{activeCount}</div>
            <p className="text-xs text-slate-500 mt-1">مستودعات تعمل حالياً وتستقبل حركات</p>
          </CardContent>
        </Card>

        <Card className="border shadow-sm bg-gradient-to-br from-purple-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">المواقع الجغرافية</CardTitle>
            <MapPin className="size-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">{new Set(items.map((i) => i.location).filter(Boolean)).size || 1}</div>
            <p className="text-xs text-slate-500 mt-1">مواقع ومحطات خرسانية مختلفة</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg border shadow-sm flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute right-3 top-2.5 size-4 text-slate-400" />
          <Input placeholder="بحث بالرمز، الاسم، أو الموقع..." value={search} onChange={(e) => setSearch(e.target.value)} className="pr-9" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="text-right font-bold">معرف المستودع</TableHead>

              <TableHead className="text-right font-bold">رمز المستودع</TableHead>
              <TableHead className="text-right font-bold">اسم المستودع</TableHead>
              <TableHead className="text-right font-bold">الموقع الجغرافي</TableHead>
              <TableHead className="text-right font-bold">الحالة</TableHead>
              <TableHead className="text-center font-bold">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                  جاري تحميل البيانات...
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                  لا توجد مستودعات مسجلة
                </TableCell>
              </TableRow>
            ) : (
              items.map((wh) => (
                <TableRow key={wh.id} className="hover:bg-slate-50">
                  <TableCell className="font-mono font-bold text-slate-600">{wh.id}</TableCell>
                  <TableCell className="font-mono font-bold text-blue-700">{wh.code || `WH-${wh.id}`}</TableCell>
                  <TableCell className="font-medium text-slate-900">{wh.name}</TableCell>
                  <TableCell className="text-slate-600 text-sm">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="size-3 text-slate-400" />
                      {wh.location || "المحطة الرئيسية"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${wh.is_active !== false ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"}`}>
                      {wh.is_active !== false ? "نشط" : "غير نشط"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(wh)}>
                        <Edit className="size-4 text-blue-600" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(wh.id)}>
                        <Trash2 className="size-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {lastPage > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t bg-slate-50">
            <span className="text-xs text-slate-500">
              الصفحة {page} من {lastPage}
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                السابق
              </Button>
              <Button variant="outline" size="sm" disabled={page >= lastPage} onClick={() => setPage((p) => p + 1)}>
                التالي
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Dialog */}
      <Dialog
        open={isCreateOpen || !!editingWarehouse}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateOpen(false)
            setEditingWarehouse(null)
          }
        }}
      >
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle>{editingWarehouse ? "تعديل مستودع" : "إضافة مستودع جديد"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-xs font-semibold text-slate-700">رمز المستودع (Code)</label>
              <Input value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} placeholder="مثال: WH-MAIN-01" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700">اسم المستودع (Name)</label>
              <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="مثال: مستودع المواد الخام الرئيسي" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700">الموقع الجغرافي (Location)</label>
              <Input value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="مثال: محطة الرياض - المنطقة الإدارية" />
            </div>
            <div className="flex items-center justify-between pt-2">
              <label className="text-sm font-medium text-slate-700">تفعيل المستودع (Active Status)</label>
              <Switch checked={formData.is_active} onCheckedChange={(val) => setFormData({ ...formData, is_active: val })} />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:justify-start">
            <Button
              onClick={() => {
                if (editingWarehouse) {
                  updateMutation.mutate({ ...formData, id: editingWarehouse.id })
                } else {
                  createMutation.mutate(formData)
                }
              }}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {editingWarehouse ? "حفظ التعديلات" : "إضافة المستودع"}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateOpen(false)
                setEditingWarehouse(null)
              }}
            >
              إلغاء
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
