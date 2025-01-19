import type { Route } from './+types/listed_ipos'
import { ListedIpoList } from '~/modules/ListedIpoList'

export function meta({}: Route.MetaArgs) {
  return [{ title: "Listed IPO's" }, { name: 'description', content: 'Welcome to Listed IPOs!' }]
}

export default function List() {
  return <ListedIpoList />
}
