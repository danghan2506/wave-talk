import { Profile, Member } from "@/generated/prisma/client";
import {  useEffect, useState } from "react";
import UserAvatar from "../user-avatar";
import ActionTooltip from "../action-tooltip";
import { Edit, FileIcon, ShieldUser, Trash, User, UserStar } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ContentFormData, contentFormSchema } from "@/validation/form-schema"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import qs from "query-string"
import axios from "axios";
import { useModal } from "@/hooks/use-modal-store";
import { useParams, useRouter } from "next/navigation";
interface ChatItemProps {
  id: string;
  content: string;
  member: Member & {
    profile: Profile;
  };
  timestamps: string;
  fileUrl: string | null;
  deleted: boolean;
  currentMember: Member;
  isUpdated: boolean;
  socketUrl: string;
  socketQuery: Record<string, string>;
}
const roleIconMap = {
  GUEST: <User className="h-4 w-4 mr-2 text-emerald-500" />,
  MODERATOR: <UserStar className="h-4 w-4 mr-2 text-emerald-500" />,
  ADMIN: <ShieldUser className="h-4 w-4 mr-2 text-rose-500" />,
};
const ChatItem = ({
  id,
  content,
  member,
  timestamps,
  fileUrl,
  deleted,
  currentMember,
  isUpdated,
  socketUrl,
  socketQuery,
}: ChatItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const {onOpen} = useModal()
  const params = useParams()
  const router = useRouter()
  const onMemberClick = () => {
    if(member.id === currentMember.id){
      return
  }
  router.push(`/servers/${params?.serverId}/conversations/${member.id}`)
}
  const contentForm = useForm<ContentFormData>({
    resolver: zodResolver(contentFormSchema),
    defaultValues: {
        content: content
    }
  })
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent ) => {
        if(event.key === "Escape" && isEditing || event.keyCode === 27){
            setIsEditing(false)
        }

    }
    window.addEventListener("keydown", handleKeyDown)
    return () => {
        window.removeEventListener("keydown", handleKeyDown)
    }
  })
  useEffect(() => {
    contentForm.reset({
        content: content
    })
  }, [content, contentForm])
  const isLoading = contentForm.formState.isSubmitting
  const onSubmit = async (values : ContentFormData) => {
    try {
        const url = qs.stringifyUrl({
            url: `${socketUrl}/${id}`,
            query: socketQuery
        })
        await axios.patch(url, values)
        contentForm.reset()
        setIsEditing(false)
    } catch (error) {
        console.log(error)
    }
  }
  
  // Determine file type from content (filename) or URL
  const getExtensionFromString = (str: string | null) => {
    if (!str) return null;
    // Remove query params and get last part after dot
    const clean = str.split("?")[0];
    const ext = clean.split(".").pop()?.toLowerCase();
    // Only return if it looks like a valid extension (not a random hash)
    if (ext && ext.length <= 5 && /^[a-z0-9]+$/.test(ext)) {
      return ext;
    }
    return null;
  };
  
  // Try to get extension from content first (new messages have filename in content)
  // Then try from URL (for backward compatibility)
  const contentExtension = getExtensionFromString(content);
  const urlExtension = getExtensionFromString(fileUrl);
  const fileExtension = contentExtension || urlExtension;
  
  // Check if URL is from UploadThing
  const isUploadThingUrl = fileUrl?.includes("ufs.sh") || fileUrl?.includes("uploadthing");
  
  // Check for PDF
  const isPdf = fileUrl && (
    fileExtension === "pdf" || 
    content?.toLowerCase().includes(".pdf") ||
    fileUrl?.toLowerCase().includes(".pdf") ||
    fileUrl?.includes("/pdf")
  );
  
  // Check for image
  const imageExtensions = ["png", "jpg", "jpeg", "gif", "webp", "svg", "bmp"];
  const hasKnownImageExtension = imageExtensions.includes(fileExtension!) ||
    imageExtensions.some(ext => content?.toLowerCase().includes(`.${ext}`)) ||
    imageExtensions.some(ext => fileUrl?.toLowerCase().includes(`.${ext}`));
  
  // isImage: has image extension, OR is UploadThing URL that's not PDF
  const isImage = fileUrl && !isPdf && (
    hasKnownImageExtension ||
    fileUrl.includes("/image") ||
    (isUploadThingUrl && !isPdf) // UploadThing URLs default to image if not PDF
  );
  const isAdmin = currentMember.role === "ADMIN";
  const isModerator = currentMember.role === "MODERATOR";
  const isOwner = currentMember.id === member.id;
  const canDeleteMessage = !deleted && (isOwner || isModerator || isOwner);
  const canEditMessage = !deleted && isOwner && !fileUrl;

  return (
    <div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full">
      <div className="group flex gap-x-2 items-start w-full">
        <div onClick={onMemberClick} className="cursor-pointer hover:drop-shadow-md transition">
          <UserAvatar src={member.profile.imageUrl} />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              <p onClick={onMemberClick} className="font-semibold text-sm hover:underline cursor-pointer">
                {member.profile.name}
              </p>
              <ActionTooltip label={member.role}>
                <div className="ml-1">
                {roleIconMap[member.role]}
                </div>
              </ActionTooltip>
            </div>
            <span className="text-xs text-stone-500 dark:text-stone-400">
              {timestamps}
            </span>
          </div>
          {isImage && (
            <div
              onClick={() => onOpen("imageViewer", { 
                imageUrl: fileUrl!, 
                imageName: content 
              })}
              className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48 cursor-pointer group"
            >
              <Image
                src={fileUrl!}
                alt={content}
                fill
                className="object-cover transition-transform duration-200 group-hover:scale-105"
                unoptimized
              />
              {/* Subtle hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
            </div>
          )}
          {isPdf && (
            <div className="relative flex items-center p-4 mt-2 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20 border border-indigo-200/50 dark:border-indigo-700/50 max-w-sm shadow-sm">
              {/* PDF Icon Container */}
              <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg flex-shrink-0">
                <FileIcon className="h-8 w-8 text-white fill-white/20" />
              </div>
              
              {/* File Info */}
              <div className="ml-4 flex-1 min-w-0">
                <p className="text-sm font-semibold text-stone-800 dark:text-stone-100 truncate">
                  {/* Show filename from content, or default text */}
                  {content?.toLowerCase().endsWith('.pdf') ? content : 'PDF Document'}
                </p>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  PDF File • Click to download
                </p>
              </div>
              
              {/* Download Button */}
              <a
                href={fileUrl!}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-3 p-2.5 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white transition-colors shadow-md hover:shadow-lg"
                title="Download PDF"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </a>
            </div>
          )}
          {!fileUrl && !isEditing && (
            <p className={cn("text-sm text-stone-600 dark:text-stone-300", deleted && "italic text-stone-500 dark:text-stone-400 text-xs mt-1")}>{content}
            {isUpdated && !deleted && (
                <span className="text-[10px] mx-2 text-sotne-500 dark:text-stone-400">(edited)</span>
            )}
            </p>
          )}
          {!fileUrl && isEditing && (
            <Form {...contentForm}>
                <form className="flex items-center w-full gap-x-2 pt-2" onSubmit={contentForm.handleSubmit(onSubmit) }>
                    <FormField control={contentForm.control} name="content" render={({field}) => (
                        <FormItem className="flex-1">
                            <FormControl>
                                <div className="relative w-full">
                                    <Input disabled={isLoading} className="p-2 bg-stone-200/90 dark:bg-stone-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-stone-600 dark:text-stone-200" placeholder="Editted message" {...field}></Input>
                                </div>
                            </FormControl>
                        </FormItem>
                    )}></FormField>
                    <Button disabled={isLoading} size="sm" variant="default">Save</Button>
                </form>
                <span className="text-[10px] mt-1 text-stone-400">Press Esc to cancel, enter to save</span>
            </Form>
          )}
        </div>
      </div>
      {canDeleteMessage && (
        <div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 top-2 right-5 bg-white dark:bg-stone-800 border-rounded-sm">
            {canEditMessage && (
                <ActionTooltip label="Edit">
                    <Edit onClick={() => setIsEditing(true)} className="cursor-pointer ml-auto w-4 h-4 text-stone-500 hover:text-zinc-600 dark:hover:text-stone-300 transition"/>
                </ActionTooltip>
            )}
             <ActionTooltip label="Delete">
            <Trash onClick={() => onOpen("deleteMessage", {apiUrl: `${socketUrl}/${id}`, query: socketQuery})} className="cursor-pointer ml-auto w-4 h-4 text-stone-500 hover:text-zinc-600 dark:hover:text-stone-300 transition"/>
        </ActionTooltip>
        </div>
      )}
     
    </div>
  );
};

export default ChatItem;