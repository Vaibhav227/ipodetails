import { OpenIpoList } from '~/modules/OpenIpoList'
import type { Route } from './+types/open_ipos'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Open IPOs | Current & Upcoming Initial Public Offerings' },
    {
      name: 'description',
      content:
        'Stay ahead of the market with our list of open and upcoming IPOs. Get key details like issue price, dates, and subscription status for new public offerings.',
    },
  ]
}

export default function List() {
  return <OpenIpoList />
}
