export function meta({}: Route.MetaArgs) {
  return [{ title: 'Alerts' }, { name: 'description', content: 'Welcome to Alerts!' }]
}

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useState } from 'react'
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
import { useNavigate } from 'react-router'

const formSchema = z.object({
  customSubject: z.string().optional(),
  gmpThreshold: z.coerce.number().min(10, {
    message: 'GMP Threshold must be at least 10%',
  }),
  ipo: z.coerce.string().min(1, {
    message: 'IPO must be selected',
  }),
})

export default function AddNewAlert() {
  const { user } = userStore()
  const navigate = useNavigate()
  const { data: iposData, isLoading } = useQuery({
    queryKey: ['all-ipos'],
    queryFn: () => axios.get('/ipos'),
  })

  const sendAlert = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) =>
      axios.post('https://ipometrics-backend-2.onrender.com/api/alerts', {
        customMessage: values.customSubject,
        ipoId: parseInt(values.ipo),
        email: user.email,
        threshold: values.gmpThreshold,
      }),
  })

  const filteredIpos = iposData?.data?.filter(
    (ipo: any) =>
      !!ipo.premiumPercent &&
      (ipo.status.toLowerCase() === 'pre-apply' ||
        ipo.status.toLowerCase() === 'allotment awaited' ||
        ipo.status.toLowerCase() === 'live'),
  )

  console.log('filteredIpos', filteredIpos)

  const [currentGmp, setCurrentGmp] = useState<number>(0)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customSubject: 'GMP Alert! Apply Now!',
      ipo: '',
      gmpThreshold: 10,
    },
  })

  console.log('form', form.formState.errors)

  // Update currentGmp when IPO selection changes
  const handleIpoChange = (value: string) => {
    const selectedIpo = filteredIpos?.find((ipo: any) => ipo.id === value)
    setCurrentGmp(selectedIpo.premiumPercent)
    form.setValue('ipo', selectedIpo.id)
  }

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log('values', values)
    sendAlert.mutateAsync(values)
    navigate('/alerts')
    console.log('io', values)
  }

  return (
    <>
      <div className='m-4 py-12 px-36'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <FormField
              control={form.control}
              name='customSubject'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Custom Subject</FormLabel>
                  <FormControl>
                    <Input placeholder='GMP Alert! Apply Now!' {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your custom subject. If not provided, we will send our default one.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='gmpThreshold'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    When GMP becomes greater than (in %) <span className='text-red-500'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    This is your GMP threshold. If GMP becomes greater than this threshold, we will
                    send an alert.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex flex-col gap-2'>
              <FormLabel>Current GMP: {currentGmp}</FormLabel>
              <FormDescription>This is the current GMP of the IPO you selected.</FormDescription>
            </div>
            <FormField
              control={form.control}
              name='ipo'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    IPO <span className='text-red-500'>*</span>
                  </FormLabel>
                  <Select onValueChange={handleIpoChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select an IPO' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoading ? (
                        <SelectItem value='loading'>Loading...</SelectItem>
                      ) : (
                        filteredIpos?.map((ipo: any) => (
                          <SelectItem key={ipo.id} value={ipo.id}>
                            {ipo.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <Button type='submit'>Submit</Button>
          </form>
        </Form>
      </div>
    </>
  )
}
