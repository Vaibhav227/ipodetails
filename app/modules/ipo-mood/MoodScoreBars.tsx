import { cn } from '~/lib/utils'

type MoodScoreBarsProps = {
  scores: Record<string, number>
  limit?: number
}

const labelFor = (key: string) =>
  key
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')

export function sortedScores(scores: Record<string, number>, limit = 5) {
  return Object.entries(scores)
    .filter(([, value]) => value > 0)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
}

export function MoodScoreBars({ scores, limit = 5 }: MoodScoreBarsProps) {
  const rows = sortedScores(scores, limit)

  if (rows.length === 0) {
    return <div className='text-sm text-muted-foreground'>No strong mood signals yet.</div>
  }

  return (
    <div className='space-y-3'>
      {rows.map(([key, value]) => (
        <div key={key} className='space-y-1.5'>
          <div className='flex items-center justify-between gap-3 text-sm'>
            <span className='truncate text-muted-foreground'>{labelFor(key)}</span>
            <span className='font-medium tabular-nums'>{value}</span>
          </div>
          <div className='h-2 rounded-full bg-muted'>
            <div
              className={cn(
                'h-2 rounded-full',
                value >= 50 ? 'bg-orange-500' : value >= 25 ? 'bg-amber-500' : 'bg-slate-500',
              )}
              style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
