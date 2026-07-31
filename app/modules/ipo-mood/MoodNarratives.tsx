import { Badge } from '~/components/ui/badge'
import type { MoodNarrative } from '~/lib/ipoMoodApi'

type MoodNarrativesProps = {
  narratives: MoodNarrative[]
  limit?: number
}

export function MoodNarratives({ narratives, limit = 5 }: MoodNarrativesProps) {
  const visible = narratives.slice(0, limit)

  if (visible.length === 0) {
    return <div className='text-sm text-muted-foreground'>No dominant narratives yet.</div>
  }

  return (
    <div className='flex flex-wrap gap-2'>
      {visible.map((narrative) => (
        <Badge key={narrative.phrase} variant='secondary' className='gap-1'>
          {narrative.phrase}
          <span className='text-muted-foreground'>{narrative.count}</span>
        </Badge>
      ))}
    </div>
  )
}
