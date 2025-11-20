import { MemberRole } from "@/generated/prisma/enums"
import { fetchCurrentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function DELETE(req: Request, {params}: {params: Promise<{channeld: string}>}) {
    try {
        const profile = await fetchCurrentProfile()
        const {searchParams} = new URL(req.url)
        const serverId = searchParams.get("serverId")
        const {channeld: channelId} = await params
        if(!profile) return new NextResponse("Unauthorized", {status: 401})
        if(!serverId) return new NextResponse("Server ID is missing", {status: 401})
        if(!channelId) return new NextResponse("Channel ID is missing", {status: 401})    
        const deleteChannel = await db.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR]
                        }
                    }
                }
            },
            data: {
                channels: {
                    delete: {
                        id: channelId,
                        name: {
                            not: "general"
                        }
                    }
                }
            }
    })
    return NextResponse.json(deleteChannel) 
    } catch (error) {
        console.error("An error occured", error)
                return new NextResponse("Internal server error", {status: 500})
    }
}