import BaseFire from '~/modules/BaseFire'
import type { Route } from './+types/docs'
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
import { ExternalLink, Terminal } from 'lucide-react'
import { Button } from '~/components/ui/button'

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Developer API' }, { name: 'docs', content: 'Welcome to Developer API!' }]
}

export default function Docs() {
  return (
    <main className='flex flex-col pb-4 px-4 gap-6 h-full'>
      <h1 className='text-2xl font-bold'>Developer API's are now Live!</h1>
      <Alert>
        <Terminal className='h-4 w-4' />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          You need API Key to use the API. Rate Limits are applied based on your plan.
        </AlertDescription>
      </Alert>

      <div className='rounded-md'>
        <p className='mb-2 text-sm font-medium'>Your API key:</p>
        <div className='flex items-center'>
          <code className='bg-black dark:bg-white text-white dark:text-black p-[10px] rounded font-mono text-sm flex-grow'>
            12345
          </code>
          <Button
            variant='default'
            className='ml-2 '
            onClick={() => {
              navigator.clipboard.writeText('12345')
            }}
          >
            Copy
          </Button>
        </div>
      </div>
      <div className='flex w-full gap-8'>
        <Button
          className='bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 hover:opacity-90 transition-all'
          onClick={() => {}}
        >
          Download Postman Collection
        </Button>
        <Button
          className='bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 hover:opacity-90 transition-all'
          onClick={() => {}}
        >
          Go to API Docs
          <ExternalLink className='w-4 h-4' />
        </Button>
      </div>

      <BaseFire />
    </main>
  )
}
