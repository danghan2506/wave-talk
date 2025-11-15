"use client";
import { Dialog, DialogHeader, DialogContent, DialogTitle, DialogDescription } from "../ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { useState } from "react";
import { ServerWithMembersWithProfile } from "@/types/types";
import { ScrollArea } from "../ui/scroll-area";
import { UserAvatar } from "@clerk/nextjs";
import { Check, Gavel, MoreVertical, Shield, ShieldQuestion, ShieldUser, User, UserStar } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Spinner } from "../ui/spinner";
import { Item,ItemMedia  } from "../ui/item";
import { MemberRole } from "@/generated/prisma/enums";
import qs from "query-string"
import axios from "axios";
import { useRouter } from "next/navigation";
const ManageMembersModal = () => {
  const roleIconMap = {
    "GUEST" : <User className="h-4 w-4 ml-2 text-zinc-500"/>,
    "MODERATOR" : <UserStar className="h-4 w-4 ml-2 text-emerald-500" />,
    "ADMIN" : <ShieldUser className="h-4 w-4 ml-2 text-rose-700"/>
  }
  const router = useRouter()
  const {onOpen, isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "members";
  const { server } = data as {server: ServerWithMembersWithProfile};
  const [loadingId, setLoadingId] = useState("");
  const onKickMember = async(memberId: string) => {
    try {
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`, 
        query: {
          serverId: server?.id
        }
      })
      const response = await axios.delete(url)
      onOpen("members", {server: response.data})
      router.refresh()
    } catch (error) {
      console.error(error)
    }
    finally{
      setLoadingId("")
    }
  }
  const onRoleChange = async (memberId: string, role: MemberRole) => {
    try {
      setLoadingId(memberId)
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?.id
        }
      })
      const response = await axios.patch(url, {role})
      onOpen("members", {server: response.data})
      router.refresh()
    } catch (error) {
      console.error(error)
    }finally{
      setLoadingId("")
    }
  }
  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black overvlow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Manage members
          </DialogTitle>
            <DialogDescription className="text-center text-zinc-500">
            {server?.members?.length} members
        </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-8 max-h-[420px] pr-6">
            {server?.members?.map((member) => 
            <div key={member.id} className="flex items-center gap-x-2 mb-6">
                <UserAvatar/>
                <div className="flex flex-col gap-y-1">
                    <div className="text-xs font-semibold flex items-center gap-x-2">
                        {member.profile.name}
                        {roleIconMap[member.role]}
                    </div>
                    <p className="text-xs text-neutral-400">
                        {member.profile.email}
                    </p>
                </div>
                {server.profileId !== member.profileId && loadingId !==member.id && (
                    <div className="ml-auto">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <MoreVertical className="h- w-4 text-zinc-500"/>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger className="flex items-center">
                              <ShieldQuestion className="w-4 h-4 mr-2"/>
                              <span>Role</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                <DropdownMenuItem onClick={() => onRoleChange(member.id, "GUEST")}>
                                  <Shield className="h-4 w-4 mr-2"/>
                                  Guest
                                  {member.role === "GUEST" && (
                                    <Check className="h-4 w-4 ml-auto"/>
                                  )}
                                </DropdownMenuItem>
                                 <DropdownMenuItem onClick={() => onRoleChange(member.id, "MODERATOR")}>
                                  <UserStar className="h-4 w-4 mr-2"/>
                                  Moderator
                                  {member.role === "MODERATOR" && (
                                    <Check className="h-4 w-4 ml-auto"/>
                                  )}
                                </DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                          <DropdownMenuSeparator/>
                          <DropdownMenuItem onClick={() => onKickMember(member?.id)}>
                            <Gavel className="h-4 w-4 mr-2"/>
                            Kick 
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                )}
                {loadingId === member.id && (
                  <Item variant="default" className="ml-auto w-4 h-4">
                      <ItemMedia>
                        <Spinner/>
                      </ItemMedia>
                  </Item>
                )}
            </div>

            )}
        </ScrollArea>
        </DialogContent>
    </Dialog>
  );
};

export default ManageMembersModal;
