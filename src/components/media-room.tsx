"use client"
import { useUser } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import { Room } from 'livekit-client'
import { Loader2 } from 'lucide-react'
import { LiveKitRoom, VideoConference, RoomAudioRenderer } from '@livekit/components-react'
import '@livekit/components-styles'
import { cn } from '@/lib/utils'
import { useTheme } from 'next-themes'
interface MediaRoomProps {
    chatId: string
    video: boolean
    audio: boolean
}

const MediaRoom = ({ chatId, video, audio }: MediaRoomProps) => {
  const { user } = useUser()
  const [token, setToken] = useState("")
  const theme = useTheme()
  
  // Create a stable room instance
  const [room] = useState(() => new Room({
    adaptiveStream: true, // Optimize video quality per participant
    dynacast: true,       // Enable automatic quality optimization
  }))

  useEffect(() => {
    if (!user?.firstName || !user?.lastName) return
    
    const name = `${user.firstName} ${user.lastName}`
    let mounted = true

    const connectToRoom = async () => {
      try {
        const resp = await fetch(`/api/token?room=${chatId}&username=${name}`)
        const data = await resp.json()
        
        if (!mounted) return
        
        if (data.token) {
          setToken(data.token)
          await room.connect(process.env.NEXT_PUBLIC_LIVEKIT_URL!, data.token)
        }
      } catch (error) {
        console.error("Error connecting to LiveKit:", error)
      }
    }

    connectToRoom()

    // Cleanup: disconnect when component unmounts
    return () => {
      mounted = false
      room.disconnect()
    }
  }, [user?.firstName, user?.lastName, chatId, room])

  if (token === "") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Loading...</p>
      </div>
    )
  }

  return (
    <LiveKitRoom
      data-lk-theme={cn(theme.resolvedTheme === "dark" ? "dark" : "light")}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      token={token}
      connect={true}
      video={video}
      audio={audio}
      room={room} // Pass the room instance
    >
      <VideoConference />
      <RoomAudioRenderer /> {/* Handles room-wide audio */}
    </LiveKitRoom>
  )
}

export default MediaRoom