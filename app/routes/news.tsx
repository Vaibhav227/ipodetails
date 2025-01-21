import BaseFire from '~/modules/BaseFire'
import type { Route } from './+types/listed_ipos'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { Skeleton } from '~/components/ui/skeleton'

export function meta({}: Route.MetaArgs) {
  return [{ title: 'News' }, { name: 'description', content: 'Welcome to News!' }]
}

export default function News() {
  const { data, isLoading } = useQuery({
    queryKey: ['news'],
    queryFn: () => axios.get('https://ipometrics-backend-1.onrender.com/api/news'),
  })

  return (
    <main className='flex flex-col items-center justify-center  pt-16 pb-4 gap-6 w-full h-full overflow-y-auto'>
      <div className='w-[90%] h-full flex flex-col gap-6'>
        {isLoading
          ? Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className='flex flex-col gap-4 border rounded-2xl p-8 '>
                <div className='space-y-4'>
                  <Skeleton className='h-6 w-full' />
                  <Skeleton className='h-6 w-[90%]' />
                </div>
              </div>
            ))
          : data?.data.map((item) => (
              <div key={item.id} className='flex flex-col gap-4 border  rounded-2xl p-4 '>
                <h2 className='scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0'>
                  {item.heading}
                </h2>
                <p className='leading-7 [&:not(:first-child)]:mt-1'>{item.description}</p>
                <a href={item.link} target='_blank' className='text-blue-500'>
                  Read More
                </a>
              </div>
            ))}
      </div>

      {/* <BaseFire /> */}
    </main>
  )
}
