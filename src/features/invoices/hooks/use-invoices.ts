import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { createInvoice, deleteInvoice, issueInvoice, listInvoices, updateInvoice } from "../api/invoices-api"
import type { CreateInvoiceInput, Invoice, UpdateInvoiceInput } from "../model/types"
import type { PaginatedResponse, PaginationParams } from "#/shared/api/http"

export const invoicesQueryKey = (params?: PaginationParams) => ["invoices", params] as const

export function useInvoicesQuery(params?: PaginationParams, initialData?: PaginatedResponse<Invoice> | Invoice[]) {
  return useQuery({
    queryKey: invoicesQueryKey(params),
    queryFn: () => listInvoices({ data: params }),
    initialData: Array.isArray(initialData) ? { data: initialData, meta: { total: initialData.length, page: 1, per_page: initialData.length || 15, last_page: 1 } } : initialData,
  })
}

export function useCreateInvoiceMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateInvoiceInput) => createInvoice({ data }),
    onSuccess: () => {
      toast.success("تم إضافة الفاتورة بنجاح")
      queryClient.invalidateQueries({ queryKey: ["invoices"] })
    },
    onError: (err: Error) => {
      toast.error(err.message || "حدث خطأ أثناء إضافة الفاتورة")
    },
  })
}

export function useUpdateInvoiceMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateInvoiceInput) => updateInvoice({ data }),
    onSuccess: () => {
      toast.success("تم تحديث بيانات الفاتورة بنجاح")
      queryClient.invalidateQueries({ queryKey: ["invoices"] })
    },
    onError: (err: Error) => {
      toast.error(err.message || "حدث خطأ أثناء تحديث الفاتورة")
    },
  })
}

export function useDeleteInvoiceMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string | number) => deleteInvoice({ data: { id } }),
    onSuccess: () => {
      toast.success("تم حذف الفاتورة بنجاح")
      queryClient.invalidateQueries({ queryKey: ["invoices"] })
    },
    onError: (err: Error) => {
      toast.error(err.message || "حدث خطأ أثناء حذف الفاتورة")
    },
  })
}

export function useIssueInvoiceMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string | number) => issueInvoice({ data: { id } }),
    onSuccess: () => {
      toast.success("تم إصدار الفاتورة بنجاح")
      queryClient.invalidateQueries({ queryKey: ["invoices"] })
    },
    onError: (err: Error) => {
      toast.error(err.message || "حدث خطأ أثناء إصدار الفاتورة")
    },
  })
}
