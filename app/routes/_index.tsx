import { redirect } from 'react-router'
import type { Route } from '../+types/root'

export async function loader({}: Route.LoaderArgs) {
  console.log('redirecting to /listed_ipos')
  return redirect('/listed_ipos')
}

export default function Index() {
  return null
}
