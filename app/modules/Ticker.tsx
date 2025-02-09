import axios from 'axios'
import { useQuery } from '@tanstack/react-query'

export const ArrowUpIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='currentColor'
      className='icon icon-tabler icons-tabler-filled icon-tabler-caret-up'
      {...props}
    >
      <path stroke='none' d='M0 0h24v24H0z' fill='none' />
      <path d='M11.293 7.293a1 1 0 0 1 1.32 -.083l.094 .083l6 6l.083 .094l.054 .077l.054 .096l.017 .036l.027 .067l.032 .108l.01 .053l.01 .06l.004 .057l.002 .059l-.002 .059l-.005 .058l-.009 .06l-.01 .052l-.032 .108l-.027 .067l-.07 .132l-.065 .09l-.073 .081l-.094 .083l-.077 .054l-.096 .054l-.036 .017l-.067 .027l-.108 .032l-.053 .01l-.06 .01l-.057 .004l-.059 .002h-12c-.852 0 -1.297 -.986 -.783 -1.623l.076 -.084l6 -6z' />
    </svg>
  )
}

export const ArrowDownIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='currentColor'
      className='icon icon-tabler icons-tabler-filled icon-tabler-caret-down'
      {...props}
    >
      <path stroke='none' d='M0 0h24v24H0z' fill='none' />
      <path d='M18 9c.852 0 1.297 .986 .783 1.623l-.076 .084l-6 6a1 1 0 0 1 -1.32 .083l-.094 -.083l-6 -6l-.083 -.094l-.054 -.077l-.054 -.096l-.017 -.036l-.027 -.067l-.032 -.108l-.01 -.053l-.01 -.06l-.004 -.057v-.118l.005 -.058l.009 -.06l.01 -.052l.032 -.108l.027 -.067l.07 -.132l.065 -.09l.073 -.081l.094 -.083l.077 -.054l.096 -.054l.036 -.017l.067 -.027l.108 -.032l.053 -.01l.06 -.01l.057 -.004l12.059 -.002z' />
    </svg>
  )
}

function isPositivePercentage(percentString) {
  // Remove % symbol and convert to float
  const value = parseFloat(percentString.replace('%', ''))

  // Check if it's a valid number and greater than 0
  return !isNaN(value) && value > 0
}

export const Ticker = () => {
  const { data: ipoData } = useQuery({
    queryKey: ['open-ipos'],
    queryFn: () => axios.get('https://ipometrics-backend-2.onrender.com/api/ipos'),
  })

  return (
    <div className='border-b z-500 overflow-hidden whitespace-nowrap bg-inherit'>
      <div className='flex animate-ticker h-10 items-center bg-inherit z-500'>
        {/* Create duplicated array for continuous loop */}
        {ipoData?.data?.map(
          (ipo, index) =>
            ipo?.premiumPercent && (
              <span key={ipo.id} className='flex px-6'>
                {ipo.name}
                {isPositivePercentage(ipo.premiumPercent) ? (
                  <ArrowUpIcon className='h-6 w-6 text-green-500' />
                ) : (
                  <ArrowDownIcon className='h-6 w-6 text-red-500' />
                )}
                <span
                  className={`${
                    isPositivePercentage(ipo.premiumPercent) ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {ipo.premiumPercent}
                </span>
              </span>
            ),
        )}
        {ipoData?.data?.map(
          (ipo, index) =>
            ipo?.premiumPercent && (
              <span key={ipo.id} className='flex px-6'>
                {ipo.name}
                {isPositivePercentage(ipo?.premiumPercent) ? (
                  <ArrowUpIcon className='h-6 w-6 text-green-500' />
                ) : (
                  <ArrowDownIcon className='h-6 w-6 text-red-500' />
                )}
                <span
                  className={`${
                    isPositivePercentage(ipo.premiumPercent) ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {ipo.premiumPercent}
                </span>
              </span>
            ),
        )}
      </div>
    </div>
  )
}
