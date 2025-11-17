"use client"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { ServerSearchProps } from "@/types/types"
import { SearchIcon } from "lucide-react"
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandShortcut } from "./ui/command"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
const ServerSearch = ({data} : ServerSearchProps) => {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const params = useParams()
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if(e.key === "k" && (e.metaKey || e.ctrlKey)){
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])
  const onClick = ({id, type} : {id: string, type: "channel" | "member"}) => {
    setOpen(false)
    if(type === "member") {
      return router.push(`/servers/${params?.serverId}/conversations/${id}`)
    }
    if(type === "channel"){
      return router.push(`/servers/${params?.serverId}/channels/${id}`)
    }
  }
  return (
    <>
       <InputGroup onClick={() => setOpen(true)} className="cursor-pointer">
  <InputGroupInput placeholder="Search..." />
  <InputGroupAddon >
    <InputGroupButton>
<SearchIcon/>
    </InputGroupButton>
    
  </InputGroupAddon>
  <kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1 font-mono text-[10px] font-medium opacity-100 ml-auto select-none">
          <CommandShortcut>⌘K</CommandShortcut>
          {/* <span className="text-xs">⌘</span>J */}
  </kbd>
</InputGroup>
  <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search all channels and members"/>
      <CommandList>
        <CommandEmpty>
          No results found
        </CommandEmpty>
        {data.map(({label, type, data}) => {
          if(!data?.length) return null
          return (
            <CommandGroup key={label} heading={label}>
              {data?.map(({id, icon, name}) => {
                return (
                  <CommandItem key={id} onSelect={() => onClick({id, type})} >
                    {icon}
                    <span>{name}</span>
                  </CommandItem>
                )
              })}
            </CommandGroup>
          )
        })}
      </CommandList>
  </CommandDialog>
    </>
  )
}

export default ServerSearch