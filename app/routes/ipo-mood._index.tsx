import { useQuery } from '@tanstack/react-query'
import type { Route } from './+types/ipo-mood'
import { Card, CardContent } from '~/components/ui/card'
import { getLatestMood, getMarketMood } from '~/lib/ipoMoodApi'
import { MoodCard } from '~/modules/ipo-mood/MoodCard'
import { MoodMarketSummary } from '~/modules/ipo-mood/MoodMarketSummary'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'IPO Mood | IPOMetrics' },
    {
      name: 'description',
      content: 'Track IPO market psychology, narratives, listing-gain mood, and sentiment signals.',
    },
  ]
}

export default function IpoMoodDashboard() {
  const latestQuery = useQuery({
    queryKey: ['ipo-mood-latest'],
    queryFn: getLatestMood,
  })
  const marketQuery = useQuery({
    queryKey: ['ipo-mood-market'],
    queryFn: getMarketMood,
  })

  const isLoading = latestQuery.isLoading || marketQuery.isLoading
  const isError = latestQuery.isError || marketQuery.isError

  return (
    <main className='mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-8'>
      <div className='space-y-1'>
        <h1 className='text-2xl font-semibold tracking-tight md:text-3xl'>IPO Mood</h1>
        <p className='text-sm text-muted-foreground'>
          Semantic market psychology across active and tracked IPOs.
        </p>
      </div>

      {isLoading && (
        <Card className='rounded-lg'>
          <CardContent className='p-6 text-sm text-muted-foreground'>Loading mood data...</CardContent>
        </Card>
      )}

      {isError && (
        <Card className='rounded-lg border-destructive'>
          <CardContent className='p-6 text-sm text-destructive'>
            Could not load IPO mood data. Check the mood API URL and server status.
          </CardContent>
        </Card>
      )}

      {marketQuery.data && <MoodMarketSummary market={marketQuery.data} />}

      {latestQuery.data && (
        <section className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
          {latestQuery.data.items.map((snapshot) => (
            <MoodCard key={snapshot.slug} snapshot={snapshot} />
          ))}
        </section>
      )}
    </main>
  )
}
