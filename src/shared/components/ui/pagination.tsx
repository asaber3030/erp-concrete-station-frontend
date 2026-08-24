import { ChevronRight, ChevronLeft } from "lucide-react"
import { Button } from "#/shared/components/ui/button"
import type { PaginationMeta } from "#/shared/types"

type PaginationProps = {
  meta?: PaginationMeta
  onPageChange: (page: number) => void
  onPerPageChange?: (perPage: number) => void
  perPageOptions?: number[]
}

export function Pagination({ meta, onPageChange, onPerPageChange, perPageOptions = [10, 15, 25, 50] }: PaginationProps) {
  if (!meta || meta.total === 0) return null

  const { page, per_page, total, last_page } = meta

  const startItem = (page - 1) * per_page + 1
  const endItem = Math.min(page * per_page, total)

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 px-2 py-3">
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span>
          عرض <strong className="font-medium text-foreground">{startItem}</strong> إلى <strong className="font-medium text-foreground">{endItem}</strong> من أصل{" "}
          <strong className="font-medium text-foreground">{total}</strong> عنصر
        </span>

        {onPerPageChange && (
          <div className="flex items-center gap-2">
            <span>لكل صفحة:</span>
            <select
              value={per_page}
              onChange={(e) => onPerPageChange(Number(e.target.value))}
              className="h-8 rounded-md border border-input bg-background px-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-ring"
            >
              {perPageOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1">
        <Button type="button" variant="outline" size="sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)} className="gap-1">
          <ChevronRight className="size-4" />
          السابق
        </Button>

        <div className="flex items-center gap-1 px-2 text-sm font-medium">
          <span>صفحة</span>
          <span className="rounded bg-muted px-2 py-0.5">{page}</span>
          <span>من</span>
          <span>{last_page}</span>
        </div>

        <Button type="button" variant="outline" size="sm" disabled={page >= last_page} onClick={() => onPageChange(page + 1)} className="gap-1">
          التالي
          <ChevronLeft className="size-4" />
        </Button>
      </div>
    </div>
  )
}
