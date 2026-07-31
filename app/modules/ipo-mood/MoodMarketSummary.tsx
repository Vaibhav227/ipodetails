import { Link } from 'react-router'
import { Activity, BarChart3, MessageSquareText } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import type { MarketMeterKey, MarketMoodResponse } from '~/lib/ipoMoodApi'
import { MoodNarratives } from './MoodNarratives'

type MoodMarketSummaryProps = {
  market: MarketMoodResponse
}

const leaderTitle: Record<MarketMeterKey, string> = {
  listing_gain_potential: 'Listing Gain Leaders',
  long_term_benefit: 'Long Term Leaders',
}

const leaderTone: Record<MarketMeterKey, string> = {
  listing_gain_potential: 'text-orange-500',
  long_term_benefit: 'text-emerald-500',
}

function LeaderBoard({ market, type }: { market: MarketMoodResponse; type: MarketMeterKey }) {
  const leaders = market.leaders?.[type] ?? []
  const average = market.averageMeters?.[type] ?? 0

  return (
    <Card className='rounded-lg'>
      <CardHeader className='pb-3'>
        <CardTitle className='flex items-center justify-between gap-3 text-base'>
          <span className='flex items-center gap-2'>
            <BarChart3 className={`h-4 w-4 ${leaderTone[type]}`} />
            {leaderTitle[type]}
          </span>
          <span className='text-sm font-medium tabular-nums text-muted-foreground'>Avg {average}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-3'>
        {leaders.length === 0 && <div className='text-sm text-muted-foreground'>No leaders yet.</div>}
        {leaders.slice(0, 3).map((leader, index) => (
          <Link
            key={leader.slug}
            to={`/ipo-mood/${leader.slug}`}
            className='grid grid-cols-[1.5rem_1fr_auto] items-center gap-3 rounded-md border p-3 transition-colors hover:bg-muted/50'
          >
            <div className='text-sm font-medium text-muted-foreground'>{index + 1}</div>
            <div className='min-w-0'>
              <div className='truncate text-sm font-medium'>{leader.name}</div>
              <div className='truncate text-xs text-muted-foreground'>{leader.verdict}</div>
            </div>
            <div className='text-lg font-semibold tabular-nums'>{leader.score}</div>
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}

export function MoodMarketSummary({ market }: MoodMarketSummaryProps) {
  return (
    <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
      <Card className='rounded-lg'>
        <CardHeader className='pb-3'>
          <CardTitle className='flex items-center gap-2 text-base'>
            <Activity className='h-4 w-4 text-orange-500' />
            Market Mood
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-2'>
          <div className='text-xl font-semibold leading-7'>{market.dominantMood ?? 'No mood yet'}</div>
          <div className='text-sm text-muted-foreground'>Latest snapshot: {market.date ?? 'N/A'}</div>
        </CardContent>
      </Card>
      <Card className='rounded-lg'>
        <CardHeader className='pb-3'>
          <CardTitle className='flex items-center gap-2 text-base'>
            <MessageSquareText className='h-4 w-4 text-orange-500' />
            Coverage
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-2'>
          <div className='text-2xl font-semibold tabular-nums'>{market.totalItems}</div>
          <div className='text-sm text-muted-foreground'>
            Text items across {market.ipoCount} IPOs
          </div>
        </CardContent>
      </Card>
      <LeaderBoard market={market} type='listing_gain_potential' />
      <LeaderBoard market={market} type='long_term_benefit' />
      <Card className='rounded-lg md:col-span-2 xl:col-span-4'>
        <CardHeader className='pb-3'>
          <CardTitle className='text-base'>Market Narratives</CardTitle>
        </CardHeader>
        <CardContent>
          <MoodNarratives narratives={market.topNarratives} limit={10} />
        </CardContent>
      </Card>
    </div>
  )
}
