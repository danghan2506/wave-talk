"use client"

import { MemberRole } from "@/generated/prisma/enums"
import { ServerMemberProps } from "@/types/types"
import { ShieldUser, User, UserStar } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import UserAvatar from "./user-avatar"
import { cn } from "@/lib/utils"

const ServerMember = ({member, server} : ServerMemberProps) => {
  const roleIconMap =  {
     [MemberRole.GUEST]: <User className="h-4 w-4 mr-2 text-emerald-500" />,
    [MemberRole.MODERATOR]: (
      <UserStar className="h-4 w-4 ml-2 text-emerald-500" />
    ),
    [MemberRole.ADMIN]: (
      <ShieldUser className="h-4 w-4 ml-2 text-rose-500" />
    ),
  }
  const params = useParams()
  const router = useRouter()
  const icon = roleIconMap[member.role]
  const onClick = () => {
    router.push(`/servers/${server.id}/conversations/${member.id}`)
  }
  return (
    <button onClick={onClick} className={cn("group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-stone-700/10 dark:hover:bg-stone-700/50 transition mb-1", params?.memberId === member.id && "bg-stone-700/20 dark:bg-stone-700")}>
      <UserAvatar src={member.profile.imageUrl} className="h-8 w-8 md:h-8 md:w-8"/>
      <p className={cn("font-semibold text-sm text-stone-500 group-hover:text-stone-600 dark:text-stone-400 dark:group-hover:text-stone-300 transition", params?.memberID === member.id && "text-primary dark:text-stone-200 dark:group-hover:text-white" )}>
        {member.profile.name}
      </p>
      {icon}
    </button>
  )
}

export default ServerMember