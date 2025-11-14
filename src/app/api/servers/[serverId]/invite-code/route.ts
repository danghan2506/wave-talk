import { fetchCurrentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import {v4 as uuidv4} from "uuid"

export async function PATCH(req: Request, {params}: {params: Promise<{serverId: string}>}) {
    try {
    const {serverId} = await params
    const profile = await fetchCurrentProfile()
    if(!profile)  return new NextResponse("Unauthorized", {status: 401})
    if(!serverId) return new NextResponse("ServerId is missing", {status: 401})
    const server = await db.server.update({
        where: {
            id: serverId,
            profileId: profile.id
        }, 
        data: {
            inviteCode: uuidv4()
        }
    })
    return NextResponse.json(server)
    } catch (error) {
        console.error("An error occured", error)
        return new NextResponse("Internal server error", {status: 404})
    }
}