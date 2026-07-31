import { AlertTriangle, CheckCircle2, Gauge } from 'lucide-react'
import type { MarketMeter, MarketMeters } from '~/lib/ipoMoodApi'
import { cn } from '~/lib/utils'

type MoodMetersProps = {
  meters: MarketMeters
  compact?: boolean
}

type MoodMeterProps = {
  meter: MarketMeter
  compact?: boolean
}

const orderedMeters: Array<keyof MarketMeters> = ['listing_gain_potential', 'long_term_benefit']

const barColor = (meter: MarketMeter) => {
  if (meter.key === 'long_term_benefit') {
    if (meter.score >= 60) return 'bg-emerald-500'
    if (meter.score >= 35) return 'bg-teal-500'
    return 'bg-slate-500'
  }

  if (meter.score >= 60) return 'bg-orange-500'
  if (meter.score >= 35) return 'bg-amber-500'
  return 'bg-slate-500'
}

const bandLabel = (band: MarketMeter['band']) =>
  band
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')

function DriverList({
  icon,
  title,
  drivers,
}: {
  icon: 'positive' | 'risk'
  title: string
  drivers: MarketMeter['positiveDrivers']
}) {
  if (drivers.length === 0) return null

  const Icon = icon === 'positive' ? CheckCircle2 : AlertTriangle

  return (
    <div className='space-y-1.5'>
      <div className='flex items-center gap-1.5 text-xs font-medium text-muted-foreground'>
        <Icon className={cn('h-3.5 w-3.5', icon === 'positive' ? 'text-emerald-500' : 'text-amber-500')} />
        {title}
      </div>
      <div className='flex flex-wrap gap-1.5'>
        {drivers.map((driver) => (
          <span key={driver.key} className='rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground'>
            {driver.label} {driver.value}
          </span>
        ))}
      </div>
    </div>
  )
}

export function MoodMeter({ meter, compact = false }: MoodMeterProps) {
  return (
    <div className='space-y-2'>
      <div className='flex items-start justify-between gap-3'>
        <div className='min-w-0'>
          <div className='flex items-center gap-2 text-sm font-medium'>
            <Gauge className='h-4 w-4 text-muted-foreground' />
            <span className='truncate'>{meter.label}</span>
          </div>
          <div className='mt-1 text-xs text-muted-foreground'>{meter.verdict}</div>
        </div>
        <div className='text-right'>
          <div className='text-xl font-semibold tabular-nums'>{meter.score}</div>
          <div className='text-xs text-muted-foreground'>{bandLabel(meter.band)}</div>
        </div>
      </div>

      <div className='h-2 rounded-full bg-muted'>
        <div
          className={cn('h-2 rounded-full', barColor(meter))}
          style={{ width: `${Math.min(Math.max(meter.score, 0), 100)}%` }}
        />
      </div>

      {!compact && (
        <div className='space-y-3 pt-1'>
          <p className='text-xs leading-5 text-muted-foreground'>{meter.reason}</p>
          <div className='grid gap-3 sm:grid-cols-2'>
            <DriverList icon='positive' title='Positive drivers' drivers={meter.positiveDrivers} />
            <DriverList icon='risk' title='Risk checks' drivers={meter.riskDrivers} />
          </div>
        </div>
      )}
    </div>
  )
}

export function MoodMeters({ meters, compact = false }: MoodMetersProps) {
  return (
    <div className='space-y-4'>
      {orderedMeters.map((key) => (
        <MoodMeter key={key} meter={meters[key]} compact={compact} />
      ))}
    </div>
  )
}
