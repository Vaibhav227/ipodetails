import axios from 'axios'
import { useEffect, useState } from 'react'
import { DataTable } from './Datatable'

import { type ColumnDef } from '@tanstack/react-table'
import { formatDate } from '~/lib/format'
import { tranformIpos } from '~/api/transformers'
import { Badge } from '~/components/ui/badge'

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
    header: 'Name',
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
    header: 'Status',
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
    header: 'Offer Date',
  },
  {
    accessorKey: 'lotSize',
    header: 'Lot Size',
  },
  {
    accessorKey: 'gmp',
    header: 'GMP',
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

export function OpenIpoList() {
  const [ipos, setIpos] = useState([])

  useEffect(() => {
    const fetchIpos = async () => {
      try {
        const response = await axios.get(
          'https://ipometrics-backend-1.onrender.com/api/ipos/live',
          // {
          //   headers: {
          //     "x-api-key":
          //       "41e6ffd4d8d23044eff55a2a7eaeb458626eeadc013380a98d727949bd4c7cff",
          //   },
          // }
        )

        const tranformedData = tranformIpos(response.data)
        setIpos(tranformedData ?? [])
      } catch (error) {
        console.error('Error fetching IPO data:', error)
      }
    }

    fetchIpos()
  }, [])
  return (
    <main className='flex items-center justify-center  pt-16 pb-4'>
      <DataTable columns={columns} data={ipos} />
    </main>
  )
}
