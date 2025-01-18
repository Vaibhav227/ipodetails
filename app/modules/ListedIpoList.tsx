import { Button } from '~/components/ui/button'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { DataTable } from './Datatable'
;('use client')

import { type ColumnDef } from '@tanstack/react-table'
import { tranformIpos } from '~/api/transformers'
import { columns } from './OpenIpoList'

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  id: string
  amount: number
  status: 'pending' | 'processing' | 'success' | 'failed'
  email: string
}

export function ListedIpoList() {
  const [ipos, setIpos] = useState([])

  useEffect(() => {
    const fetchIpos = async () => {
      try {
        const response = await axios.get(
          'https://ipometrics-backend-1.onrender.com/api/ipos',
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
