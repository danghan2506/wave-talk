import { currentUser} from "@clerk/nextjs/server";
import { db } from "./db";
export const fetchCurrentProfile = async() => {
    const user = await currentUser()
    if (!user?.id) return null
    const profile = await db.profile.findUnique({
        where: {
            userId: user.id
        }
    })
    return profile
}