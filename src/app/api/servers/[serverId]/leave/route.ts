import { fetchCurrentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function PATCH(req: Request, {params}: {params: Promise<{serverId: string}>}) {
    try {
        const profile = await  fetchCurrentProfile()
        const {serverId} = await params
        if(!profile) return new NextResponse("Unauthorized", {status: 401})
        if(!serverId) return new NextResponse("Server ID is missing", {status: 401})
        const leaveServer = await db.server.update({
            where: {
                id: serverId,
                profileId: {
                    not: profile.id,
                }, // not the admin 
                members: {
                    some: {
                        profileId: profile.id
                    }
                } 
            },
            data: {
                members: {
                    deleteMany: {
                        profileId: profile.id
                    }
                }
            }
        })
        return NextResponse.json(leaveServer)
    } catch (error) {
        console.error("[SERVERS_POST]",error)
        return new NextResponse("Internal Server Error", {status: 500})
    }
}