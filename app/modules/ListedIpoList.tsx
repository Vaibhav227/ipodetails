import { Button } from '~/components/ui/button'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { DataTable } from './Datatable'
;('use client')

import { type ColumnDef } from '@tanstack/react-table'

import { columns } from './OpenIpoList'
import { useQuery } from '@tanstack/react-query'

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  id: string
  amount: number
  status: 'pending' | 'processing' | 'success' | 'failed'
  email: string
}

import { ArrowUpIcon } from 'lucide-react'
import GMPBanner from './GMPBanner'
import BaseFire from './BaseFire'

const tranformIpos = (data: any) => {
  return data.map((ipo) => ({
    name: ipo.name,
    symbol: '-', // Add default value if not available
    type: ipo.type,
    status: ipo.status,
    offerDate: ipo.offerDate,
    lotSize: ipo.lotSize,
    gmp: ipo.premiumPercent ? (
      <div className='flex items-center gap-1'>
        <ArrowUpIcon className='h-4 w-4 text-green-500' />
        {`₹${ipo.premiumRange} (${ipo.premiumPercent})`}
      </div>
    ) : (
      'N/A'
    ),
    priceRange: `₹${ipo.offerPrice}`,
    subscription: ipo.subscription,
  }))
}

export function ListedIpoList() {
  const { data, isLoading } = useQuery({
    queryKey: ['listed-ipos'],
    queryFn: () => axios.get('https://ipometrics-backend-1.onrender.com/api/ipos'),
  })

  const ipos = tranformIpos(data?.data ?? [])

  return (
    <main className='flex flex-col items-center justify-center  pt-16 pb-4 gap-6'>
      <GMPBanner />
      <DataTable columns={columns} data={ipos} isLoading={isLoading} />
      <BaseFire />
    </main>
  )
}
