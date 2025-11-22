
import NavigationSidebar from '@/components/navigation-sidebar'
import React, { Suspense } from 'react'

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='h-full'>
      <div className='hidden md:flex h-full w-[72px] z-30 flex-col fixed inset-y-0'>
        <Suspense fallback={<div className='w-[72px]' />}>
          <NavigationSidebar />
        </Suspense>
      </div>
      <main className='md:pl-[72px] h-full'>{children}</main>
    </div>
  )
}

export default MainLayout