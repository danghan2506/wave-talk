import { ChannelType } from "@/generated/prisma/enums"
import {z} from "zod"
export const serverFormSchema = z.object({
    name: z.string().min(1, "Server name is required"),
    imageUrl: z.string().min(1, "Server image is required")
})
export const channelFormSchema = z.object({
    name: z.string().min(1, "Channel name is required").refine(name => name !== "general", {
        message: "Channel name 'general' is reserved"
    }),
    type: z.enum(ChannelType).optional(),
})
export type ServerFormData = z.infer<typeof serverFormSchema>
export type ChannelFormData = z.infer<typeof channelFormSchema>