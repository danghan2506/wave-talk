"use client"
import { useState, useEffect } from 'react'
import { Room, RoomEvent, RemoteParticipant, LocalParticipant } from 'livekit-client'
import {
  LiveKitRoom,
  RoomAudioRenderer,
  useParticipants,
  useLocalParticipant,
  useTracks,
  TrackToggle,
  DisconnectButton
} from '@livekit/components-react'
import { Track } from 'livekit-client'
import '@livekit/components-styles'
import { Loader2, Mic, MicOff, PhoneOff, Users, Volume2, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUser } from '@clerk/nextjs'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

interface AudioRoomProps {
  chatId: string
  username: string
  tokenEndpoint?: string // defaults to '/api/token'
}


const AudioParticipantTile = ({
  participant,
  isLocal = false
}: {
  participant: RemoteParticipant | LocalParticipant
  isLocal?: boolean
}) => {
  const tracks = useTracks([Track.Source.Microphone], { onlySubscribed: false })
  const participantTracks = tracks.filter(t => t.participant.identity === participant.identity)
  const isSpeaking = participant.isSpeaking
  const isMuted = !participantTracks.some(t => !t.publication?.isMuted)
  const getImageUrl = () => {
    try {
      const metadata = participant.metadata ? JSON.parse(participant.metadata) : {}
      return metadata.imageUrl || ''
    } catch {
      return ''
    }
  }

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-300",
        "bg-card/50 backdrop-blur-sm border border-border/50",
        isSpeaking && "ring-2 ring-primary ring-offset-2 ring-offset-background scale-105",
        "hover:bg-card/80"
      )}
    >
      {/* Avatar */}
      <div className="relative">
        <div
          className={cn(
            "relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden",
            "shadow-lg transition-transform duration-300",
            isSpeaking && "animate-pulse"
          )}
        >
          <Avatar className="w-full h-full">
            <AvatarImage src={getImageUrl()} className="object-cover" />
            <AvatarFallback className="text-lg bg-primary/10 text-primary">
              {participant.identity?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
       
        {/* Speaking indicator */}
        {isSpeaking && (
          <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center">
            <Volume2 className="w-3 h-3 text-white" />
          </div>
        )}
       
        {/* Muted indicator */}
        {isMuted && (
          <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-destructive rounded-full flex items-center justify-center">
            <MicOff className="w-3 h-3 text-destructive-foreground" />
          </div>
        )}
      </div>
     
      {/* Name */}
      <span className={cn(
        "mt-3 text-sm font-medium truncate max-w-full px-2",
        "text-foreground/90"
      )}>
        {participant.identity}
        {isLocal && <span className="text-muted-foreground ml-1">(You)</span>}
      </span>
    </div>
  )
}


const MicToggleButton = () => {
  const tracks = useTracks([Track.Source.Microphone], { onlySubscribed: false })
  const isMuted = !tracks.some(t => !t.publication?.isMuted)

  return (
    <TrackToggle
      source={Track.Source.Microphone}
      className={cn(
        "w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-200",
        "bg-secondary hover:bg-secondary/80 text-secondary-foreground",
        "font-semibold relative overflow-hidden group"
      )}
      showIcon={false}
    >
      <div className="relative z-10 transition-transform duration-200 group-hover:scale-110">
        {isMuted ? (
          <MicOff className="w-5 h-5" />
        ) : (
          <Mic className="w-5 h-5" />
        )}
      </div>
    </TrackToggle>
  )
}


const AudioRoomContent = () => {
  const participants = useParticipants()
  const { localParticipant } = useLocalParticipant()
  

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-foreground">Voice Connected</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Users className="w-4 h-4" />
          <span className="text-sm">{participants.length}</span>
        </div>
      </div>


      {/* Participants Grid */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {participants.map((participant) => (
            <AudioParticipantTile
              key={participant.identity}
              participant={participant}
              isLocal={participant.identity === localParticipant.identity}
            />
          ))}
        </div>
       
        {participants.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <Users className="w-12 h-12 mb-4 opacity-50" />
            <p>Waiting for others to join...</p>
          </div>
        )}
      </div>


      {/* Controls */}
      <div className="relative z-50 flex items-center justify-center gap-4 px-4 py-4 border-t border-border/50 bg-card/50 backdrop-blur-sm">
        <MicToggleButton />
       
        <DisconnectButton
          className={cn(
            "w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-200",
            "bg-red-500 hover:bg-red-600 active:bg-red-700 text-white",
            "font-semibold hover:scale-110 relative overflow-hidden"
          )}
        >
          <PhoneOff className="w-5 h-5" />
        </DisconnectButton>
      </div>
     
      <RoomAudioRenderer />
    </div>
  )
}


