import { Link } from 'react-router'
import { ArrowUpRight, MessagesSquare } from 'lucide-react'
import { Badge } from '~/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import type { MoodSnapshot } from '~/lib/ipoMoodApi'
import { MoodMeters } from './MoodMeters'
import { MoodNarratives } from './MoodNarratives'

type MoodCardProps = {
  snapshot: MoodSnapshot
}

export function MoodCard({ snapshot }: MoodCardProps) {
  return (
    <Card className='rounded-lg'>
      <CardHeader className='space-y-3 pb-4'>
        <div className='flex items-start justify-between gap-4'>
          <div className='min-w-0 space-y-1'>
            <CardTitle className='truncate text-lg'>{snapshot.name}</CardTitle>
            <div className='text-sm text-muted-foreground'>{snapshot.snapshotDate}</div>
          </div>
          <Link
            to={`/ipo-mood/${snapshot.slug}`}
            className='inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border text-muted-foreground hover:text-foreground'
            aria-label={`Open ${snapshot.name} mood detail`}
          >
            <ArrowUpRight className='h-4 w-4' />
          </Link>
        </div>
        <Badge className='w-fit bg-orange-600 text-white hover:bg-orange-600'>
          {snapshot.personality}
        </Badge>
      </CardHeader>
      <CardContent className='space-y-5'>
        <MoodMeters meters={snapshot.marketMeters} compact />
        <p className='line-clamp-3 text-sm leading-6 text-muted-foreground'>{snapshot.summary}</p>
        <MoodNarratives narratives={snapshot.topNarratives} limit={4} />
        <div className='flex items-center gap-2 text-xs text-muted-foreground'>
          <MessagesSquare className='h-3.5 w-3.5' />
          {snapshot.totalItems} text items analyzed
        </div>
      </CardContent>
    </Card>
  )
}
