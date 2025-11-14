"use client"
import { Dialog, DialogHeader,DialogContent, DialogTitle } from "../ui/dialog"
import { useModal } from "@/hooks/use-modal-store"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Copy, RefreshCcw } from "lucide-react"
const InviteModal = () => {
    const {isOpen, onClose, type} = useModal()
    const isModalOpen = isOpen && type === "invite"
  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
        <DialogContent className="bg-white text-black p-0 overvlow-hidden">
            <DialogHeader className="pt-8 px-6">
                <DialogTitle className="text-2xl text-center font-bold">
                    Invite your friends
                </DialogTitle>
                {/* <DialogDescription className="text-neutral-500 text-center">
                    Give your server a personality with a name and an image.You can always change it later.
                </DialogDescription> */}
            </DialogHeader>
            <div className="p-6">
                <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">Server invite link</Label>
                <div className="flex items-center mt-2 gap-x-2">
                    <Input className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0" value="invite-link"></Input>
                    <Button size="icon">
                        <Copy className="w-4 h-4"/>
                    </Button>
                </div>
                <Button variant="link" size="sm" className="text-xs text-neutral-600 mt-4">Generate a new link</Button>
                <RefreshCcw className="w-4 h-4 ml-2"/>
            </div>
        </DialogContent>
    </Dialog>
  )
}

export default InviteModal