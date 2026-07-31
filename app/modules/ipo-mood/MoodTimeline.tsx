import type { MoodSnapshot } from '~/lib/ipoMoodApi'
import { sortedScores } from './MoodScoreBars'

type MoodTimelineProps = {
  history: MoodSnapshot[]
}

export function MoodTimeline({ history }: MoodTimelineProps) {
  if (history.length === 0) {
    return <div className='text-sm text-muted-foreground'>No mood history available.</div>
  }

  return (
    <div className='space-y-4'>
      {history.map((snapshot) => (
        <div key={snapshot.snapshotDate} className='grid gap-3 rounded-lg border p-4 md:grid-cols-[140px_1fr]'>
          <div className='text-sm font-medium'>{snapshot.snapshotDate}</div>
          <div className='space-y-2'>
            <div className='font-medium'>{snapshot.personality}</div>
            <div className='text-sm text-muted-foreground'>{snapshot.summary}</div>
            <div className='flex flex-wrap gap-2 text-xs text-muted-foreground'>
              {sortedScores(snapshot.moodScores, 4).map(([key, value]) => (
                <span key={key} className='rounded-md bg-muted px-2 py-1'>
                  {key.replace(/_/g, ' ')}: {value}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
