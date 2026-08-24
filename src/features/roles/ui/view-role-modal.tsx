import { Shield } from "lucide-react"
import { Button } from "#/shared/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "#/shared/components/ui/dialog"
import type { Role } from "../model/types"

type ViewRoleModalProps = {
  role: Role | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ViewRoleModal({ role, open, onOpenChange }: ViewRoleModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Shield className="size-5 text-primary" />
            <DialogTitle>بيانات الدور: {role?.name}</DialogTitle>
          </div>
          <DialogDescription>عرض تفاصيل ومسؤوليات هذا الدور.</DialogDescription>
        </DialogHeader>

        {role && (
          <div className="grid gap-3 rounded-lg border bg-slate-50 p-4 text-sm">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-semibold text-muted-foreground">معرّف الدور</span>
              <span className="font-mono text-xs font-bold">{role.id}</span>
            </div>

            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-semibold text-muted-foreground">اسم الدور</span>
              <span className="font-medium">{role.name}</span>
            </div>

            <div className="grid gap-1 border-b pb-2">
              <span className="font-semibold text-muted-foreground">الوصف والمسؤوليات</span>
              <p className="rounded bg-white p-2.5 text-xs font-normal text-slate-800 border">{role.description || "لا يوجد وصف مدوّن"}</p>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            إغلاق
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
