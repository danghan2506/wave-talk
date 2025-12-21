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
  const fileType = fileUrl?.split(".").pop();
  const isPdf = fileType === "pdf";
  const isImage =
    !isPdf &&
    fileUrl &&
    ["png", "jpg", "jpeg", "gif", "webp"].includes(fileType!);
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
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferer"
              className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48"
            >
              <Image
                src={fileUrl}
                alt={content}
                fill
                className="object-cover"
              />
            </a>
          )}
          {isPdf && (
            <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
              <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
              <a
                href={fileUrl!}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
              >
                View PDF Document
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