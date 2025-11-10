"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"

interface SearchableSelectProps {
  value: string
  onValueChange: (value: string) => void
  options: { value: string; label: string }[]
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function SearchableSelect({
  value,
  onValueChange,
  options,
  placeholder = "Select an option",
  disabled = false,
  className,
}: SearchableSelectProps) {
  const [search, setSearch] = React.useState("")
  const [open, setOpen] = React.useState(false)

  const filteredOptions = React.useMemo(() => {
    if (!search) return options
    return options.filter((option) =>
      option.label.toLowerCase().includes(search.toLowerCase())
    )
  }, [options, search])

  // Custom implementation using radix-ui Select with search
  return (
    <div className={className}>
      <Select
        value={value}
        onValueChange={(newValue) => {
          onValueChange(newValue)
          setSearch("")
          setOpen(false)
        }}
        disabled={disabled}
        open={open}
        onOpenChange={setOpen}
      >
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <div className="flex items-center border-b px-3 pb-2">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 border-0 p-0 focus-visible:ring-0"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="max-h-64 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No results found
              </div>
            ) : (
              filteredOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))
            )}
          </div>
        </SelectContent>
      </Select>
    </div>
  )
}
