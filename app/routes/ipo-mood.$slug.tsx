import { Link, useParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import type { Route } from './+types/ipo-mood.$slug'
import { ArrowLeft } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { getIpoMood, getIpoMoodHistory } from '~/lib/ipoMoodApi'
import { MoodMeters } from '~/modules/ipo-mood/MoodMeters'
import { MoodNarratives } from '~/modules/ipo-mood/MoodNarratives'
import { MoodScoreBars } from '~/modules/ipo-mood/MoodScoreBars'
import { MoodTimeline } from '~/modules/ipo-mood/MoodTimeline'

export function meta({ params }: Route.MetaArgs) {
  return [
    { title: `${params.slug ?? 'IPO'} Mood | IPOMetrics` },
    { name: 'description', content: 'IPO mood profile, narratives, and historical mood timeline.' },
  ]
}

export default function IpoMoodDetail() {
  const { slug } = useParams()
  const safeSlug = slug ?? ''
  const moodQuery = useQuery({
    queryKey: ['ipo-mood-detail', safeSlug],
    queryFn: () => getIpoMood(safeSlug),
    enabled: Boolean(safeSlug),
  })
  const historyQuery = useQuery({
    queryKey: ['ipo-mood-history', safeSlug],
    queryFn: () => getIpoMoodHistory(safeSlug, 30),
    enabled: Boolean(safeSlug),
  })

  return (
    <main className='mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 md:p-8'>
      <Link to='/ipo-mood' className='inline-flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground'>
        <ArrowLeft className='h-4 w-4' />
        IPO Mood
      </Link>

      {moodQuery.isLoading && (
        <Card className='rounded-lg'>
          <CardContent className='p-6 text-sm text-muted-foreground'>Loading IPO mood...</CardContent>
        </Card>
      )}

      {moodQuery.isError && (
        <Card className='rounded-lg border-destructive'>
          <CardContent className='p-6 text-sm text-destructive'>
            Could not load mood profile for this IPO.
          </CardContent>
        </Card>
      )}

      {moodQuery.data && (
        <>
          <div className='space-y-3'>
            <div className='flex flex-wrap items-center gap-3'>
              <h1 className='text-2xl font-semibold tracking-tight md:text-3xl'>
                {moodQuery.data.name}
              </h1>
              <Badge className='bg-orange-600 text-white hover:bg-orange-600'>
                {moodQuery.data.personality}
              </Badge>
            </div>
            <p className='max-w-3xl text-sm leading-6 text-muted-foreground'>
              {moodQuery.data.summary}
            </p>
          </div>

          <Card className='rounded-lg'>
            <CardHeader>
              <CardTitle className='text-lg'>Decision Meters</CardTitle>
            </CardHeader>
            <CardContent>
              <MoodMeters meters={moodQuery.data.marketMeters} />
            </CardContent>
          </Card>

          <div className='grid gap-4 lg:grid-cols-[1.2fr_0.8fr]'>
            <Card className='rounded-lg'>
              <CardHeader>
                <CardTitle className='text-lg'>Mood Scores</CardTitle>
              </CardHeader>
              <CardContent>
                <MoodScoreBars scores={moodQuery.data.moodScores} limit={8} />
              </CardContent>
            </Card>
            <Card className='rounded-lg'>
              <CardHeader>
                <CardTitle className='text-lg'>Top Narratives</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <MoodNarratives narratives={moodQuery.data.topNarratives} limit={8} />
                <div className='grid grid-cols-2 gap-3 text-sm'>
                  <div className='rounded-md bg-muted p-3'>
                    <div className='text-muted-foreground'>Text Items</div>
                    <div className='text-lg font-semibold tabular-nums'>{moodQuery.data.totalItems}</div>
                  </div>
                  <div className='rounded-md bg-muted p-3'>
                    <div className='text-muted-foreground'>Snapshot</div>
                    <div className='text-lg font-semibold'>{moodQuery.data.snapshotDate}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      <Card className='rounded-lg'>
        <CardHeader>
          <CardTitle className='text-lg'>Mood Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <MoodTimeline history={historyQuery.data?.items ?? []} />
        </CardContent>
      </Card>
    </main>
  )
}
