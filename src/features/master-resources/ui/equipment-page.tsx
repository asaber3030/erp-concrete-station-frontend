import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Truck, Plus, Search, Trash2, Edit, Wrench, CheckCircle2 } from "lucide-react"
import { Button } from "#/shared/components/ui/button"
import { Input } from "#/shared/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "#/shared/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "#/shared/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "#/shared/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "#/shared/components/ui/card"
import type { Equipment } from "#/shared/types/warehouse"
import { listEquipment, createEquipment, updateEquipment, deleteEquipment, type CreateEquipmentInput } from "../api/master-resources.api"

export function EquipmentPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null)

  const [formData, setFormData] = useState<CreateEquipmentInput>({
    code: "",
    name: "",
    type: "خلاطة",
    status: "نشطة",
  })

  const { data: paginatedEquipment, isLoading } = useQuery({
    queryKey: ["equipment-list", page, search],
    queryFn: async () => listEquipment({ data: { page, per_page: 15, search: search || undefined } }),
  })

  const createMutation = useMutation({
    mutationFn: async (data: CreateEquipmentInput) => createEquipment({ data }),
    onSuccess: (res: any) => {
      toast.success(res?.message || "تم إضافة المعدة بنجاح")
      queryClient.invalidateQueries({ queryKey: ["equipment-list"] })
      setIsCreateOpen(false)
      resetForm()
    },
    onError: (err: any) => {
      toast.error(err?.message || "حدث خطأ أثناء إضافة المعدة")
    },
  })

  const updateMutation = useMutation({
    mutationFn: async (data: CreateEquipmentInput & { id: number }) => updateEquipment({ data }),
    onSuccess: (res: any) => {
      toast.success(res?.message || "تم تعديل بيانات المعدة بنجاح")
      queryClient.invalidateQueries({ queryKey: ["equipment-list"] })
      setEditingEquipment(null)
      resetForm()
    },
    onError: (err: any) => {
      toast.error(err?.message || "حدث خطأ أثناء تعديل البيانات")
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => deleteEquipment({ data: { id } }),
    onSuccess: (res: any) => {
      toast.success(res?.message || "تم حذف المعدة بنجاح")
      queryClient.invalidateQueries({ queryKey: ["equipment-list"] })
    },
    onError: (err: any) => {
      toast.error(err?.message || "حدث خطأ أثناء حذف المعدة")
    },
  })

  function resetForm() {
    setFormData({
      code: "",
      name: "",
      type: "خلاطة",
      status: "نشطة",
    })
  }

  function handleEdit(eq: Equipment) {
    setEditingEquipment(eq)
    setFormData({
      code: eq.code,
      name: eq.name,
      type: eq.type || "خلاطة",
      status: eq.status || "نشطة",
    })
  }

  const items = paginatedEquipment?.data || []
  const totalCount = paginatedEquipment?.meta?.total ?? items.length
  const activeCount = items.filter((i) => i.status === "نشطة" || !i.status).length
  const maintenanceCount = items.filter((i) => i.status === "صيانة" || i.status === "متوقفة").length
  const lastPage = paginatedEquipment?.meta?.last_page ?? 1

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-lg border shadow-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Truck className="size-6 text-blue-600" />
            إدارة الأسطول والمعدات (Equipment Management)
          </h1>
          <p className="text-sm text-slate-500 mt-1">سجل المعدات والخلاطات والمضخات وربطها بأذونات صرف الوقود وقطع الغيار</p>
        </div>
        <Button
          onClick={() => {
            resetForm()
            setIsCreateOpen(true)
          }}
          className="gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="size-4" /> إضافة معدة جديدة
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border shadow-sm bg-gradient-to-br from-blue-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">إجمالي المعدات والآليات</CardTitle>
            <Truck className="size-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{totalCount}</div>
            <p className="text-xs text-slate-500 mt-1">معدة مسجلة بأسطول المحطة</p>
          </CardContent>
        </Card>

        <Card className="border shadow-sm bg-gradient-to-br from-emerald-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">المعدات النشطة (Operational)</CardTitle>
            <CheckCircle2 className="size-5 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-700">{activeCount}</div>
            <p className="text-xs text-slate-500 mt-1">جاهزة للتشغيل وصرف المحروقات</p>
          </CardContent>
        </Card>

        <Card className="border shadow-sm bg-gradient-to-br from-amber-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">تحت الصيانة / متوقفة</CardTitle>
            <Wrench className="size-5 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-700">{maintenanceCount}</div>
            <p className="text-xs text-slate-500 mt-1">تحتاج متابعة فنية وقطع غيار</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg border shadow-sm flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute right-3 top-2.5 size-4 text-slate-400" />
          <Input placeholder="بحث بالرمز أو اسم المعدة..." value={search} onChange={(e) => setSearch(e.target.value)} className="pr-9" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="text-right font-bold">معرف / رمز المعدة</TableHead>
              <TableHead className="text-right font-bold">اسم المعدة</TableHead>
              <TableHead className="text-right font-bold">النوع</TableHead>
              <TableHead className="text-right font-bold">الحالة التشغيلية</TableHead>
              <TableHead className="text-center font-bold">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                  جاري تحميل البيانات...
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                  لا توجد معدات مسجلة
                </TableCell>
              </TableRow>
            ) : (
              items.map((eq) => (
                <TableRow key={eq.id} className="hover:bg-slate-50">
                  <TableCell className="font-mono font-bold text-blue-700">{eq.code}</TableCell>
                  <TableCell className="font-medium text-slate-900">{eq.name}</TableCell>
                  <TableCell className="text-slate-600 text-sm">{eq.type || "عام"}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                        eq.status === "صيانة" || eq.status === "متوقفة" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {eq.status || "نشطة"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(eq)}>
                        <Edit className="size-4 text-blue-600" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(eq.id)}>
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
        open={isCreateOpen || !!editingEquipment}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateOpen(false)
            setEditingEquipment(null)
          }
        }}
      >
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle>{editingEquipment ? "تعديل معدة" : "إضافة معدة جديدة"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-xs font-semibold text-slate-700">رمز المعدة (Code)</label>
              <Input value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} placeholder="مثال: EQ-MIX-01" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700">اسم المعدة (Name)</label>
              <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="مثال: خلاطة مرسيدس 12م³" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700">النوع (Type)</label>
              <Select value={formData.type} onValueChange={(val) => setFormData({ ...formData, type: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر نوع المعدة" />
                </SelectTrigger>
                <SelectContent dir="rtl">
                  <SelectItem value="خلاطة">خلاطة خرسانة (Concrete Mixer)</SelectItem>
                  <SelectItem value="مضخة">مضخة خرسانة (Concrete Pump)</SelectItem>
                  <SelectItem value="جرافة">جرافة / لودر (Wheel Loader)</SelectItem>
                  <SelectItem value="مولد">مولد كهربائي (Generator)</SelectItem>
                  <SelectItem value="مركبة">مركبة خدمة / صهريج (Service Vehicle)</SelectItem>
                  <SelectItem value="أخرى">أخرى (Other Equipment)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700">الحالة التشغيلية</label>
              <Select value={formData.status} onValueChange={(val) => setFormData({ ...formData, status: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر حالة المعدة" />
                </SelectTrigger>
                <SelectContent dir="rtl">
                  <SelectItem value="نشطة">نشطة (Active / Operational)</SelectItem>
                  <SelectItem value="صيانة">تحت الصيانة (Under Maintenance)</SelectItem>
                  <SelectItem value="متوقفة">متوقفة عن العمل (Out of Service)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:justify-start">
            <Button
              onClick={() => {
                if (editingEquipment) {
                  updateMutation.mutate({ ...formData, id: editingEquipment.id })
                } else {
                  createMutation.mutate(formData)
                }
              }}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {editingEquipment ? "حفظ التعديلات" : "إضافة المعدة"}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateOpen(false)
                setEditingEquipment(null)
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
