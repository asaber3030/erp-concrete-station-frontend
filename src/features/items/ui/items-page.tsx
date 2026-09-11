import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Plus, Search, Filter, Trash2, Edit, Package } from "lucide-react"
import { Button } from "#/shared/components/ui/button"
import { Input } from "#/shared/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "#/shared/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "#/shared/components/ui/dialog"
import { ItemType, type Item } from "#/shared/types/warehouse"
import { listItems, createItem, updateItem, deleteItem } from "../api/items.api"
import { listCategories } from "#/features/categories/api/categories-api"
import { listUnits } from "#/features/units/api/units-api"
import { listEquipment } from "#/features/master-resources/api/master-resources.api"

export function ItemsPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState<ItemType | "">("")
  const [page, setPage] = useState(1)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Item | null>(null)

  // Master Data Dropdowns
  const { data: categoriesData } = useQuery({
    queryKey: ["categories-select"],
    queryFn: async () => listCategories(),
  })
  const { data: unitsData } = useQuery({
    queryKey: ["units-select"],
    queryFn: async () => listUnits(),
  })
  const { data: equipmentData } = useQuery({
    queryKey: ["equipment-select"],
    queryFn: async () => listEquipment({ data: { page: 1, per_page: 100 } }),
  })

  const categories = categoriesData?.data || []
  const units = unitsData?.data || []
  const equipmentList = equipmentData?.data || []

  // Form State
  const [formData, setFormData] = useState<{
    code: string
    name: string
    type: ItemType
    categoryId: number
    unitId: number
    minStock: number
    equipmentId?: number
  }>({
    code: "",
    name: "",
    type: ItemType.RAW_MATERIAL,
    categoryId: 1,
    unitId: 1,
    minStock: 0,
  })

  const { data: paginatedItems, isLoading } = useQuery({
    queryKey: ["items", page, search, typeFilter],
    queryFn: async () => {
      return await listItems({
        data: {
          page,
          per_page: 15,
          search: search || undefined,
          type: typeFilter ? (typeFilter as ItemType) : undefined,
        },
      })
    },
  })

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return await createItem({ data })
    },
    onSuccess: (res: any) => {
      toast.success(res?.message || "تم إنشاء الصنف بنجاح")
      queryClient.invalidateQueries({ queryKey: ["items"] })
      setIsCreateOpen(false)
      resetForm()
    },
    onError: (err: any) => {
      toast.error(err?.message || "حدث خطأ أثناء إنشاء الصنف")
    },
  })

  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData & { id: number }) => {
      return await updateItem({ data })
    },
    onSuccess: (res: any) => {
      toast.success(res?.message || "تم تعديل بيانات الصنف بنجاح")
      queryClient.invalidateQueries({ queryKey: ["items"] })
      setEditingItem(null)
      resetForm()
    },
    onError: (err: any) => {
      toast.error(err?.message || "حدث خطأ أثناء تعديل الصنف")
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await deleteItem({ data: { id } })
    },
    onSuccess: (res: any) => {
      toast.success(res?.message || "تم حذف الصنف بنجاح")
      queryClient.invalidateQueries({ queryKey: ["items"] })
    },
    onError: (err: any) => {
      toast.error(err?.message || "حدث خطأ أثناء حذف الصنف")
    },
  })

  function resetForm() {
    setFormData({
      code: "",
      name: "",
      type: ItemType.RAW_MATERIAL,
      categoryId: categories[0]?.id || 1,
      unitId: units[0]?.id || 1,
      minStock: 0,
    })
  }

  function handleEdit(item: Item) {
    setEditingItem(item)
    setFormData({
      code: item.code,
      name: item.name,
      type: item.type,
      categoryId: item.categoryId || 1,
      unitId: item.unitId || 1,
      minStock: item.minStock || 0,
      equipmentId: item.equipmentId || undefined,
    })
  }

  const getItemTypeBadge = (type: ItemType) => {
    const map: Record<ItemType, { label: string; bg: string }> = {
      [ItemType.RAW_MATERIAL]: { label: "مادة خام", bg: "bg-blue-100 text-blue-800" },
      [ItemType.SPARE_PART]: { label: "قطع غيار", bg: "bg-purple-100 text-purple-800" },
      [ItemType.CONSUMABLE]: { label: "مستلزمات", bg: "bg-amber-100 text-amber-800" },
      [ItemType.FUEL]: { label: "وقود", bg: "bg-emerald-100 text-emerald-800" },
      [ItemType.OTHER]: { label: "أخرى", bg: "bg-slate-100 text-slate-800" },
    }
    const target = map[type] || { label: type, bg: "bg-gray-100 text-gray-800" }
    return <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${target.bg}`}>{target.label}</span>
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-lg border shadow-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Package className="size-6 text-primary" />
            دليل الأصناف والمواد
          </h1>
          <p className="text-sm text-slate-500 mt-1">إدارة كافة المواد المخزنية (المواد الخام، قطع الغيار، الوقود، والمستهلكات) في جدول موحد</p>
        </div>
        <Button
          onClick={() => {
            resetForm()
            setIsCreateOpen(true)
          }}
          className="gap-2"
        >
          <Plus className="size-4" /> إضافة صنف جديد
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-lg border shadow-sm">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute right-3 top-2.5 size-4 text-slate-400" />
          <Input placeholder="بحث بالرمز أو الاسم..." value={search} onChange={(e) => setSearch(e.target.value)} className="pr-9" />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="size-4 text-slate-500" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as ItemType | "")}
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
          >
            <option value="">جميع أنواع الأصناف</option>
            <option value={ItemType.RAW_MATERIAL}>مادة خام (RAW_MATERIAL)</option>
            <option value={ItemType.SPARE_PART}>قطع غيار (SPARE_PART)</option>
            <option value={ItemType.CONSUMABLE}>مستلزمات (CONSUMABLE)</option>
            <option value={ItemType.FUEL}>وقود (FUEL)</option>
            <option value={ItemType.OTHER}>أخرى (OTHER)</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="text-right font-bold">الرمز (Code)</TableHead>
              <TableHead className="text-right font-bold">اسم الصنف (Name)</TableHead>
              <TableHead className="text-right font-bold">نوع الصنف (Type)</TableHead>
              <TableHead className="text-right font-bold">التصنيف والوحدة</TableHead>
              <TableHead className="text-right font-bold">الحد الأدنى للرصيد</TableHead>
              <TableHead className="text-right font-bold">الرصيد الحالي / متوسط التكلفة</TableHead>
              <TableHead className="text-center font-bold">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                  جاري تحميل البيانات...
                </TableCell>
              </TableRow>
            ) : paginatedItems?.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                  لا توجد أصناف مسجلة
                </TableCell>
              </TableRow>
            ) : (
              paginatedItems?.data.map((item) => {
                const catName = categories.find((c) => c.id === item.categoryId)?.name || item.categoryName || `#${item.categoryId}`
                const unitName = units.find((u) => u.id === item.unitId)?.name || item.unitName || `#${item.unitId}`
                return (
                  <TableRow key={item.id} className="hover:bg-slate-50">
                    <TableCell className="font-mono text-sm font-semibold">{item.code}</TableCell>
                    <TableCell className="font-medium text-slate-900">{item.name}</TableCell>
                    <TableCell>{getItemTypeBadge(item.type)}</TableCell>
                    <TableCell className="text-xs text-slate-600">
                      <div>تصنيف: {catName}</div>
                      <div>وحدة: {unitName}</div>
                    </TableCell>
                    <TableCell className="font-semibold text-slate-700">{item.minStock}</TableCell>
                    <TableCell className="text-xs">
                      <div className="font-semibold text-emerald-700">الرصيد: {item.currentStock ?? 0}</div>
                      <div className="text-slate-500">متوسط التكلفة: {item.avgCost ? `${item.avgCost.toFixed(2)} د.أ` : "0.00"}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                          <Edit className="size-4 text-blue-600" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(item.id)}>
                          <Trash2 className="size-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {paginatedItems?.meta && paginatedItems.meta.last_page > 1 && (
          <div className="flex items-center justify-between p-4 border-t bg-slate-50">
            <span className="text-sm text-slate-600">
              الصفحة {paginatedItems.meta.page} من {paginatedItems.meta.last_page}
            </span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                السابق
              </Button>
              <Button variant="outline" size="sm" disabled={page >= paginatedItems.meta.last_page} onClick={() => setPage((p) => p + 1)}>
                التالي
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Dialog for Create & Edit */}
      <Dialog
        open={isCreateOpen || !!editingItem}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateOpen(false)
            setEditingItem(null)
          }
        }}
      >
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle>{editingItem ? "تعديل صنف" : "إضافة صنف جديد"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-xs font-semibold text-slate-700">رمز الصنف (Code)</label>
              <Input value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} placeholder="مثال: RM-CEM-001" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700">اسم الصنف (Name)</label>
              <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="مثال: إسمنت بورتلاندي 42.5" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700">نوع الصنف (Item Type)</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as ItemType })}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
              >
                <option value={ItemType.RAW_MATERIAL}>مادة خام (RAW_MATERIAL)</option>
                <option value={ItemType.SPARE_PART}>قطع غيار (SPARE_PART)</option>
                <option value={ItemType.CONSUMABLE}>مستلزمات (CONSUMABLE)</option>
                <option value={ItemType.FUEL}>وقود (FUEL)</option>
                <option value={ItemType.OTHER}>أخرى (OTHER)</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700">التصنيف (Category)</label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: Number(e.target.value) })}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                  {categories.length === 0 && <option value={1}>افتراضي (#1)</option>}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700">الوحدة (Unit)</label>
                <select
                  value={formData.unitId}
                  onChange={(e) => setFormData({ ...formData, unitId: Number(e.target.value) })}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                >
                  {units.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                  {units.length === 0 && <option value={1}>افتراضي (#1)</option>}
                </select>
              </div>
            </div>

            {formData.type === ItemType.SPARE_PART && (
              <div>
                <label className="text-xs font-semibold text-slate-700">المعدة المرتبطة (اختياري)</label>
                <select
                  value={formData.equipmentId || ""}
                  onChange={(e) => setFormData({ ...formData, equipmentId: e.target.value ? Number(e.target.value) : undefined })}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                >
                  <option value="">بدون معدة محددة</option>
                  {equipmentList.map((eq) => (
                    <option key={eq.id} value={eq.id}>
                      {eq.name} ({eq.code})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-slate-700">الحد الأدنى للمخزون (Min Stock)</label>
              <Input type="number" value={formData.minStock} onChange={(e) => setFormData({ ...formData, minStock: Number(e.target.value) })} />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:justify-start">
            <Button
              onClick={() => {
                if (editingItem) {
                  updateMutation.mutate({ ...formData, id: editingItem.id })
                } else {
                  createMutation.mutate(formData)
                }
              }}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {editingItem ? "حفظ التعديلات" : "إنشاء الصنف"}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateOpen(false)
                setEditingItem(null)
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
