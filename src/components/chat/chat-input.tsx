"use client"
import { ContentFormData, contentFormSchema } from "@/validation/form-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import axios from "axios"
import qs from "query-string"
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form"
import { Plus } from "lucide-react"
import { Input } from "../ui/input"
import { useModal } from "@/hooks/use-modal-store"
import {EmojiPicker} from "@/components/emoji-picker"
import { useRouter } from "next/navigation"
interface ChatInputProps {
    apiUrl: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    query: Record<string, any>
    name: string
    type: "conversation" | "channel"
}
const ChatInput = ({apiUrl, query, name, type} : ChatInputProps) => {
  const {onOpen} = useModal()
  const router = useRouter()
  const contentForm = useForm<ContentFormData>({
    resolver :zodResolver(contentFormSchema),
    defaultValues: {
        content: "",
    }
  })
  const isLoading = contentForm.formState.isSubmitting
  const onSubmit = async(values : z.infer<typeof contentFormSchema>) => {
    try{
      const url = qs.stringifyUrl({
        url: apiUrl,
        query
      })
      await axios.post(url, values)
      contentForm.reset()
      router.refresh()
    }
    catch(error){
      console.log(error)
    }
  }
    return (
       <Form {...contentForm}>
      <form onSubmit={contentForm.handleSubmit(onSubmit)} className="px-4 py-4">
        <FormField
          control={contentForm.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative p-4 pb-6">
                  <button
                    type="button"
                    onClick={() => onOpen("messageFile", {apiUrl, query})}
                    className="absolute top-7 left-8 h-[24px] w-[24px] bg-stone-500 dark:bg-stone-400 hover:bg-stone-600 dark:hover:bg-stone-300 transition rounded-full p-1 flex items-center justify-center"
                  >
                    <Plus className="text-white dark:text-[#313338] h-4 w-4" />
                  </button>
        
                  {/* Input field */}
                  <Input
                    disabled={isLoading} // Vô hiệu hóa khi đang gửi
                    className="px-14 py-6 bg-stone-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-stone-600 dark:text-zinc-200"
                    placeholder={`Message ${
                      type === "conversation" ? name : "#" +`${name}`
                    }`}
                    {...field} // Đặt tất cả props từ useForm
                  />
                  <div className="absolute top-7 right-8">
                    <EmojiPicker onChange={(emoji: string) => field.onChange(`${field.value} ${emoji}`)}/>
                  </div>
                </div>
              </FormControl>
              {/* Hiển thị lỗi validation (nếu có) */}
              <FormMessage className="pl-14" />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}

export default ChatInput