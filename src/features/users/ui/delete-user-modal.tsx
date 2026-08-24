import { Button } from "#/shared/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "#/shared/components/ui/dialog"
import { useDeleteUserMutation } from "../hooks/use-users"
import type { User } from "../model/types"

type DeleteUserModalProps = {
  user: User | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteUserModal({ user, open, onOpenChange }: DeleteUserModalProps) {
  const deleteMutation = useDeleteUserMutation()

  const handleDelete = () => {
    if (!user) return
    deleteMutation.mutate(user.id, {
      onSuccess: () => onOpenChange(false),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>تأكيد الحذف</DialogTitle>
          <DialogDescription>هل أنت تأكد من حذف المستخدم "{user?.name}"؟</DialogDescription>
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
