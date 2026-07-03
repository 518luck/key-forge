import { useState } from 'react'
import { ChevronDown, ChevronRight, Copy, Trash2, History as HistoryIcon } from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/shared/ui/collapsible'
import { Button } from '@/shared/ui/button'
import { ScrollArea } from '@/shared/ui/scroll-area'
import { Empty } from '@/shared/ui/empty'
import { cn } from '@/shared/ui/lib/utils'
import type { HistoryItem } from '@/shared/types'
import { t } from '@/shared/i18n/zh'
import { formatRelativeTime } from '@/shared/lib/format'

interface HistoryPanelProps {
  items: HistoryItem[]
  onCopy: (value: string) => void
  onRemove: (id: string) => void
  onClear: () => void
}

export function HistoryPanel({ items, onCopy, onRemove, onClear }: HistoryPanelProps) {
  const [open, setOpen] = useState(false)

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="mt-4">
      <div className="flex items-center justify-between">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-1.5 font-medium">
            {open ? (
              <ChevronDown data-icon="inline-start" />
            ) : (
              <ChevronRight data-icon="inline-start" />
            )}
            <HistoryIcon data-icon="inline-start" />
            {t.history} ({items.length})
          </Button>
        </CollapsibleTrigger>
        {open && items.length > 0 && (
          <Button variant="ghost" size="sm" onClick={onClear}>
            <Trash2 data-icon="inline-start" />
            清空
          </Button>
        )}
      </div>

      <CollapsibleContent>
        <ScrollArea className="mt-2 max-h-48">
          {items.length === 0 ? (
            <Empty title={t.historyEmpty} className="py-6" />
          ) : (
            <ul className="flex flex-col gap-1.5 pr-3">
              {items.map((item) => (
                <li
                  key={item.id}
                  className={cn(
                    'group flex items-center gap-2 rounded-md border border-border bg-card px-2.5 py-2',
                  )}
                >
                  <code className="flex-1 truncate font-mono text-sm">
                    {item.value}
                  </code>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {formatRelativeTime(item.createdAt)}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7 opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={() => onCopy(item.value)}
                  >
                    <Copy />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                    onClick={() => onRemove(item.id)}
                  >
                    <Trash2 />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
      </CollapsibleContent>
    </Collapsible>
  )
}
