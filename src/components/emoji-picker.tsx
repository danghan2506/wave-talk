"use client"

import { Smile, Loader2 } from "lucide-react" // Import thêm Loader2 để làm icon loading
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useTheme } from "next-themes"
import dynamic from "next/dynamic" // Import dynamic từ Next.js
import { Theme } from "emoji-picker-react" // Chỉ import Enum Theme (nhẹ), không import cả bộ Picker

interface EmojiPickerProps {
  onChange: (value: string) => void
}

// Định nghĩa Lazy Load Component
const Picker = dynamic(
  () => {
    return import("emoji-picker-react")
  },
  {
    ssr: false, // Tắt SSR vì emoji picker chỉ cần thiết ở client-side
    // Hiển thị cái này trong lúc đang tải thư viện (tránh giật layout)
    loading: () => (
      <div className="flex h-[400px] w-full items-center justify-center bg-muted/10">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    ),
  }
)

export const EmojiPicker = ({ onChange }: EmojiPickerProps) => {
  const { resolvedTheme } = useTheme()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Smile 
          className="text-stone-500 dark:text-stone-400 hover:text-stone-600 dark:hover:text-zinc-300 transition cursor-pointer" 
        />
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="end"
        sideOffset={40}
        className="bg-transparent border-none shadow-none drop-shadow-none w-full p-0"
      >
        {/* Chỉ khi Popover mở, Picker mới bắt đầu được tải về */}
        <Picker
          theme={resolvedTheme === "dark" ? Theme.DARK : Theme.LIGHT}
          onEmojiClick={(data) => onChange(data.emoji)}
        />
      </PopoverContent>
    </Popover>
  )
}