import { db } from "@/lib/db";
import { Prisma } from "@/generated/prisma/client";

type ConversationWithMembers = Prisma.ConversationGetPayload<{
  include: {
    memberOne: { include: { profile: true } };
    memberTwo: { include: { profile: true } };
  };
}>;

export const getOrCreateConversation = async (
  memberOneId: string,
  memberTwoId: string
): Promise<ConversationWithMembers | null> => {
  let conversation: ConversationWithMembers | null =
    (await findConversation(memberOneId, memberTwoId)) ||
    (await findConversation(memberTwoId, memberOneId));
  
  if (!conversation) {
    conversation = await createNewConversation(memberOneId, memberTwoId);
  }
  
  return conversation;
};

const findConversation = async (
  memberOneId: string,
  memberTwoId: string
): Promise<ConversationWithMembers | null> => {
  return (await db.conversation.findFirst({
    where: {
      AND: [{ memberOneId }, { memberTwoId }],
    },
    include: {
      memberOne: {
        include: {
          profile: true,
        },
      },
      memberTwo: {
        include: {
          profile: true,
        },
      },
    },
  })) as ConversationWithMembers | null;
};

const createNewConversation = async (
  memberOneId: string,
  memberTwoId: string
): Promise<ConversationWithMembers | null> => {
  try {
    return (await db.conversation.create({
      data: {
        memberOneId,
        memberTwoId,
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    })) as ConversationWithMembers;
  } catch (error) {
    return null;
  }
};