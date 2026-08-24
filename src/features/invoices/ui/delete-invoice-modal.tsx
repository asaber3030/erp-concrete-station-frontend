import { Button } from "#/shared/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "#/shared/components/ui/dialog"
import { useDeleteInvoiceMutation } from "../hooks/use-invoices"
import type { Invoice } from "../model/types"

type DeleteInvoiceModalProps = {
  invoice: Invoice | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteInvoiceModal({ invoice, open, onOpenChange }: DeleteInvoiceModalProps) {
  const deleteMutation = useDeleteInvoiceMutation()

  const handleDelete = () => {
    if (!invoice) return
    deleteMutation.mutate(invoice.id, {
      onSuccess: () => onOpenChange(false),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>تأكيد الحذف</DialogTitle>
          <DialogDescription>هل أنت تأكد من حذف الفاتورة "{invoice?.invoiceNumber}"؟</DialogDescription>
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
