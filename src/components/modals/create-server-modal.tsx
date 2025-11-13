"use client"
import { Dialog, DialogDescription, DialogHeader,DialogContent, DialogTitle, DialogFooter } from "../ui/dialog"
import { useForm } from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import { ServerFormData, serverFormSchema } from "@/validation/form-schema"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import FileUpload from "../file-upload"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useModal } from "@/hooks/use-modal-store"
const CreateServerModal = () => {
    const serverForm = useForm({
        resolver: zodResolver(serverFormSchema),
        defaultValues: {
            name: "",
            imageUrl: "",
        }
    })
    const {isOpen, onClose, type} = useModal()
    const isModalOpen = isOpen && type === "createServer"
    const isLoading = serverForm.formState.isSubmitting
    const router = useRouter()
    const onSubmit = async (values: ServerFormData ) => {
        try {
            await axios.post("/api/servers", values)
            serverForm.reset()
            router.refresh()
        } catch (error) {
            console.error(error)
        }
    }
    const handleClose = () => {
        serverForm.reset()
        onClose()
    }
  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
        <DialogContent className="bg-white text-black p-0 overvlow-hidden">
            <DialogHeader className="pt-8 px-6">
                <DialogTitle className="text-2xl text-center font-bold">
                    Customize your server
                </DialogTitle>
                <DialogDescription className="text-neutral-500 text-center">
                    Give your server a personality with a name and an image.You can always change it later.
                </DialogDescription>
            </DialogHeader>
            <Form {...serverForm}>
                <form onSubmit={serverForm.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="space-y-8 px-6">
                        <div className="flex items-center justify-center">
                            <FormField control={serverForm.control} name="imageUrl" render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                        <FileUpload endpoint="serverImage" value={field.value} onChange={field.onChange}/>
                                    </FormControl>
                                </FormItem>
                            )}/>
                        </div>
                        <FormField control={serverForm.control} name="name" render={({field}) => (
                        <FormItem>
                            <FormLabel className="uppercase text-xs font-bold text-neutral-500 dark:text-secondary/70">
                                Server name
                            </FormLabel>
                            <FormControl>
                                <Input disabled={isLoading} className="bg-neutral-500/30 border-0 focus-visible::ring-0 text-black focus-visible:ring-offset-0" placeholder="Enter server name" {...field}/>
                                
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}/>
                    </div>
                    <DialogFooter className="bg-gra-100 px-6 py-4">
                        <Button variant={"default"} disabled={isLoading}>Create</Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    </Dialog>
  )
}

export default CreateServerModal