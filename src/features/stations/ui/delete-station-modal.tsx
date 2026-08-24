import { Button } from "#/shared/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "#/shared/components/ui/dialog"
import { useDeleteStationMutation } from "../hooks/use-stations"
import type { Station } from "../model/types"

type DeleteStationModalProps = {
  station: Station | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteStationModal({ station, open, onOpenChange }: DeleteStationModalProps) {
  const deleteMutation = useDeleteStationMutation()

  const handleDelete = () => {
    if (!station) return
    deleteMutation.mutate(station.id, {
      onSuccess: () => onOpenChange(false),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>تأكيد الحذف</DialogTitle>
          <DialogDescription>هل أنت تأكد من حذف المحطة "{station?.name}"؟</DialogDescription>
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