const AudioRoom = ({ chatId, username, tokenEndpoint = '/api/tokens' }: AudioRoomProps) => {
  const [token, setToken] = useState("")
  const [isConnecting, setIsConnecting] = useState(true)
  const [isDisconnected, setIsDisconnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const {user }= useUser()

  const [room] = useState(() => new Room({
    adaptiveStream: true,
    dynacast: true,
  }))


  useEffect(() => {
    if (!user?.firstName || !user?.lastName) return
    
    const name = `${user.firstName} ${user.lastName}`
    const imageUrl = user.imageUrl || ''
    let mounted = true


    const connectToRoom = async () => {
      try {
        setIsConnecting(true)
        setIsDisconnected(false)
        setError(null)
        const resp = await fetch(`/api/token?room=${chatId}&username=${encodeURIComponent(name)}&imageUrl=${encodeURIComponent(imageUrl)}`)
        const data = await resp.json()
       
        if (!mounted) return
       
        if (data.token) {
          setToken(data.token)
        }
      } catch (err) {
        console.error("Error connecting to voice room:", err)
        if (mounted) {
          setError("Failed to connect to voice room")
        }
      } finally {
        if (mounted) {
          setIsConnecting(false)
        }
      }
    }

    const onDisconnected = () => {
      if (mounted) {
        setIsDisconnected(true)
      }
    }

    room.on(RoomEvent.Disconnected, onDisconnected)
    connectToRoom()


    return () => {
      mounted = false
      room.off(RoomEvent.Disconnected, onDisconnected)
      room.disconnect()
    }
  }, [username, chatId, room, tokenEndpoint, retryCount])

  const handleReconnect = () => {
    setIsConnecting(true)
    setIsDisconnected(false)
    setError(null)
    setToken("")
    setRetryCount(prev => prev + 1)
  }

  if (isDisconnected) {
    return (
      <div className="flex flex-col flex-1 justify-center items-center h-full bg-background gap-6">
        <div className="flex flex-col items-center gap-2">
          <div className="p-4 rounded-full bg-destructive/10 mb-2">
            <PhoneOff className="w-10 h-10 text-destructive" />
          </div>
          <h3 className="text-xl font-semibold text-foreground">Disconnected</h3>
          <p className="text-muted-foreground text-center max-w-xs">
            You have been disconnected from the voice channel.
          </p>
        </div>
        
        <button
          onClick={handleReconnect}
          className={cn(
            "px-6 py-2.5 rounded-full font-medium transition-all",
            "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl",
            "flex items-center gap-2"
          )}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Reconnect
        </button>
      </div>
    )
  }

  // Check for error FIRST, before loading state
  if (error) {
    return (
      <div className="flex flex-col flex-1 justify-center items-center h-full bg-background">
        <p className="text-destructive mb-4">{error}</p>
        <button 
          onClick={handleReconnect}
          className="text-sm text-primary hover:underline"
        >
          Retry
        </button>
      </div>
    )
  }

  if (isConnecting || token === "") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center h-full bg-background">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
          <Loader2 className="h-10 w-10 text-primary animate-spin relative z-10" />
        </div>
        <p className="mt-4 text-sm text-muted-foreground">Connecting to voice...</p>
      </div>
    )
  }


  return (
    <LiveKitRoom
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL!}
      token={token}
      connect={true}
      video={false}
      audio={true}
      room={room}
      className="h-full"
    >
      <AudioRoomContent />
    </LiveKitRoom>
  )
}


export default AudioRoom
