import { MessageSquareMore } from 'lucide-react'
import React from 'react'
interface ChatWelcomeProps {
    type: "channel" | "conversation"
    name: string
}
const ChatWelcome = ({name, type} : ChatWelcomeProps) => {
  return (
    <div className='space-y-2 px-4 mb-4'>
        {type === "channel" && (
            <div className='h-[75px] w-[75px] rounded-full bg-stone-500 dark:bg-stone-600 flex items-center justify-center'>
                <MessageSquareMore className='h-8 w-8 text-white'/>
            </div>
        )}
        <p className='text-xl md:text-3xl font-bold'>
            {type === "channel" ? `Welcome to #${name} channel` : `This is the beginning of your conversation with ${name}`}
        </p>
        <p className='text-stone-600 dark:text-stone-400 text-sm'>
            {type === "channel" ? "Start collaborating with your team by sending a message to this channel." : "Send your first message to start the conversation."}
        </p>
    </div>
  )
}

export default ChatWelcome