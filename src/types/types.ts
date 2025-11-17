import { Member, Profile, Server } from "@/generated/prisma/client";
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
