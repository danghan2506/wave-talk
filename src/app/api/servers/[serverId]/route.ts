import { fetchCurrentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function PATCH(req: Request, {params}: {params: Promise<{serverId: string}>}){
    try {
        const {serverId} = await params
        const profile = await fetchCurrentProfile()
        const {name, imageUrl} = await req.json()
        if(!profile) return new NextResponse("Unauthorized", {status: 401})
        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: profile.id
            },
            data: {
               name,
               imageUrl
            }
    })
    return NextResponse.json(server)    
    } catch (error) {
         console.error("An error occured", error)
        return new NextResponse("Internal server error", {status: 404})
    }
}
export async function DELETE(req: Request, {params}: {params: Promise<{serverId: string}>}){
    try {
        const {serverId} = await params
        const profile = await fetchCurrentProfile()
        if(!profile) return new NextResponse("Unauthorized", {status: 401})
        const server = await db.server.delete({
            where: {
                id: serverId,
                profileId: profile.id
            },
            
    })
    return NextResponse.json(server)    
    } catch (error) {
         console.error("An error occured", error)
        return new NextResponse("Internal server error", {status: 404})
    }
}