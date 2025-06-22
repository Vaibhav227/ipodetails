import type { Route } from './+types/closed_ipos'
import { ClosedIpoList } from '~/modules/ClosedIpoList'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Closed IPOs | Historical IPO Data & Performance' },
    {
      name: 'description',
      content:
        'Access a historical archive of closed IPOs. Analyze past IPO performance, listing prices, and other key data for market research and analysis.',
    },
  ]
}

export default function List() {
  return <ClosedIpoList />
}
