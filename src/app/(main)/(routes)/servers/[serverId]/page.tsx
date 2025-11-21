import { fetchCurrentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"


interface serverIdPageProps {
  params : {
    serverId: string
  }
}


const ServerIdPage =  async ({params} : serverIdPageProps) => {
  const profile = await fetchCurrentProfile()
  const {serverId} = await params
  const redirectToGeneralChannel = await db.server.findUnique({
    where: {
      id: serverId,
      members: {
        some: {
          profileId: profile?.id
        }
      }
    },
    include: {
      channels: {
        where: {
          name: "general"
        },
        orderBy: {
          createdAt: "asc"
        }
      }
    }
  })
  if(!profile) {
    redirect("/sign-in")
  }
  const initialChanel = redirectToGeneralChannel?.channels[0]
  if(initialChanel?.name !== "general") return null
  return redirect(`/servers/${serverId}/channels/${initialChanel?.id}`)
}

export default ServerIdPage