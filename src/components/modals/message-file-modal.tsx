"use client"
import { Dialog, DialogDescription, DialogHeader,DialogContent, DialogTitle, DialogFooter } from "../ui/dialog"
import { useForm } from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import { MessageFileFormData, messageFileFormSchema } from "@/validation/form-schema"
import { Button } from "../ui/button"
import { Form, FormControl, FormField, FormItem } from "../ui/form"
import FileUpload from "../file-upload"
import axios from "axios"
import qs from "query-string"
import { useModal } from "@/hooks/use-modal-store"
const MessageFileModal = () => {
    const {isOpen, onClose, type, data} = useModal()
    const isModalOpen = isOpen && type === "messageFile"
    const {apiUrl, query} = data
    const messageFileForm = useForm({
        resolver: zodResolver(messageFileFormSchema),
        defaultValues: {
            fileUrl: "",
        }
    })
    const handleClose = () => {
        messageFileForm.reset()
        onClose()
    }
    const isLoading = messageFileForm.formState.isSubmitting
    const onSubmit = async (values: MessageFileFormData ) => {
        try {
            const url = qs.stringifyUrl({
                url: apiUrl || "",
                query: query
            })
            await axios.post(url, {...values, content: values.fileUrl})
            messageFileForm.reset()
            handleClose()
        } catch (error) {
            console.error(error)
        }
    }
  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
        <DialogContent className="bg-white text-black p-0 overvlow-hidden">
            <DialogHeader className="pt-8 px-6">
                <DialogTitle className="text-2xl text-center font-bold">
                    Add an attachment 
                </DialogTitle>
                <DialogDescription className="text-neutral-500 text-center">
                    Send a file as a message
                </DialogDescription>
            </DialogHeader>
            <Form {...messageFileForm}>
                <form onSubmit={messageFileForm.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="space-y-8 px-6">
                        <div className="flex items-center justify-center">
                            <FormField control={messageFileForm.control} name="fileUrl" render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                        <FileUpload endpoint="messageFile" value={field.value} onChange={field.onChange}/>
                                    </FormControl>
                                </FormItem>
                            )}/>
                        </div>
                    </div>
                    <DialogFooter className="bg-gra-100 px-6 py-4">
                        <Button variant={"default"} disabled={isLoading}>Send</Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    </Dialog>
  )
}

export default MessageFileModal