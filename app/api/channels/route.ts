import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import { MemberRole } from "@prisma/client"
import { NextResponse } from "next/server"

export async function POST(req:Request) {
    try{
        const profile = await currentProfile()
        const { name, type } = await req.json()
        const url = new URL(req.url)

        const serverId = url.searchParams.get("serverId")

        if(!profile) {
            return new NextResponse("Unauthorized", {status:401})
        }

        if(!serverId) {
            return new NextResponse("Server ID Missing", {status:400})
        }

        if(name === "general") {
            return new NextResponse("Name cannot be 'general'", {status:400})
        }

        const server= await db.server.update({
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

        return NextResponse.json(server)

    } catch (error) {
        console.log("CHANNELS_POST",error)
        return new NextResponse("Internal Error", {status:500})
    }
}