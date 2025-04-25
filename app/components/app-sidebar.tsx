import * as React from 'react'
import { ChartNoAxesCombined, GalleryVerticalEnd, Minus, Plus } from 'lucide-react'
import { useLocation } from 'react-router'

import { SearchForm } from '~/components/search-form'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '~/components/ui/collapsible'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from '~/components/ui/sidebar'
import { Badge } from '~/components/ui/badge'

// This is sample data.
export const data = {
  navMain: [
    {
      title: 'IPO Details',
      url: '#',
      items: [
        {
          title: "Open IPO's",
          url: '/open_ipos',
        },

        {
          title: "Listed IPO's",
          url: '/listed_ipos',
        },
      ],
    },
    {
      title: 'IPO News',
      url: '/news',
    },
    {
      title: 'IPO Alerts',
      url: '/alerts',
    },
    {
      title: 'IPO Stats',
      url: '/ipostats',
    },
    // {
    //   title: "Developer API's",
    //   url: '/docs',
    // },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation()

  const isItemActive = (url: string) => location.pathname === url

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size='lg' asChild>
              <a href='#'>
                <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-orange-500 dark:bg-orange-700 text-sidebar-primary-foreground'>
                  <ChartNoAxesCombined className='size-6' />
                </div>
                <div className='flex flex-col gap-0.5 leading-none'>
                  <span className='font-semibold'>IPOMetrics</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        {/* <SearchForm /> */}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((item, index) => (
              <Collapsible key={item.title} defaultOpen={index === 0} className='group/collapsible'>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    {!item.items?.length ? (
                      <SidebarMenuButton asChild isActive={isItemActive(item.url)}>
                        <a href={item.url}>
                          <div className='w-full flex justify-between'>
                            {item.title}
                            {item.url === '/alerts' && <Badge>New</Badge>}
                            {item.url === '' && <Badge>Version 1.0.0</Badge>}
                            {item.url === '/news' && (
                              <Badge
                                className='
                                relative overflow-hidden
                                bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600
                                text-white font-bold shadow-md 
                                border border-orange-400
                                before:absolute before:inset-0 
                                before:bg-gradient-to-r before:from-orange-600 before:via-orange-400 before:to-orange-600
                                before:animate-gradient before:bg-[length:200%_auto] 
                                before:opacity-80 before:blur-[1px] before:-z-10
                                after:absolute after:inset-0 after:rounded-full after:shadow-[0_0_8px_2px_rgba(249,115,22,0.5)]
                                flex items-center gap-1.5 px-2
                                group hover:scale-105 transition-transform duration-300
                              '
                              >
                                <svg
                                  xmlns='http://www.w3.org/2000/svg'
                                  viewBox='0 0 24 24'
                                  fill='none'
                                  stroke='currentColor'
                                  strokeWidth='2'
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                  className='w-3 h-3 animate-pulse group-hover:animate-bounce'
                                >
                                  <rect width='18' height='10' x='3' y='8' rx='2' />
                                  <path d='M12 8v10' />
                                  <path d='M8 12h8' />
                                </svg>
                                AI Summary
                              </Badge>
                            )}
                          </div>
                        </a>
                      </SidebarMenuButton>
                    ) : (
                      <SidebarMenuButton isActive={isItemActive(item.url)}>
                        {item.title}
                        <Plus className='ml-auto group-data-[state=open]/collapsible:hidden' />
                        <Minus className='ml-auto group-data-[state=closed]/collapsible:hidden' />
                      </SidebarMenuButton>
                    )}
                  </CollapsibleTrigger>
                  {item.items?.length ? (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((item) => (
                          <SidebarMenuSubItem key={item.title}>
                            <SidebarMenuSubButton asChild isActive={isItemActive(item.url)}>
                              <a href={item.url}>{item.title}</a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  ) : null}
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
