import { fetchCurrentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
interface InviteCodeProps {
    params: Promise<{
      inviteCode: string
    }>
}
const InviteCodePage = async ({params} : InviteCodeProps) => {
  const {inviteCode} = await params
  const profile = await fetchCurrentProfile()
  if(!profile) return redirect("/sign-in")
if(!inviteCode) return redirect("/")
  // handler user already a member of that server
  const existingServer = await db.server.findFirst({
    where: {
      inviteCode: inviteCode,
      members: {
        some: {
          profileId: profile.id
        }
      }
    }
  })
  if(existingServer) return redirect(`/servers/${existingServer.id}`)
  // join the server
  const joinServer = await db.server.update({
    where: {
      inviteCode: inviteCode,
    },
    data: {
      members: {
        create: [
          {
            profileId: profile.id
          }
        ]
      }
    }
  })
  if(joinServer) return redirect(`/servers/${joinServer.id}`)
  return redirect("/")
}

export default InviteCodePage