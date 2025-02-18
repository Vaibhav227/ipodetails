import { Button } from '~/components/ui/button'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { DataTable } from './Datatable'
;('use client')

import { type ColumnDef } from '@tanstack/react-table'

import { columns, tranformIpos } from './OpenIpoList'
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

export function ListedIpoList() {
  const { data, isLoading } = useQuery({
    queryKey: ['listed-ipos'],
    queryFn: () => axios.get('https://ipometrics-backend-2.onrender.com/api/ipos'),
  })

  const ipos = tranformIpos(data?.data ?? [])

  return (
    <main className='flex flex-col items-center justify-center pt-4 pb-4 gap-6 h-full'>
      <GMPBanner />
      <DataTable columns={columns} data={ipos} isLoading={isLoading} />
      <BaseFire />
    </main>
  )
}
