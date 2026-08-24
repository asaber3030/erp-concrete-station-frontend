import { Button } from "#/shared/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "#/shared/components/ui/dialog"
import { useDeleteUnitMutation } from "../hooks/use-units"
import type { Unit } from "../model/types"

type DeleteUnitModalProps = {
  unit: Unit | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteUnitModal({ unit, open, onOpenChange }: DeleteUnitModalProps) {
  const deleteMutation = useDeleteUnitMutation()

  const handleDelete = () => {
    if (!unit) return
    deleteMutation.mutate(unit.id, {
      onSuccess: () => onOpenChange(false),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>تأكيد الحذف</DialogTitle>
          <DialogDescription>هل أنت تأكد من حذف الوحدة "{unit?.name}"؟</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending} loading={deleteMutation.isPending}>
            حذف
          </Button>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            إلغاء
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
