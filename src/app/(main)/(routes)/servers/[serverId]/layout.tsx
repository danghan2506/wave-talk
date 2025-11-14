import { db } from '@/lib/db'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React from 'react'

const ServerIdLayout = async ({children, params} : {children: React.ReactNode, params: {serverId: string}}) => {
    const profile = await currentUser()
    if(!profile){
        return redirect("/auth/sign-in")
    }
    const server = await db.server.findUnique({
        where: {
            id: params.serverId,
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    })
    if(!server) return redirect("/")
  return (
    <div>{children}</div>
  )
}

export default ServerIdLayout