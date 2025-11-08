import { PrismaClient } from "@/generated/prisma/client";
import {withAccelerate} from "@prisma/extension-accelerate"
const PrismaClientWithAccelerate = new PrismaClient().$extends(withAccelerate());
export type ExtendedPrismaClient = typeof PrismaClientWithAccelerate;
declare global {
    var prisma: ExtendedPrismaClient | undefined;
}
export const db = globalThis.prisma || PrismaClientWithAccelerate
if(process.env.NODE_ENV !== "production") globalThis.prisma = db
