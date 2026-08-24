import { Button } from "#/shared/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "#/shared/components/ui/dialog"
import { useDeleteSupplierMutation } from "../hooks/use-suppliers"
import type { Supplier } from "../model/types"

type DeleteSupplierModalProps = {
  supplier: Supplier | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteSupplierModal({ supplier, open, onOpenChange }: DeleteSupplierModalProps) {
  const deleteMutation = useDeleteSupplierMutation()

  const handleDelete = () => {
    if (!supplier) return
    deleteMutation.mutate(supplier.id, {
      onSuccess: () => onOpenChange(false),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>تأكيد الحذف</DialogTitle>
          <DialogDescription>هل أنت تأكد من حذف المورد "{supplier?.name}"؟</DialogDescription>
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
