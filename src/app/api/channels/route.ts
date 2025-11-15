import { MemberRole } from "@/generated/prisma/enums"
import { fetchCurrentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
         const profile = await fetchCurrentProfile()
         const {name, type} = await req.json()
         const {searchParams} = new URL(req.url)
         const serverId = searchParams.get("serverId")
            if(!profile) return new NextResponse("Unauthorized", {status: 401})
            if(!serverId) return new NextResponse("ServerId is missing", {status: 401})
            if(name === "general") return new NextResponse("Channel name 'general' is reserved", {status: 400})
            const channel = await db.server.update({
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
                        create: {
                            profileId: profile.id,
                            name,
                            type
                        }
                    }
                }
            })
            return NextResponse.json(channel)
    } catch (error) {
        console.error("An error occured", error)
        return new NextResponse("Internal server error", {status: 404})
    }
   
    
}