import {db} from "@/lib/db"
export const getOrCreateConversation = async (senderId: string, receiverId: string) => {
    let conversation = await findConversation(senderId, receiverId) || await findConversation(receiverId, senderId)
    if(!conversation) {
        conversation = await createNewConversation(senderId, receiverId)
    }
    return conversation
}
const findConversation = async (senderId: string, receiverId: string) => {
    return await db.conversation.findFirst({
        where: {
            AND: [
                {senderId: senderId},
                {receiverId: receiverId}
            ]
        },
        include: {
            sender: {
                include: {
                    profile: true
                }
            },
            receiver: {
                include: {
                    profile: true
                }
            }
        }
    })
}
const createNewConversation = async (senderId: string, receiverId: string) => {
    try {
        return await db.conversation.create({
            data: {
                senderId,
                receiverId
            },
            include: {
                sender: {
                    include: {
                        profile: true
                    }
                },
                receiver: {
                    include: {
                        profile: true
                    }
                }
            }
        })
    } catch (error) {
        return null
    }
}