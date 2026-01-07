"use client"
import { useState, useEffect } from 'react'
import { Room, RoomEvent } from 'livekit-client'
import {
  LiveKitRoom,
  RoomAudioRenderer,
  GridLayout,
  ParticipantTile,
  useTracks,
  TrackToggle,
  DisconnectButton,
  FocusLayout,
  CarouselLayout,
  useParticipants
} from '@livekit/components-react'
import { Track } from 'livekit-client'
import '@livekit/components-styles'
import {
  Loader2,
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Users,
  Monitor,
  Maximize2,
  Grid3X3,
  RefreshCw
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUser } from '@clerk/nextjs'


interface VideoRoomProps {
  chatId: string
  username: string
  tokenEndpoint?: string // defaults to '/api/token'
}


type LayoutMode = 'grid' | 'speaker'

const MicToggleButton = () => {
  const tracks = useTracks([Track.Source.Microphone], { onlySubscribed: false })
  const isMuted = !tracks.some(t => !t.publication?.isMuted)

  return (
    <TrackToggle
      source={Track.Source.Microphone}
      className={cn(
        "w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-200",
        "bg-secondary hover:bg-secondary/80 text-secondary-foreground",
        "font-semibold relative overflow-hidden group"
      )}
      showIcon={false}
    >
      <div className="relative z-10 transition-transform duration-200 group-hover:scale-110">
        {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
      </div>
    </TrackToggle>
  )
}

const CameraToggleButton = () => {
  const tracks = useTracks([Track.Source.Camera], { onlySubscribed: false })
  const isCameraOff = !tracks.some(t => !t.publication?.isMuted)

  return (
    <TrackToggle
      source={Track.Source.Camera}
      className={cn(
        "w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-200",
        "bg-secondary hover:bg-secondary/80 text-secondary-foreground",
        "font-semibold relative overflow-hidden group"
      )}
      showIcon={false}
    >
      <div className="relative z-10 transition-transform duration-200 group-hover:scale-110">
        {isCameraOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
      </div>
    </TrackToggle>
  )
}

const VideoRoomContent = () => {
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('grid')
  const participants = useParticipants()
 
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  )


  const screenShareTrack = tracks.find(t => t.source === Track.Source.ScreenShare)


  // Auto-switch to speaker view when someone shares screen
  useEffect(() => {
    if (screenShareTrack) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLayoutMode('speaker')
    }
  }, [screenShareTrack])


  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-background via-background to-muted/30">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-foreground">Video Call</span>
        </div>
       
        <div className="flex items-center gap-3">
          {/* Layout Toggle */}
          <div className="flex items-center bg-muted/50 rounded-lg p-1">
            <button
              onClick={() => setLayoutMode('grid')}
              className={cn(
                "p-1.5 rounded-md transition-all",
                layoutMode === 'grid'
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setLayoutMode('speaker')}
              className={cn(
                "p-1.5 rounded-md transition-all",
                layoutMode === 'speaker'
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
         
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="w-4 h-4" />
            <span className="text-sm">{participants.length}</span>
          </div>
        </div>
      </div>


      {/* Video Grid */}
      <div className="flex-1 overflow-hidden p-2 sm:p-4">
        {layoutMode === 'grid' ? (
          <GridLayout
            tracks={tracks}
            className="h-full"
          >
            <ParticipantTile
              className={cn(
                "rounded-xl overflow-hidden border border-border/50",
                "bg-card/50 backdrop-blur-sm",
                "[&_[data-lk-participant-name]]:bg-background/80 [&_[data-lk-participant-name]]:backdrop-blur-sm",
                "[&_[data-lk-participant-name]]:px-3 [&_[data-lk-participant-name]]:py-1.5",
                "[&_[data-lk-participant-name]]:rounded-lg [&_[data-lk-participant-name]]:text-sm"
              )}
            />
          </GridLayout>
        ) : (
          <div className="h-full flex flex-col gap-2">
            {screenShareTrack ? (
              <FocusLayout
                trackRef={screenShareTrack}
                className="flex-1 rounded-xl overflow-hidden border border-border/50"
              />
            ) : (
              <GridLayout
                tracks={tracks.slice(0, 1)}
                className="flex-1"
              >
                <ParticipantTile
                  className={cn(
                    "rounded-xl overflow-hidden border border-border/50",
                    "bg-card/50 backdrop-blur-sm"
                  )}
                />
              </GridLayout>
            )}
           
            {/* Thumbnail carousel */}
            {tracks.length > 1 && (
              <CarouselLayout
                tracks={screenShareTrack ? tracks : tracks.slice(1)}
                className="h-24 sm:h-32"
              >
                <ParticipantTile
                  className={cn(
                    "rounded-lg overflow-hidden border border-border/50",
                    "bg-card/50 w-32 sm:w-40"
                  )}
                />
              </CarouselLayout>
            )}
          </div>
        )}
       
        {participants.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <Video className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-lg">Waiting for others to join...</p>
          </div>
        )}
      </div>


      {/* Controls */}
      <div className="relative z-50 flex items-center justify-center gap-2 sm:gap-3 px-4 py-4 border-t border-border/50 bg-card/50 backdrop-blur-sm">
        <MicToggleButton />
       
        <CameraToggleButton />
       
        <TrackToggle
          source={Track.Source.ScreenShare}
          className={cn(
            "w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all",
            "bg-secondary hover:bg-secondary/80 text-secondary-foreground",
            "data-[lk-enabled=true]:bg-primary data-[lk-enabled=true]:text-primary-foreground"
          )}
          showIcon={false}
        >
          <Monitor className="w-5 h-5" />
        </TrackToggle>
       
        <DisconnectButton
          className={cn(
            "w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all",
            "bg-red-500 hover:bg-red-600 text-white"
          )}
        >
          <PhoneOff className="w-5 h-5" />
        </DisconnectButton>
      </div>
     
      <RoomAudioRenderer />
    </div>
  )
}


const VideoRoom = ({ chatId, username, tokenEndpoint = '/api/tokens' }: VideoRoomProps) => {
  const [token, setToken] = useState("")
  const [isConnecting, setIsConnecting] = useState(true)
  const [isDisconnected, setIsDisconnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const {user} = useUser()

  const [room] = useState(() => new Room({
    adaptiveStream: true,
    dynacast: true,
    videoCaptureDefaults: {
      resolution: { width: 1280, height: 720, frameRate: 30 }
    }
  }))


  useEffect(() => {
    if (!user?.firstName || !user?.lastName) return
    
    const name = `${user.firstName} ${user.lastName}`
    
    let mounted = true


    const connectToRoom = async () => {
      try {
        setIsConnecting(true)
        setIsDisconnected(false)
        setError(null)
        const resp = await fetch(`/api/token?room=${chatId}&username=${name}`)
        const data = await resp.json()
       
        if (!mounted) return
       
        if (data.token) {
          setToken(data.token)
        }
      } catch (err) {
        console.error("Error connecting to video room:", err)
        if (mounted) {
          setError("Failed to connect to video room")
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
            You have been disconnected from the video call.
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
        <p className="mt-4 text-sm text-muted-foreground">Starting video...</p>
      </div>
    )
  }


  return (
    <LiveKitRoom
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL!}
      token={token}
      connect={true}
      video={true}
      audio={true}
      room={room}
      className="h-full"
    >
      <VideoRoomContent />
    </LiveKitRoom>
  )
}


export default VideoRoom