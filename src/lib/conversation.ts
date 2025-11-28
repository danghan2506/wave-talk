import { db } from "@/lib/db";
import { Prisma } from "@/generated/prisma/client";

export const getOrCreateConversation = async (
  memberOneId: string,
  memberTwoId: string
): Promise<
  | (Prisma.ConversationGetPayload<{
      include: {
        memberOne: { include: { profile: true } };
        memberTwo: { include: { profile: true } };
      };
    }>)
  | null
> => {
  let conversation =
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
): Promise<
  | (Prisma.ConversationGetPayload<{
      include: {
        memberOne: { include: { profile: true } };
        memberTwo: { include: { profile: true } };
      };
    }>)
  | null
> => {
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
  })) as Prisma.ConversationGetPayload<{
    include: {
      memberOne: { include: { profile: true } };
      memberTwo: { include: { profile: true } };
    };
  }> | null;
};

const createNewConversation = async (
  memberOneId: string,
  memberTwoId: string
): Promise<
  | (Prisma.ConversationGetPayload<{
      include: {
        memberOne: { include: { profile: true } };
        memberTwo: { include: { profile: true } };
      };
    }>)
  | null
> => {
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
    })) as Prisma.ConversationGetPayload<{
      include: {
        memberOne: { include: { profile: true } };
        memberTwo: { include: { profile: true } };
      };
    }>;
  } catch (error) {
    return null;
  }
};