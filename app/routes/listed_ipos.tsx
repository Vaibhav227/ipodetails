import type { Route } from './+types/listed_ipos'
import { ListedIpoList } from '~/modules/ListedIpoList'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Listed IPOs | Track Performance of Recently Listed Companies' },
    {
      name: 'description',
      content:
        'Explore a comprehensive list of recently listed IPOs. Track their performance, view listing details, and stay updated on the latest stock market entries.',
    },
  ]
}

export default function List() {
  return <ListedIpoList />
}
