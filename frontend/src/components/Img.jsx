import { cn } from '@/lib/utils'

export default function Img({ label, ratio = '4 / 3', className = '', style }) {
  return (
    <div
      className={cn('relative overflow-hidden rounded-lg border bg-muted', className)}
      style={{ aspectRatio: ratio, ...style }}
    >
      <div className="absolute inset-0 tl-img-pattern" />
      {label && (
        <div className="absolute bottom-2 left-2 text-[10px] uppercase tracking-wider font-medium bg-background/80 backdrop-blur px-2 py-0.5 rounded text-muted-foreground border">
          {label}
        </div>
      )}
    </div>
  )
}
