import { currentUser } from "@clerk/nextjs/server";
import { db } from "./db";

export const currentProfile = async () => {
    const user = await currentUser();

    if(!user) 
        return null

    const userId = user.id

    const profile = await db.profile.findUnique({
        where: {
            userId
        }
    })

    return profile
}