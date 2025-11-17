import { Channel, ChannelType, Member, MemberRole, Profile, Server } from "@/generated/prisma/client";
import React from "react";

export type ServerWithMembersWithProfile = Server & {
    members: (Member & {profile: Profile})[]
}
export interface ServerSearchProps {
    data: {
        label: string
        type: "channel" | "member"
        data: {
            icon: React.ReactNode
            name: string
            id: string
        }[] | undefined
    }[]
}
export interface ServerSectionProps {
    label?: string
    role?: string
    sectionType?: "channels" | "members"
    channelType?: ChannelType
    server?: ServerWithMembersWithProfile
}
export interface ServerChannelsProps {
    channel: Channel
    server: Server
    role?: MemberRole
}