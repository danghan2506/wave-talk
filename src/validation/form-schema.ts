import {z} from "zod"
export const serverFormSchema = z.object({
    name: z.string().min(1, "Server name is required"),
    imageUrl: z.string().min(1, "Server image is required")
})
export type ServerFormData = z.infer<typeof serverFormSchema>