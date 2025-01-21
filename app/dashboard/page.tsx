import { AppSidebar } from '~/components/app-sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '~/components/ui/breadcrumb'
import { ModeToggle } from '~/components/ui/mode-toggle'
import { Separator } from '~/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '~/components/ui/sidebar'
import { useActiveRoute } from '~/hooks/use-active-route'
import { Ticker } from '~/modules/Ticker'

export default function Page({ children }: { children: React.ReactNode }) {
  const activeRoute = useActiveRoute()

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className='flex h-16 shrink-0 items-center gap-2 border-b px-4 sticky top-0 bg-inherit z-50'>
          <SidebarTrigger className='-ml-1' />
          <Separator orientation='vertical' className='mr-2 h-4' />
          <Breadcrumb>
            <BreadcrumbList>
              {activeRoute && (
                <>
                  <BreadcrumbItem className='hidden md:block'>
                    <BreadcrumbLink href={activeRoute.parent.url}>
                      {activeRoute.parent.title}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {activeRoute?.child?.title && (
                    <>
                      <BreadcrumbSeparator className='hidden md:block' />
                      <BreadcrumbItem>
                        <BreadcrumbPage>{activeRoute.child.title}</BreadcrumbPage>
                      </BreadcrumbItem>
                    </>
                  )}
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>
          <div className='ml-auto'>
            <ModeToggle />
          </div>
        </header>
        <Ticker />
        <div className='h-[calc(100dvh-120px)]'>{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
