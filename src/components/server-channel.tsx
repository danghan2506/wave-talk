"use client";

import { ChannelType, MemberRole } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";
import { ServerChannelsProps } from "@/types/types";
import { Edit, Lock, MessageSquareMore, Mic, Trash, Video } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import ActionTooltip from "./action-tooltip";
import { useModal } from "@/hooks/use-modal-store";
const iconMap = {
  [ChannelType.TEXT]: <MessageSquareMore />,
  [ChannelType.AUDIO]: <Mic />,
  [ChannelType.VIDEO]: <Video />,
};
const ServerChannel = ({ channel, server, role }: ServerChannelsProps) => {
  const router = useRouter();
  const params = useParams();
  const {onOpen} = useModal()
  const Icon = iconMap[channel.type];
  return (
    <button
      onClick={() => {}}
      className={cn(
        "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-stone-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
        params?.channelId === channel.id && "bg-stone-700/20 dark:bg-stone-700"
      )}
    >
      {Icon}
      <p
        className={cn(
          "line-clamp-1 font-semibold text-sm text-stone-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
          params?.channelId === channel.id &&
            "text-primary dark:text-zinc-200 dark:group-hover:text-white"
        )}
      >
        {channel.name}
      </p>
      {/* if this channel is not general and member role is admin/moderator  */}
      {channel.name !== "general" && role !== MemberRole.GUEST && (
        <div className="ml-auto flex items-center gap-x-2">
            <ActionTooltip label="Edit">
                <Edit onClick={() => onOpen("editChannel", {server, channel})} className="hidden group-hover:block w-4 h-4 text-stone-500 hover:text-stone-600 dark:text-zinc-400 dark:hover:text-stone-300 transition"></Edit>
            </ActionTooltip>
            <ActionTooltip label="Delete">
                <Trash onClick={() => onOpen("deleteChannel", {server, channel})} className="hidden group-hover:block w-4 h-4 text-stone-500 hover:text-stone-600 dark:text-zinc-400 dark:hover:text-stone-300 transition"></Trash>
            </ActionTooltip>
        </div>
      )}
      {channel.name === "general" && (
        <Lock className="ml-auto w-4 h-4 text-stone-500 dark:text-stone-400"/>
      )}
    </button>
  );
};

export default ServerChannel;
