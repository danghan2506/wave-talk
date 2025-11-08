import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@clerk/nextjs/server";

const f = createUploadthing();

const handleAuth = async() => {
    const {userId} =await auth()
    if(!userId) throw new Error("Unauthorized")
    return {userId: userId}
}

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
    //Upload server image
    serverImage: f({image: {maxFileSize: "4MB", maxFileCount: 1}}) 
    .middleware(() => handleAuth())
    .onUploadComplete(async({metadata, file}) => {
        console.log("Upload complete: ", file)
    }),
    // Upload image, file, etc. in message
    messageFile: f(["image", "pdf", "audio/mp4", "video"])
    .middleware(() => handleAuth())
    .onUploadComplete(() => {})
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
