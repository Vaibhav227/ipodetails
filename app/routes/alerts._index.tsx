export function meta({}: Route.MetaArgs) {
  return [{ title: 'Alerts' }, { name: 'description', content: 'Welcome to Alerts!' }]
}

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import userStore from '~/store'
import type { Route } from '../+types/root'
import GMPBanner from '~/modules/GMPBanner'
import BaseFire from '~/modules/BaseFire'
import { DataTable } from '~/modules/Datatable'
import type { ColumnDef } from '@tanstack/react-table'
import type { Payment } from '~/modules/ClosedIpoList'
import { useNavigate } from 'react-router'
import { Badge } from '@/components/ui/badge'

export default function GetAllAlerts() {
  const {
    data: alertsData,
    isFetching: alertsLoading,
    refetch,
  } = useQuery({
    queryKey: ['get-all-alerts'],
    queryFn: () => axios.get('/all-alerts'),
    staleTime: 0,
  })

  const { data: iposData, isFetching: iposLoading } = useQuery({
    queryKey: ['all-ipos'],
    queryFn: () => axios.get('/ipos'),
  })

  // Create a mapping of IPO IDs to names
  const ipoNameMap = iposData?.data?.reduce((acc: Record<string, string>, ipo: any) => {
    acc[ipo.id] = ipo.name
    return acc
  }, {})

  // Add delete mutation
  const deleteMutation = useMutation({
    mutationFn: (alertId: string) =>
      axios.delete(`https://ipometrics-backend-2.onrender.com/api/alerts/${alertId}`),
    onSuccess: () => {
      refetch() // Refresh the alerts list after deletion
    },
  })

  const columns = [
    {
      accessorKey: 'ipoId',
      header: 'IPO Name',
      cell: ({ row }) => {
        const ipoId = row.getValue('ipoId')
        return ipoNameMap?.[ipoId] || `IPO ${ipoId}`
      },
    },
    {
      accessorKey: 'customMessage',
      header: 'Custom Subject',
    },
    {
      accessorKey: 'threshold',
      header: 'GMP Threshold',
      // cell: ({ row }) => {
      //   const threshold = row.getValue('threshold')
      //   return `${threshold}%`
      // },
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ row }) => {
        const isActive = row.getValue('isActive') as boolean
        return (
          <Badge variant={isActive ? 'success' : 'destructive'}>
            {isActive ? 'Active' : 'Inactive'}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Created At',
      cell: ({ row }) => {
        const date = row.getValue('createdAt') as string
        return new Date(date).toLocaleString()
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        return (
          <Button
            variant='destructive'
            size='sm'
            onClick={() => deleteMutation.mutate(row.original.id)}
            disabled={deleteMutation.isPending}
          >
            Delete
          </Button>
        )
      },
    },
  ]

  const navigate = useNavigate()

  useEffect(() => {
    if (!alertsLoading) {
      if (alertsData?.data?.length > 0) {
        navigate('/alerts')
      } else {
        navigate('/alerts/new')
      }
    }
  }, [alertsData, alertsLoading, navigate])

  return (
    <main className='flex flex-col items-center justify-center pt-4 pb-4 gap-6 h-full'>
      <div className='flex justify-end w-[95%]'>
        <Button onClick={() => navigate('/alerts/new')}>Add New Alert</Button>
      </div>
      <DataTable
        columns={columns}
        data={alertsData?.data || []}
        isLoading={alertsLoading || iposLoading}
      />

      <BaseFire />
    </main>
  )
}
