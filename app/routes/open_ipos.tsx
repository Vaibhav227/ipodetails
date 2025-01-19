import { OpenIpoList } from '~/modules/OpenIpoList'
import type { Route } from './+types/open_ipos'

export function meta({}: Route.MetaArgs) {
  return [{ title: "Live IPO's" }, { name: 'description', content: 'Welcome to Live IPOs!' }]
}

export default function List() {
  return <OpenIpoList />
}
