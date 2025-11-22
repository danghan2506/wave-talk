"use client"
import { ContentFormData, contentFormSchema } from "@/validation/form-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form"
import { Plus, Smile } from "lucide-react"
import { Input } from "../ui/input"
interface ChatInputProps {
    apiUrl: string
    query: Record<string, any>
    name: string
    type: "conversation" | "channel"
}
const ChatInput = ({apiUrl, query, name, type} : ChatInputProps) => {
  const contentForm = useForm<ContentFormData>({
    resolver :zodResolver(contentFormSchema),
    defaultValues: {
        content: "",
    }
  })
  const isLoading = contentForm.formState.isSubmitting
  const onSubmit = async(value : z.infer<typeof contentFormSchema>) => {
    console.log(value)
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
                    onClick={() => {}}
                    className="absolute top-7 left-8 h-[24px] w-[24px] bg-stone-500 dark:bg-stone-400 hover:bg-stone-600 dark:hover:bg-stone-300 transition rounded-full p-1 flex items-center justify-center"
                  >
                    <Plus className="text-white dark:text-[#313338] h-4 w-4" />
                  </button>
        
                  {/* Input field */}
                  <Input
                    disabled={isLoading} // Vô hiệu hóa khi đang gửi
                    className="px-14 py-6 bg-stone-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-stone-600 dark:text-zinc-200"
                    placeholder={`Message ${
                      type === "conversation" ? name : `# + ${name}`
                    }`}
                    {...field} // Đặt tất cả props từ useForm
                  />
                  <div className="absolute top-7 right-8">
                    <Smile/>
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