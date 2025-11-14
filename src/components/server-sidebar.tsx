import { ChannelType } from "@/generated/prisma/enums";
import { fetchCurrentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import ServerHeader from "./server-header";

interface ServerSidebarProps {
  serverId: string;
}
const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {
  const profile = await fetchCurrentProfile();
  console.log(profile?.id);
  if (!profile) return redirect("/");
  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        },
      },
    },
  });
  // If the server wasn't found, redirect (prevents passing `null` to ServerHeader)
  if (!server) return redirect("/");
  //   looking for all channel that has type = text
  const textChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.TEXT
  );
  const audioChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.AUDIO
  );
  const videotChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.VIDEO
  );
  // members belongs to that server (except ourselve)
  const members = server?.members.filter(
    (member) => member.profileId !== profile.id
  );
  // members role
  const role = server?.members.find(
    (member) => member.profileId === profile.id
  )?.role;
  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <ServerHeader server={server} role={role} />
    </div>
  );
};

export default ServerSidebar;
