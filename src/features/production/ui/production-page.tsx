import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Factory, Plus, CheckCircle2, FlaskConical, Boxes, Flame } from "lucide-react"
import { Button } from "#/shared/components/ui/button"
import { Input } from "#/shared/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "#/shared/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "#/shared/components/ui/dialog"
import { DocumentStatus } from "#/shared/types/warehouse"
import {
  listMixDesigns,
  createMixDesign,
  listProductionBatches,
  createProductionBatch,
  listMaterialConsumptions,
  createMaterialConsumption,
  postMaterialConsumption,
  type CreateMixDesignInput,
  type CreateProductionBatchInput,
  type CreateMaterialConsumptionInput,
} from "../api/production.api"
import { listWarehouses } from "#/features/master-resources/api/master-resources.api"
import { listItems } from "#/features/items/api/items.api"

export function ProductionPage() {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<"mixes" | "batches" | "consumptions">("batches")
  const [page, setPage] = useState(1)

  // Dialog states
  const [isMixOpen, setIsMixOpen] = useState(false)
  const [isBatchOpen, setIsBatchOpen] = useState(false)
  const [isConsumptionOpen, setIsConsumptionOpen] = useState(false)

  // Master options
  const { data: warehousesData } = useQuery({
    queryKey: ["warehouses-select"],
    queryFn: async () => listWarehouses({ data: { page: 1, per_page: 100 } }),
  })
  const { data: itemsData } = useQuery({
    queryKey: ["items-select"],
    queryFn: async () => listItems({ data: { page: 1, per_page: 100 } }),
  })
  const { data: mixDesignsData } = useQuery({
    queryKey: ["mixes-select"],
    queryFn: async () => listMixDesigns({ data: { page: 1, per_page: 100 } }),
  })
  const { data: batchesData } = useQuery({
    queryKey: ["batches-select"],
    queryFn: async () => listProductionBatches({ data: { page: 1, per_page: 100 } }),
  })

  const warehouses = warehousesData?.data || []
  const items = itemsData?.data || []
  const mixDesignsList = mixDesignsData?.data || []
  const batchesList = batchesData?.data || []

  // Forms
  const [mixForm, setMixForm] = useState<CreateMixDesignInput>({
    code: "MIX-C30",
    name: "خلطة خرسانة جاهزة C30",
    description: "معيارية 30 ميجاباسكال",
    items: [{ itemId: items[0]?.id || 1, quantity: 350 }],
  })

  const [batchForm, setBatchForm] = useState<CreateProductionBatchInput>({
    batchNumber: `BATCH-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    date: new Date().toISOString().split("T")[0],
    mixDesignId: mixDesignsList[0]?.id || 1,
    quantityProduced: 24.5,
    notes: "وجبة إنتاجية صباحية",
  })

  const [consumptionForm, setConsumptionForm] = useState<CreateMaterialConsumptionInput>({
    batchId: batchesList[0]?.id || 1,
    mixDesignId: mixDesignsList[0]?.id || 1,
    date: new Date().toISOString().split("T")[0],
    warehouseId: warehouses[0]?.id || 1,
    items: [{ itemId: items[0]?.id || 1, actualQty: 355.0, theoreticalQty: 350.0 }],
  })

  // Queries
  const { data: mixDesigns, isLoading: isMixLoading } = useQuery({
    queryKey: ["mix-designs", page],
    queryFn: async () => listMixDesigns({ data: { page, per_page: 15 } }),
    enabled: activeTab === "mixes",
  })

  const { data: batches, isLoading: isBatchLoading } = useQuery({
    queryKey: ["production-batches", page],
    queryFn: async () => listProductionBatches({ data: { page, per_page: 15 } }),
    enabled: activeTab === "batches",
  })

  const { data: consumptions, isLoading: isConsumptionLoading } = useQuery({
    queryKey: ["material-consumptions", page],
    queryFn: async () => listMaterialConsumptions({ data: { page, per_page: 15 } }),
    enabled: activeTab === "consumptions",
  })

  // Mutations
  const createMixMutation = useMutation({
    mutationFn: async (data: CreateMixDesignInput) => createMixDesign({ data }),
    onSuccess: (res: any) => {
      toast.success(res?.message || "تم حفظ الخلطة التصميمية الجديدة بنجاح")
      queryClient.invalidateQueries({ queryKey: ["mix-designs"] })
      setIsMixOpen(false)
    },
    onError: (err: any) => {
      toast.error(err?.message || "حدث خطأ أثناء حفظ الخلطة التصميمية")
    },
  })

  const createBatchMutation = useMutation({
    mutationFn: async (data: CreateProductionBatchInput) => createProductionBatch({ data }),
    onSuccess: (res: any) => {
      toast.success(res?.message || "تم تسجيل الوجبة الإنتاجية بنجاح")
      queryClient.invalidateQueries({ queryKey: ["production-batches"] })
      setIsBatchOpen(false)
    },
    onError: (err: any) => {
      toast.error(err?.message || "حدث خطأ أثناء تسجيل الوجبة الإنتاجية")
    },
  })

  const createConsumptionMutation = useMutation({
    mutationFn: async (data: CreateMaterialConsumptionInput) => createMaterialConsumption({ data }),
    onSuccess: (res: any) => {
      toast.success(res?.message || "تم حفظ مسودة استهلاك المواد بنجاح")
      queryClient.invalidateQueries({ queryKey: ["material-consumptions"] })
      setIsConsumptionOpen(false)
    },
    onError: (err: any) => {
      toast.error(err?.message || "حدث خطأ أثناء تسجيل استهلاك المواد")
    },
  })

  const postConsumptionMutation = useMutation({
    mutationFn: async (id: number) => postMaterialConsumption({ data: { id } }),
    onSuccess: (res: any) => {
      toast.success(res?.message || "تم ترحيل استهلاك المواد (CONSUMPTION OUT) وتعديل أرصدة دفتر المخزون بنجاح")
      queryClient.invalidateQueries({ queryKey: ["material-consumptions"] })
    },
    onError: (err: any) => {
      toast.error(err?.message || "حدث خطأ أثناء ترحيل استهلاك المواد")
    },
  })

  const getStatusBadge = (status: DocumentStatus) => {
    switch (status) {
      case DocumentStatus.DRAFT:
        return <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-amber-100 text-amber-800">مسودة (DRAFT)</span>
      case DocumentStatus.POSTED:
        return <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 font-bold">مرحّل مخزنياً (POSTED)</span>
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
            <Factory className="size-6 text-amber-600" />
            الإنتاج واستهلاك المواد (Production & Consumptions)
          </h1>
          <p className="text-sm text-slate-500 mt-1">إدارة خلطات الخرسانة (Mix Designs)، تسجيل الوجبات الإنتاجية، وترحيل استهلاك المواد الخرسانية (CONSUMPTION OUT)</p>
        </div>
        <div className="flex items-center gap-2">
          {activeTab === "mixes" && (
            <Button onClick={() => setIsMixOpen(true)} className="gap-2 bg-amber-600 hover:bg-amber-700">
              <FlaskConical className="size-4" /> خلطة تصميمية جديدة
            </Button>
          )}
          {activeTab === "batches" && (
            <Button onClick={() => setIsBatchOpen(true)} className="gap-2 bg-blue-600 hover:bg-blue-700">
              <Boxes className="size-4" /> تسجيل وجبة إنتاجية
            </Button>
          )}
          {activeTab === "consumptions" && (
            <Button onClick={() => setIsConsumptionOpen(true)} className="gap-2 bg-rose-600 hover:bg-rose-700">
              <Flame className="size-4" /> تسجيل استهلاك مواد
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-4">
        <button
          onClick={() => setActiveTab("batches")}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === "batches" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}
        >
          الوجبات الإنتاجية (Production Batches)
        </button>
        <button
          onClick={() => setActiveTab("consumptions")}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === "consumptions" ? "border-rose-600 text-rose-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}
        >
          سجلات استهلاك المواد (Material Consumptions)
        </button>
        <button
          onClick={() => setActiveTab("mixes")}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === "mixes" ? "border-amber-600 text-amber-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}
        >
          الخلطات التصميمية (Mix Designs)
        </button>
      </div>

      {/* Tab 1: Production Batches */}
      {activeTab === "batches" && (
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="text-right font-bold">رقم الوجبة</TableHead>
                <TableHead className="text-right font-bold">التاريخ</TableHead>
                <TableHead className="text-right font-bold">الخلطة التصميمية</TableHead>
                <TableHead className="text-right font-bold">الكمية المنتجة (م³)</TableHead>
                <TableHead className="text-right font-bold">ملاحظات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isBatchLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                    جاري التحميل...
                  </TableCell>
                </TableRow>
              ) : batches?.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                    لا توجد وجبات إنتاجية مسجلة
                  </TableCell>
                </TableRow>
              ) : (
                batches?.data.map((batch) => {
                  const mixName = mixDesignsList.find((m) => m.id === batch.mixDesignId)?.name || batch.mixDesignName || `#${batch.mixDesignId}`
                  return (
                    <TableRow key={batch.id} className="hover:bg-slate-50">
                      <TableCell className="font-mono font-bold text-blue-700">{batch.batchNumber}</TableCell>
                      <TableCell className="text-slate-600">{batch.date}</TableCell>
                      <TableCell className="font-medium">{mixName}</TableCell>
                      <TableCell className="font-bold text-emerald-700">{batch.quantityProduced} م³</TableCell>
                      <TableCell className="text-xs text-slate-500">{batch.notes || "-"}</TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Tab 2: Material Consumptions */}
      {activeTab === "consumptions" && (
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="text-right font-bold">معرف الاستهلاك</TableHead>
                <TableHead className="text-right font-bold">التاريخ والمستودع</TableHead>
                <TableHead className="text-right font-bold">الوجبة والخلطة</TableHead>
                <TableHead className="text-right font-bold">الحالة</TableHead>
                <TableHead className="text-center font-bold">الإجراءات والترحيل</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isConsumptionLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                    جاري التحميل...
                  </TableCell>
                </TableRow>
              ) : consumptions?.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                    لا توجد سجلات استهلاك مواد
                  </TableCell>
                </TableRow>
              ) : (
                consumptions?.data.map((cons) => {
                  const whName = warehouses.find((w) => w.id === cons.warehouseId)?.name || `#${cons.warehouseId}`
                  const batchNo = cons.batchId ? batchesList.find((b) => b.id === cons.batchId)?.batchNumber || `#${cons.batchId}` : "-"
                  const mixName = cons.mixDesignId ? mixDesignsList.find((m) => m.id === cons.mixDesignId)?.name || `#${cons.mixDesignId}` : "-"
                  return (
                    <TableRow key={cons.id} className="hover:bg-slate-50">
                      <TableCell className="font-mono font-semibold">#{cons.id}</TableCell>
                      <TableCell className="text-xs">
                        <div className="font-medium text-slate-900">{cons.date}</div>
                        <div className="text-slate-500">مستودع: {whName}</div>
                      </TableCell>
                      <TableCell className="text-xs">
                        <div>وجبة: {batchNo}</div>
                        <div>خلطة: {mixName}</div>
                      </TableCell>
                      <TableCell>{getStatusBadge(cons.status)}</TableCell>
                      <TableCell className="text-center">
                        {cons.status === DocumentStatus.DRAFT && (
                          <Button size="sm" className="bg-rose-600 hover:bg-rose-700 text-white" onClick={() => postConsumptionMutation.mutate(cons.id)} disabled={postConsumptionMutation.isPending}>
                            <CheckCircle2 className="size-4 ml-1" /> ترحيل الاستهلاك (CONSUMPTION OUT)
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Tab 3: Mix Designs */}
      {activeTab === "mixes" && (
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="text-right font-bold">الرمز (Code)</TableHead>
                <TableHead className="text-right font-bold">الاسم (Name)</TableHead>
                <TableHead className="text-right font-bold">الوصف</TableHead>
                <TableHead className="text-right font-bold">عدد المواد بالصيغة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isMixLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-slate-500">
                    جاري التحميل...
                  </TableCell>
                </TableRow>
              ) : mixDesigns?.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-slate-500">
                    لا توجد خلطات تصميمية مسجلة
                  </TableCell>
                </TableRow>
              ) : (
                mixDesigns?.data.map((mix) => (
                  <TableRow key={mix.id} className="hover:bg-slate-50">
                    <TableCell className="font-mono font-bold text-amber-700">{mix.code}</TableCell>
                    <TableCell className="font-medium text-slate-900">{mix.name}</TableCell>
                    <TableCell className="text-slate-600 text-sm">{mix.description || "-"}</TableCell>
                    <TableCell className="font-semibold">{mix.items?.length || 0} مواد خام</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Mix Design Modal */}
      <Dialog open={isMixOpen} onOpenChange={setIsMixOpen}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle>تعريف خلطة تصميمية جديدة (Mix Design Formula)</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-xs font-semibold text-slate-700">رمز الخلطة (Code)</label>
              <Input value={mixForm.code} onChange={(e) => setMixForm({ ...mixForm, code: e.target.value })} />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700">اسم الخلطة (Name)</label>
              <Input value={mixForm.name} onChange={(e) => setMixForm({ ...mixForm, name: e.target.value })} />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700">وصف الخلطة</label>
              <Input value={mixForm.description || ""} onChange={(e) => setMixForm({ ...mixForm, description: e.target.value })} />
            </div>
            {mixForm.items.map((line, idx) => (
              <div key={idx} className="border rounded p-2 bg-slate-50 space-y-2">
                <div>
                  <label className="text-[10px] text-slate-500">مادة المكون الخرساني</label>
                  <select
                    value={line.itemId}
                    onChange={(e) => {
                      const newItems = [...mixForm.items]
                      newItems[idx].itemId = Number(e.target.value)
                      setMixForm({ ...mixForm, items: newItems })
                    }}
                    className="w-full h-9 rounded border border-input bg-background text-xs px-2"
                  >
                    {items.map((it) => (
                      <option key={it.id} value={it.id}>
                        {it.name} ({it.code})
                      </option>
                    ))}
                    {items.length === 0 && <option value={1}>إسمنت / مادة #1</option>}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-500">الكمية لكل م³</label>
                  <Input
                    type="number"
                    value={line.quantity}
                    onChange={(e) => {
                      const newItems = [...mixForm.items]
                      newItems[idx].quantity = Number(e.target.value)
                      setMixForm({ ...mixForm, items: newItems })
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <DialogFooter className="gap-2 sm:justify-start">
            <Button onClick={() => createMixMutation.mutate(mixForm)} disabled={createMixMutation.isPending}>
              حفظ الخلطة
            </Button>
            <Button variant="outline" onClick={() => setIsMixOpen(false)}>
              إلغاء
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Production Batch Modal */}
      <Dialog open={isBatchOpen} onOpenChange={setIsBatchOpen}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle>تسجيل وجبة إنتاج جديدة (Production Batch)</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-xs font-semibold text-slate-700">رقم الوجبة (Batch Number)</label>
              <Input value={batchForm.batchNumber} onChange={(e) => setBatchForm({ ...batchForm, batchNumber: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700">التاريخ</label>
                <Input type="date" value={batchForm.date} onChange={(e) => setBatchForm({ ...batchForm, date: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700">الخلطة التصميمية</label>
                <select
                  value={batchForm.mixDesignId}
                  onChange={(e) => setBatchForm({ ...batchForm, mixDesignId: Number(e.target.value) })}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                >
                  {mixDesignsList.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.code})
                    </option>
                  ))}
                  {mixDesignsList.length === 0 && <option value={1}>خلطة C30 (#1)</option>}
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700">الكمية المنتجة (م³)</label>
              <Input type="number" value={batchForm.quantityProduced} onChange={(e) => setBatchForm({ ...batchForm, quantityProduced: Number(e.target.value) })} />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:justify-start">
            <Button onClick={() => createBatchMutation.mutate(batchForm)} disabled={createBatchMutation.isPending}>
              تسجيل الوجبة
            </Button>
            <Button variant="outline" onClick={() => setIsBatchOpen(false)}>
              إلغاء
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Material Consumption Modal */}
      <Dialog open={isConsumptionOpen} onOpenChange={setIsConsumptionOpen}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle>تسجيل استهلاك مواد خرسانية</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700">الوجبة الإنتاجية</label>
                <select
                  value={consumptionForm.batchId || ""}
                  onChange={(e) => setConsumptionForm({ ...consumptionForm, batchId: e.target.value ? Number(e.target.value) : undefined })}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                >
                  <option value="">بدون وجبة محددة</option>
                  {batchesList.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.batchNumber}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700">المستودع المصدر</label>
                <select
                  value={consumptionForm.warehouseId}
                  onChange={(e) => setConsumptionForm({ ...consumptionForm, warehouseId: Number(e.target.value) })}
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
            </div>
            {consumptionForm.items.map((line, idx) => (
              <div key={idx} className="border rounded p-2 bg-slate-50 space-y-2">
                <div>
                  <label className="text-[10px] text-slate-500">مادة الخام المستهلكة</label>
                  <select
                    value={line.itemId}
                    onChange={(e) => {
                      const newItems = [...consumptionForm.items]
                      newItems[idx].itemId = Number(e.target.value)
                      setConsumptionForm({ ...consumptionForm, items: newItems })
                    }}
                    className="w-full h-9 rounded border border-input bg-background text-xs px-2"
                  >
                    {items.map((it) => (
                      <option key={it.id} value={it.id}>
                        {it.name} ({it.code})
                      </option>
                    ))}
                    {items.length === 0 && <option value={1}>مادة خام #1</option>}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-500">الكمية الفعلية المستهلكة</label>
                    <Input
                      type="number"
                      value={line.actualQty}
                      onChange={(e) => {
                        const newItems = [...consumptionForm.items]
                        newItems[idx].actualQty = Number(e.target.value)
                        setConsumptionForm({ ...consumptionForm, items: newItems })
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500">الكمية النظرية حسب الخلطة</label>
                    <Input
                      type="number"
                      value={line.theoreticalQty}
                      onChange={(e) => {
                        const newItems = [...consumptionForm.items]
                        newItems[idx].theoreticalQty = Number(e.target.value)
                        setConsumptionForm({ ...consumptionForm, items: newItems })
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <DialogFooter className="gap-2 sm:justify-start">
            <Button onClick={() => createConsumptionMutation.mutate(consumptionForm)} disabled={createConsumptionMutation.isPending}>
              حفظ مسودة الاستهلاك
            </Button>
            <Button variant="outline" onClick={() => setIsConsumptionOpen(false)}>
              إلغاء
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
