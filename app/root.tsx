import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router'
import { SpeedInsights } from '@vercel/speed-insights/react'
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { Analytics } from '@vercel/analytics/react'

import type { Route } from './+types/root'
import stylesheet from './app.css?url'
import { ThemeProvider } from './components/ThemeProvider'
import Page from './dashboard/page'
import Authentication from './modules/Authentication'
import userStore from './store'

export const meta = () => {
  return [
    { title: 'Get IPO Details | Latest IPO Information & Analysis' },
    {
      name: 'description',
      content:
        'Your go-to source for the latest IPO details, including dates, prices, and analysis. Stay informed on upcoming, current and closed IPOs.',
    },
    {
      name: 'keywords',
      content:
        'IPO, Initial Public Offering, IPO details, IPO news, stock market, upcoming IPOs, IPO analysis, IPO GMP, grey market premium',
    },
  ]
}

export const links: Route.LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
  { rel: 'stylesheet', href: stylesheet },
]

export function Layout({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient()
  const { user } = userStore()

  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        <Links />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const storageKey = 'vite-ui-theme';
                const theme = localStorage.getItem(storageKey) || 'dark';
                const root = document.documentElement;
                
                root.classList.remove('light', 'dark');
                
                if (theme === 'system') {
                  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
                    ? 'dark'
                    : 'light';
                  root.classList.add(systemTheme);
                } else {
                  root.classList.add(theme);
                }
              })();
            `,
          }}
        />
      </head>
      <body>
        <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
          <QueryClientProvider client={queryClient}>
            {!user.email ? <Authentication /> : <Page children={children} />}
          </QueryClientProvider>
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  const queryClient = new QueryClient()
  const { user } = userStore()

  return (
    <QueryClientProvider client={queryClient}>
      {!user.email ? <Authentication /> : <Outlet />}
    </QueryClientProvider>
  )
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!'
  let details = 'An unexpected error occurred.'
  let stack: string | undefined

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error'
    details =
      error.status === 404 ? 'The requested page could not be found.' : error.statusText || details
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message
    stack = error.stack
  }

  return (
    <main className='pt-16 p-4 container mx-auto'>
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className='w-full p-4 overflow-x-auto'>
          <code>{stack}</code>
        </pre>
      )}
    </main>
  )
}
