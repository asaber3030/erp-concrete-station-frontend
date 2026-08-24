import { Button } from "#/shared/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "#/shared/components/ui/dialog"
import { useState } from "react"
import { useDeleteMaterialMutation } from "../hooks/use-materials"
import type { Material } from "../model/types"

type DeleteMaterialModalProps = {
  material: Material | null
}

export function DeleteMaterialModal({ material }: DeleteMaterialModalProps) {
  const [isOpen, setOpen] = useState(false)

  const deleteMutation = useDeleteMaterialMutation()

  const handleDelete = () => {
    if (!material) return
    deleteMutation.mutate(material.id, {
      onSuccess: () => setOpen(false),
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>تأكيد الحذف</DialogTitle>
          <DialogDescription>هل أنت تأكد من حذف المادة "{material?.name}"؟</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending} loading={deleteMutation.isPending}>
            حذف
          </Button>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            إلغاء
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
