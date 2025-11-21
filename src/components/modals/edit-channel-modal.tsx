"use client";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import qs from "query-string"
import { ChannelFormData, channelFormSchema } from "@/validation/form-schema";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import { ChannelType } from "@/generated/prisma/enums";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";
const EditChannelModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const {channel, server} = data
  const channelForm = useForm({
    resolver: zodResolver(channelFormSchema),
    defaultValues: {
      name: "",
      type: channel?.type ||  ChannelType.TEXT,
    },
  });
  const isModalOpen = isOpen && type === "editChannel";
  const isLoading = channelForm.formState.isSubmitting;
  const router = useRouter();
  const channelTypeOptions = [
    {
      id: 1,
      value: ChannelType.TEXT,
      label: "Text Channel",
    },
    {
      id: 2,
      value: ChannelType.AUDIO,
      label: "Voice Channel",
    },
    {
      id: 3,
      value: ChannelType.VIDEO,
      label: "Video Channel",
    },
  ];
  
  useEffect(() => {
    if (!channel) return

    channelForm.reset({
      name: channel.name,
      type: channel.type,
    })
  }, [channel, channelForm, channel?.id])
  const onSubmit = async (values: ChannelFormData) => {
    try{  
    const url = qs.stringifyUrl({
        url: `/api/channels/${channel?.id}`,
        query: {
            serverId: server?.id
        }
      }) 
      await axios.patch(url, values);
      channelForm.reset();
      router.refresh();
      onClose()
    }
    catch (error) {
      console.error(error);
    }
  };
  const handleClose = () => {
    channelForm.reset();
    onClose();
  };
  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overvlow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Edit Channel
          </DialogTitle>
        </DialogHeader>
        <Form {...channelForm}>
          <form
            onSubmit={channelForm.handleSubmit(onSubmit)}
            className="space-y-8"
          >
            <div className="space-y-8 px-6">
              <FormField
                control={channelForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-neutral-500 dark:text-secondary/70">
                      Channel name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-neutral-500/30 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Enter channel name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={channelForm.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Channel type</FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger className="w-auto bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none">
                          <SelectValue placeholder="Select a channel type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {channelTypeOptions.map((channel) => (
                          <SelectItem
                            key={channel.id}
                            value={channel.value}
                            className="capitalize"
                          >
                            {channel.value.toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gra-100 px-6 py-4">
              <Button type="submit" variant={"default"} disabled={isLoading}>
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditChannelModal;
