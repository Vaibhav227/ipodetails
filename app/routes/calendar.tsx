import type { Route } from './+types/calendar'

export function meta({}: Route.MetaArgs) {
  return [{ title: 'IPO Calendar' }, { name: 'description', content: 'Welcome to IPO Calendar!' }]
}

export default function Calendar() {
  return <div>Calendar</div>
}
