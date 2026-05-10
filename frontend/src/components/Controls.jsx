import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Filter } from 'lucide-react'

export default function Controls({ q = 'Search destinations, activities, trips…', extra }) {
  return (
    <div className="flex items-center gap-2 px-8 py-3 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] shrink-0">
      <div className="relative flex-1 max-w-2xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" size={16} />
        <Input className="pl-10" placeholder={q} />
      </div>
      <Button variant="outline" size="sm"><Filter size={14} /> Filter</Button>
      <Button variant="outline" size="sm">Group by</Button>
      <Button variant="outline" size="sm">Sort</Button>
      {extra}
    </div>
  )
}
