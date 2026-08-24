import { Search } from "lucide-react"
import { Input } from "#/shared/components/ui/input"
import { useNavigate } from "@tanstack/react-router"
import { useState } from "react"
import { Button } from "../ui/button"

export const SearchBar = () => {
  const navigate = useNavigate()
  const [searchInput, setSearchInput] = useState("")

  const handleSearchSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    updateFilters({ search: searchInput || undefined, page: 1 })
  }

  const updateFilters = (newParams: Record<string, unknown>) => {
    navigate({
      search: (old: any) => {
        const updated = { ...old, ...newParams }
        return Object.fromEntries(Object.entries(updated).filter(([_, v]) => v !== undefined && v !== "" && v !== null))
      },
      replace: true,
    })
  }
  return (
    <div className="relative max-w-sm flex-1">
      <Search className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={searchInput}
        onChange={(e) => {
          const val = e.target.value
          setSearchInput(val)
          if (!val) {
            updateFilters({ search: undefined, page: 1 })
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault()
            handleSearchSubmit()
          }
        }}
        placeholder="بحث عن مادة..."
        className="pr-9"
      />
      <Button type="submit" variant="outline">
        بحث
      </Button> 
    </div>
  )
}
