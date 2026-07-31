export type MoodScores = Record<string, number>

export type MoodNarrative = {
  phrase: string
  count: number
}

export type MarketMeterKey = 'listing_gain_potential' | 'long_term_benefit'

export type MarketMeter = {
  key: MarketMeterKey
  label: string
  score: number
  band: 'low' | 'moderate' | 'strong' | 'very_strong'
  verdict: string
  reason: string
  positiveDrivers: Array<{ key: string; label: string; value: number }>
  riskDrivers: Array<{ key: string; label: string; value: number }>
}

export type MarketMeters = Record<MarketMeterKey, MarketMeter>

export type MoodSnapshot = {
  slug: string
  name: string
  snapshotDate: string
  sourceWindowStartedAt: string | null
  sourceWindowEndedAt: string | null
  totalItems: number
  personality: string
  summary: string
  moodScores: MoodScores
  marketMeters: MarketMeters
  topNarratives: MoodNarrative[]
}

export type LatestMoodResponse = {
  date: string | null
  count: number
  items: MoodSnapshot[]
}

export type MarketMoodResponse = {
  date: string | null
  ipoCount: number
  totalItems: number
  dominantMood: string | null
  averageScores: MoodScores
  averageMeters: Record<MarketMeterKey, number>
  leaders: Record<MarketMeterKey, Array<{ slug: string; name: string; score: number; verdict: string }>>
  topNarratives: MoodNarrative[]
}

export type MoodHistoryResponse = {
  slug: string
  name: string | null
  count: number
  items: MoodSnapshot[]
}

const fallbackBaseUrl = 'http://localhost:4000'

export function moodApiBaseUrl() {
  return (import.meta.env.VITE_IPO_MOOD_API_URL ?? fallbackBaseUrl).replace(/\/$/, '')
}

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${moodApiBaseUrl()}${path}`)

  if (!response.ok) {
    throw new Error(`IPO Mood API failed: ${response.status}`)
  }

  return response.json() as Promise<T>
}

export function getLatestMood() {
  return getJson<LatestMoodResponse>('/api/mood/latest')
}

export function getMarketMood() {
  return getJson<MarketMoodResponse>('/api/mood/market')
}

export function getIpoMood(slug: string) {
  return getJson<MoodSnapshot>(`/api/mood/${slug}`)
}

export function getIpoMoodHistory(slug: string, limit = 30) {
  return getJson<MoodHistoryResponse>(`/api/mood/${slug}/history?limit=${limit}`)
}
