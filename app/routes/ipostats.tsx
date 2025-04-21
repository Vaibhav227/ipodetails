'use client'
import * as React from 'react'
import { TrendingUp } from 'lucide-react'
import {
  Label,
  Pie,
  PieChart,
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  Line,
  LineChart,
} from 'recharts'
import type { Route } from './+types/ipostats'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

// Define status colors
const statusColors = {
  live: 'hsl(var(--chart-1))',
  upcoming: 'hsl(var(--chart-2))',
  'allotment out': 'hsl(var(--chart-3))',
  listed: 'hsl(var(--chart-4))',
  closed: 'hsl(var(--chart-5))',
  'pre-apply': '#EA580B',
  default: 'hsl(var(--chart-muted))',
}

// Create chart config
const chartConfig = {
  count: {
    label: 'Count',
  },
  live: {
    label: 'Live',
    color: statusColors.live,
  },
  upcoming: {
    label: 'Upcoming',
    color: statusColors.upcoming,
  },
  'allotment out': {
    label: 'Allotment Out',
    color: statusColors['allotment out'],
  },
  listed: {
    label: 'Listed',
    color: statusColors.listed,
  },
  closed: {
    label: 'Closed',
    color: statusColors.closed,
  },
  'pre-apply': {
    label: 'Pre-Apply',
    color: statusColors['pre-apply'],
  },
} satisfies ChartConfig

// Bar chart data and config
const barChartData = [
  { month: 'January', desktop: 28 },
  { month: 'February', desktop: 28 },
  { month: 'March', desktop: 19 },
  { month: 'April', desktop: 20 },
  { month: 'May', desktop: 0 },
  { month: 'June', desktop: 0 },
  { month: 'July', desktop: 0 },
  { month: 'August', desktop: 0 },
  { month: 'September', desktop: 0 },
  { month: 'October', desktop: 0 },
  { month: 'November', desktop: 0 },
]

const barChartConfig = {
  desktop: {
    label: 'No. of IPOs',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig

// Line chart data and config
const lineChartData = [
  { month: '2000', desktop: 397 },
  { month: '2001', desktop: 141 },
  { month: '2002', desktop: 183 },
  { month: '2003', desktop: 148 },
  { month: '2004', desktop: 314 },
  { month: '2005', desktop: 286 },
  { month: '2006', desktop: 220 },
  { month: '2007', desktop: 268 },
  { month: '2008', desktop: 62 },
  { month: '2009', desktop: 79 },
  { month: '2010', desktop: 190 },
  { month: '2011', desktop: 171 },
  { month: '2012', desktop: 157 },
  { month: '2013', desktop: 251 },
  { month: '2014', desktop: 304 },
  { month: '2015', desktop: 206 },
  { month: '2016', desktop: 133 },
  { month: '2017', desktop: 217 },
  { month: '2018', desktop: 255 },
  { month: '2019', desktop: 232 },
  { month: '2020', desktop: 480 },
  { month: '2021', desktop: 1035 },
  { month: '2022', desktop: 181 },
  { month: '2023', desktop: 154 },
  { month: '2024', desktop: 225 },
  { month: '2025', desktop: 95 },
]

const lineChartConfig = {
  desktop: {
    label: 'Number of IPOs',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig

export function meta({}: Route.MetaArgs) {
  return [{ title: 'IPO Stats' }, { name: 'description', content: 'IPO Statistics' }]
}

const IpoStats = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['ipos-status'],
    queryFn: () => axios.get('/ipos').then((res) => res.data),
  })

  // Process IPO data for chart
  const { chartData, totalIpos } = React.useMemo(() => {
    if (!data) return { chartData: [], totalIpos: 0 }

    // Group IPOs by status
    const statusCounts: Record<string, number> = {}
    data.forEach((ipo: any) => {
      const status = ipo.status ? ipo.status.toLowerCase() : 'unknown'
      statusCounts[status] = (statusCounts[status] || 0) + 1
    })

    // Format data for chart
    const formattedData = Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
      fill: statusColors[status as keyof typeof statusColors] || statusColors.default,
    }))

    return {
      chartData: formattedData,
      totalIpos: data.length,
    }
  }, [data])

  return (
    <div className='grid gap-4 md:grid-cols-2 m-10'>
      <Card className='flex flex-col justify-start'>
        <CardHeader className='items-center pb-0'>
          <CardTitle>IPO Status Distribution</CardTitle>
          <CardDescription>
            {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </CardDescription>
        </CardHeader>
        <CardContent className='flex-1 pb-0'>
          {isLoading ? (
            <div className='flex justify-center items-center h-[250px]'>Loading...</div>
          ) : (
            <ChartContainer config={chartConfig} className='mx-auto aspect-square max-h-[250px]'>
              <PieChart>
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={chartData}
                  dataKey='count'
                  nameKey='status'
                  innerRadius={60}
                  strokeWidth={5}
                >
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor='middle'
                            dominantBaseline='middle'
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className='fill-foreground text-3xl font-bold'
                            >
                              {totalIpos.toLocaleString()}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className='fill-muted-foreground'
                            >
                              IPOs
                            </tspan>
                          </text>
                        )
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          )}
        </CardContent>
        <CardFooter className='flex-col gap-2 text-sm'>
          <div className='flex items-center gap-2 font-medium leading-none'>
            Current IPO distribution by status <TrendingUp className='h-4 w-4' />
          </div>
          <div className='leading-none text-muted-foreground'>
            Based on all IPOs in the database
          </div>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>IPO Activity by Month</CardTitle>
          <CardDescription>January - December 2025</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={barChartConfig}>
            <BarChart
              accessibilityLayer
              data={barChartData}
              margin={{
                top: 40,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey='month'
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Bar dataKey='desktop' fill='#EA580B' radius={8}>
                <LabelList position='top' offset={12} className='fill-foreground' fontSize={12} />
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className='flex-col items-start gap-2 text-sm'>
          <div className='flex gap-2 font-medium leading-none'>
            Showing total IPO activity for the last 12 months <TrendingUp className='h-4 w-4' />
          </div>
        </CardFooter>
      </Card>

      <Card className='md:col-span-2'>
        <CardHeader>
          <CardTitle>Annual IPOs, 2000-2025</CardTitle>
          <CardDescription>IPO count per year</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={lineChartConfig}>
            <LineChart
              accessibilityLayer
              data={lineChartData}
              margin={{
                top: 20,
                left: 12,
                right: 12,
                bottom: 10,
              }}
              height={220}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey='month'
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator='line' />} />
              <Line
                dataKey='desktop'
                type='natural'
                stroke='#EA580B'
                strokeWidth={2}
                dot={{
                  fill: '#EA580B',
                }}
                activeDot={{
                  r: 6,
                }}
              >
                <LabelList position='top' offset={12} className='fill-foreground' fontSize={12} />
              </Line>
            </LineChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className='flex-col items-start gap-2 text-sm'>
          <div className='flex gap-2 font-medium leading-none'>
            Highest IPO activity in 2021 with 1,035 IPOs <TrendingUp className='h-4 w-4' />
          </div>
          <div className='leading-none text-muted-foreground'>
            Showing annual IPO count from 2000 to 2025
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

export default IpoStats
