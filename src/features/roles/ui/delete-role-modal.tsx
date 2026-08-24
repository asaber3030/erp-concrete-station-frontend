import { Button } from "#/shared/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "#/shared/components/ui/dialog"
import { useDeleteRoleMutation } from "../hooks/use-roles"
import type { Role } from "../model/types"

type DeleteRoleModalProps = {
  role: Role | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteRoleModal({ role, open, onOpenChange }: DeleteRoleModalProps) {
  const deleteMutation = useDeleteRoleMutation()

  const handleDelete = () => {
    if (!role) return
    deleteMutation.mutate(role.id, {
      onSuccess: () => onOpenChange(false),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>تأكيد الحذف</DialogTitle>
          <DialogDescription>هل أنت تأكد من حذف الدور "{role?.name}"؟</DialogDescription>
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
