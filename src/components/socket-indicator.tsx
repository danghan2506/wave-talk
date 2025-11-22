"use client";
import { useSocket } from "@/components/provider/socket-provider";
import { Badge } from "./ui/badge";
export const SocketIndicator = () => {
  const { isConnected } = useSocket();
  if (!isConnected) {
    return (
      <Badge variant="outline" className="bg-yellow-600 text-white border-none">
        Reconnecting
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="bg-emerald-600 text-white border-none">
      Online
    </Badge>
  );
};
