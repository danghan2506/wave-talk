"use client";
import { Dialog, DialogHeader, DialogContent, DialogTitle, DialogDescription } from "../ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { useState } from "react";
import { ServerWithMembersWithProfile } from "@/types/types";
import { ScrollArea } from "../ui/scroll-area";
import { UserAvatar } from "@clerk/nextjs";
import { ShieldCheck, ShieldUser, UserStar } from "lucide-react";
const ManageMembersModal = () => {
  const roleIconMap = {
    "GUEST" : null,
    "MODERATOR" : <UserStar className="h-4 w-4 ml-2 text-emerald-500" />,
    "ADMIN" : <ShieldUser className="h-4 w-4 text-rose-700"/>
  }
  const {onOpen, isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "members";
  const { server } = data as {server: ServerWithMembersWithProfile};
  const [isLoading, setIsLoading] = useState(false);
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
            </div>
            )}
        </ScrollArea>
        </DialogContent>
    </Dialog>
  );
};

export default ManageMembersModal;
