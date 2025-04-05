import BaseFire from '~/modules/BaseFire'
import type { Route } from './+types/listed_ipos'
import axios from 'axios'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Skeleton } from '~/components/ui/skeleton'
import { Button } from '~/components/ui/button'
import { useState, useEffect, useRef } from 'react'

export function meta({}: Route.MetaArgs) {
  return [{ title: 'News' }, { name: 'description', content: 'Welcome to News!' }]
}

interface NewsItem {
  id: string
  heading: string
  description: string
  link: string
}

interface SummaryState {
  displayText: string
  isTyping: boolean
  summary: string
  loading: boolean
}

export default function News() {
  const { data, isLoading } = useQuery({
    queryKey: ['news'],
    queryFn: () => axios.get('https://ipometrics-backend-2.onrender.com/api/news'),
  })

  const { mutateAsync: summarize } = useMutation({
    mutationFn: (link: string) =>
      axios.post('https://ipometrics-backend-2.onrender.com/api/summarize-ai', { link }),
  })

  // Track state for each article individually
  const [summaryStates, setSummaryStates] = useState<Record<string, SummaryState>>({})

  // Use a ref to track active typing intervals
  const activeIntervals = useRef<Record<string, NodeJS.Timeout>>({})

  // Set up typewriter effect when a new summary is added
  useEffect(() => {
    // Clean up function to clear all intervals when component unmounts
    return () => {
      Object.values(activeIntervals.current).forEach((interval) => clearInterval(interval))
    }
  }, [])

  // Function to start typewriter effect for a specific article
  const startTypewriterEffect = (id: string, summary: string) => {
    // Clear any existing interval for this ID
    if (activeIntervals.current[id]) {
      clearInterval(activeIntervals.current[id])
    }

    let i = 0
    const typingInterval = setInterval(() => {
      if (i < summary.length) {
        setSummaryStates((prev) => ({
          ...prev,
          [id]: {
            ...prev[id],
            displayText: summary.substring(0, i + 1),
          },
        }))
        i++
      } else {
        clearInterval(typingInterval)
        delete activeIntervals.current[id]
        setSummaryStates((prev) => ({
          ...prev,
          [id]: {
            ...prev[id],
            isTyping: false,
          },
        }))
      }
    }, 20)

    activeIntervals.current[id] = typingInterval
  }

  const handleSummarize = async (item: NewsItem) => {
    // Set loading state for this specific article
    setSummaryStates((prev) => ({
      ...prev,
      [item.id]: {
        ...(prev[item.id] || {}),
        loading: true,
        displayText: '',
        isTyping: false,
        summary: '',
      },
    }))

    try {
      const response = await summarize(item.link)
      const summary = response.data.result.response

      // Update state with the summary
      setSummaryStates((prev) => ({
        ...prev,
        [item.id]: {
          loading: false,
          displayText: '',
          isTyping: true,
          summary,
        },
      }))

      // Start typewriter effect for this article
      startTypewriterEffect(item.id, summary)
    } catch (error) {
      // Handle error
      setSummaryStates((prev) => ({
        ...prev,
        [item.id]: {
          ...prev[item.id],
          loading: false,
        },
      }))
    }
  }

  const hasSummary = (itemId: string) =>
    Boolean(summaryStates[itemId]?.displayText || summaryStates[itemId]?.isTyping)

  return (
    <main className='flex flex-col items-center justify-center pt-4 pb-4 gap-6 w-full h-full overflow-y-auto'>
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
          : data?.data.map((item: NewsItem) => (
              <div key={item.id} className='flex flex-col gap-4 border rounded-2xl p-4 '>
                <h2 className='scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0'>
                  {item.heading}
                </h2>
                <p className='leading-7 [&:not(:first-child)]:mt-1'>{item.description}</p>

                {!hasSummary(item.id) && (
                  <Button
                    onClick={() => handleSummarize(item)}
                    className='bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium py-2 px-4 rounded-lg shadow-md transition-all duration-300 flex items-center gap-2'
                    disabled={summaryStates[item.id]?.loading}
                  >
                    {summaryStates[item.id]?.loading ? (
                      <>
                        <div className='h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin'></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='h-5 w-5'
                          viewBox='0 0 20 20'
                          fill='currentColor'
                        >
                          <path
                            fillRule='evenodd'
                            d='M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z'
                            clipRule='evenodd'
                          />
                        </svg>
                        <span>Get AI Summary of the News Article</span>
                      </>
                    )}
                  </Button>
                )}

                {(summaryStates[item.id]?.displayText || summaryStates[item.id]?.isTyping) && (
                  <div className='bg-gradient-to-r from-orange-50 to-orange-100 border-l-4 border-orange-500 p-4 rounded-lg shadow-sm mt-2'>
                    <div className='flex items-center text-orange-600 text-xs font-semibold mb-2'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-4 w-4 mr-1'
                        viewBox='0 0 20 20'
                        fill='currentColor'
                      >
                        <path
                          fillRule='evenodd'
                          d='M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z'
                          clipRule='evenodd'
                        />
                      </svg>
                      AI SUMMARY
                    </div>
                    <p className='text-gray-700 font-medium' style={{ whiteSpace: 'pre-line' }}>
                      {summaryStates[item.id]?.displayText}
                    </p>
                  </div>
                )}
              </div>
            ))}
      </div>

      <BaseFire />
    </main>
  )
}
