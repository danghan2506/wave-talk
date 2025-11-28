import ChatHeader from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import ChatMessages from "@/components/chat/chat-messages";
import MediaRoom from "@/components/media-room";
import { fetchCurrentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
interface channelIdProps {
  params: {
    serverId: string;
    channelId: string;
  };
}
const ChannelIdPage = async ({ params }: channelIdProps) => {
  const profile = await fetchCurrentProfile();
  const { serverId, channelId } = await params;
  if (!profile) return redirect("/sign-in");
  const channel = await db.channel.findUnique({
    where: {
      id: channelId,
      serverId: serverId,
    },
  });
  const member = await db.member.findFirst({
    where: {
      serverId: serverId,
      profileId: profile.id,
    },
  });
  if (!channel || !member) return redirect("/");
  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col min-h-screen">
      <ChatHeader
        name={channel.name}
        serverId={channel.serverId}
        type="channel"
      />
      {channel.type === "TEXT" && (
        <>
         <ChatMessages
        member={member}
        name={channel.name}
        type="channel"
        apiUrl="/api/messages"
        chatId={channel.id}
        socketUrl="/api/socket/messages"
        socketQuery={{ channelId: channel.id, serverId: channel.serverId }}
        paramKey="channelId"
        paramValue={channel.id}
      />
         <ChatInput
        name={channel.name}
        type="channel"
        apiUrl="/api/socket/messages"
        query={{ channelId: channel.id, serverId: channel.serverId }}
      />
        </>
      )}
      {channel.type === "AUDIO" && (
        <MediaRoom chatId={channel.id} video={false} audio={true}></MediaRoom>
      )}
      {channel.type === "VIDEO" && (
        <MediaRoom chatId={channel.id} video={true} audio={true}></MediaRoom>
      )}
     
   
    </div>
  );
};

export default ChannelIdPage;
