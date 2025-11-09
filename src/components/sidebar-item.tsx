"use client"
import Image from "next/image"
import ActionTooltip from "./action-tooltip"
import { cn } from "@/lib/utils"
import { useParams, useRouter } from "next/navigation"
type SidebarItemProps = {
    id: string
    imageUrl: string
    name: string
}
const SidebarItem = ({id, imageUrl, name} : SidebarItemProps) => {
  const params = useParams()
  const router = useRouter()
  const onClick = () => {
    router.push(`/server/${id}`)
  }
    return (
    <div>
        <ActionTooltip side="right" align="center" label={name}>
            <button onClick={onClick} className="group relative flex items-center">
                <div className={cn("absolute left-0 bg-primary rounded-r-full transition-all w-[4px]", params?.serverId !== id && "group-hover:h-[2px]", params?.serverId === id ? "h-[36px]" : "h-[8px]")}></div>
                <div className={cn("relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden", params?.serverId === id && "bg-primary/10 text-primary rounded-[16px]")}>
                    <Image fill src={imageUrl} alt="Channel"/>
                </div>
            </button>
        </ActionTooltip>
    </div>
  )
}

export default SidebarItem