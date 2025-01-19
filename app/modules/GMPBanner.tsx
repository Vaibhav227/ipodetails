import { Megaphone } from 'lucide-react'

const GMPBanner = () => {
  return (
    <div className='flex gap-4 text-sm text-white-500 border  rounded-3xl py-2 px-6 bg-orange-400 dark:bg-orange-700'>
      <Megaphone />
      <span className='flex items-center '>
        GMP keeps getting updated after few hours. Expected Premium is derived from market rumours.
        Please make your own decision.
      </span>
    </div>
  )
}

export default GMPBanner
