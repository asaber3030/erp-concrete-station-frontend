import { Button } from "#/shared/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "#/shared/components/ui/dialog"
import { useDeleteCategoryMutation } from "../hooks/use-categories"
import type { Category } from "../model/types"

type DeleteCategoryModalProps = {
  category: Category | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteCategoryModal({ category, open, onOpenChange }: DeleteCategoryModalProps) {
  const deleteMutation = useDeleteCategoryMutation()

  const handleDelete = () => {
    if (!category) return
    deleteMutation.mutate(category.id, {
      onSuccess: () => onOpenChange(false),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>تأكيد الحذف</DialogTitle>
          <DialogDescription>هل أنت تأكد من حذف التصنيف "{category?.name}"؟</DialogDescription>
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
