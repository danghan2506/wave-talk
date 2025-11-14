import ServerSidebar from '@/components/server-sidebar'
import { fetchCurrentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import React from 'react'

const ServerIdLayout = async ({children, params} : {children: React.ReactNode, params: {serverId: string}}) => {
    const profile = await fetchCurrentProfile()
    const { serverId } = await params
    if(!profile){
        return redirect("/auth/sign-in")
    }
    // server that match with params [serverId] and current user belongs to
    const server = await db.server.findFirst({
        where: {
            id: serverId,
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    })
    if(!server) return redirect("/")
  return (
    <div className='h-full'>
        <div className='hidden md:flex h0full w-60 z-20 flex-col fixed inset-y-0'>
            <ServerSidebar serverId={serverId}/>
        </div>
        <main className='h-full md:pl-60'>
            {children}
        </main>
        </div>
  )
}

export default ServerIdLayout