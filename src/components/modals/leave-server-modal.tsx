"use client";
import { Dialog, DialogHeader, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "../ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { useState } from "react";
import axios from "axios";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
const LeaveServerModal = () => {
  const {isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "leaveServer";
  const { server } = data;
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false);
  const handleLeave = async () => {
    try {
        setIsLoading(true)
        await axios.patch(`/api/servers/${server?.id}/leave`)
        onClose()
        router.refresh()
        router.push("/")
    } catch (error) {
        console.error(error)
    }
    finally{
        setIsLoading(false)
    }
  }
  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overvlow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Leave server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">Are you sure want to leave <span className="font-semibold text-emerald-500">{server?.name}</span></DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-zinc-300 px-6 py-4">
            <div className="flex items-center justify-between w-full">
                <Button disabled={isLoading} onClick={() => onClose()} variant="ghost">Cancel</Button>
                <Button disabled={isLoading} onClick={() => handleLeave()} variant="default">Confirm</Button>
            </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LeaveServerModal;
