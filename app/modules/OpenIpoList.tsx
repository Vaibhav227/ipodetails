import axios from 'axios'
import { useEffect, useState } from 'react'
import { DataTable } from './Datatable'

import { type ColumnDef } from '@tanstack/react-table'
import { formatDate } from '~/lib/format'

import { Badge } from '~/components/ui/badge'
import { useQuery } from '@tanstack/react-query'
import { ArrowUpIcon, Megaphone } from 'lucide-react'
import GMPBanner from './GMPBanner'
import BaseFire from './BaseFire'

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  id: string
  amount: number
  status: 'pending' | 'processing' | 'success' | 'failed'
  email: string
}

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: 'name',
    header: () => <div className='w-[152px]'>Name</div>,
  },
  // {
  //   accessorKey: 'symbol',
  //   header: 'Symbol',
  // },
  {
    accessorKey: 'type',
    header: 'Type',
  },
  {
    accessorKey: 'status',
    // header: 'Status',
    header: () => <div className='w-[130px]'>Status</div>,
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      const mapVariant = {
        'allotment awaited': 'pending',
        live: 'destructive',
        'pre-apply': 'default',
        'allotment out': 'success',
      } as const
      return <Badge variant={mapVariant[status.toLowerCase()]}>{status}</Badge>
    },
  },
  {
    accessorKey: 'offerDate',

    header: () => <div className='w-[90px]'>Offer Date</div>,
  },
  {
    accessorKey: 'lotSize',
    header: 'Lot Size',
  },
  {
    accessorKey: 'gmp',
    header: 'GMP',
    cell: ({ row }) => {
      const status = row.getValue('gmp')

      return status
    },
  },
  {
    accessorKey: 'priceRange',
    header: 'Price Range',
  },
  {
    accessorKey: 'subscription',
    header: 'Subscription',
  },
  // {
  //   accessorKey: "nseInfoUrl",
  //   header: "Link",
  // },
]

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

export function OpenIpoList() {
  const { data, isLoading } = useQuery({
    queryKey: ['live-ipos'],
    queryFn: () => axios.get('https://ipometrics-backend-1.onrender.com/api/ipos/live'),
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
