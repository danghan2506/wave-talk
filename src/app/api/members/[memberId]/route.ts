import { fetchCurrentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
export async function PATCH(req: Request, {params} : {params: Promise<{memberId: string}>}) {
    try {
        const profile = await fetchCurrentProfile()
        const {searchParams} = new URL(req.url)
        const {memberId} = await params
        const serverId = searchParams.get("serverId")
        const {role} = await req.json()
        if(!profile) return new NextResponse("Unauthorized", {status: 401})
        if(!serverId) return new NextResponse("ServerId is missing", {status: 401})
        if(!memberId) return new NextResponse("MemberId is missing", {status: 401})
        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: profile.id,
            }, 
            data: {
                members: {
                    update: {
                        where: {
                            id: memberId,
                            profileId: {
                                not: profile.id
                            }
                        },
                        data: {
                            role
                        }
                    },
                }
            },
            include: {
                members: {
                    include: {
                        profile: true
                    },
                    orderBy: {
                        role: "asc"
                    }
                }
            }
    })
    return NextResponse.json(server)
        
    } catch (error) {
        console.error("An error occured", error)
        return new NextResponse("Internal server error", {status: 404})
    }
}
export async function DELETE(req: Request, {params} : {params: Promise<{memberId: string}>}) {
    try {
        const profile = await fetchCurrentProfile()
        const {searchParams} = new URL(req.url)
        const {memberId} = await params
        const serverId = searchParams.get("serverId")
        if(!profile) return new NextResponse("Unauthorized", {status: 401})
        if(!serverId) return new NextResponse("ServerId is missing", {status: 401})
        if(!memberId) return new NextResponse("MemberId is missing", {status: 401})
        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: profile?.id
            },
            data: {
                members: {
                    deleteMany: {
                        id: memberId,
                        profileId: {
                            not: profile?.id
                        }
                    }
                }
            },
            include: {
                members: {
                    include: {
                        profile: true
                    },
                    orderBy: {
                        role: "asc"
                    }
                }
            }
        })
        return NextResponse.json(server)
        
    } catch (error) {
        console.error("An error occured", error)
        return new NextResponse("Internal server error", {status: 404})
    }
}