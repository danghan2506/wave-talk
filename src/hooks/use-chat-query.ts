"use client"; 
import qs from "query-string";
import { useParams } from "next/navigation";
import { useInfiniteQuery} from "@tanstack/react-query"; 
import { useSocket } from "@/components/provider/socket-provider"; 
interface ChatQueryProps {
    queryKey: string;
    apiUrl: string;
    paramKey: "channelId" | "conversationId";
    paramValue: string;
}
export const useChatQuery = ({ queryKey, apiUrl, paramKey, paramValue }: ChatQueryProps) => {
    // Lấy trạng thái kết nối socket
    const { isConnected } = useSocket();
    // Hàm Fetcher
    // Dùng Type cho pageParam để rõ ràng hơn
    const fetchMessages = async ({ pageParam }: { pageParam?: string }) => {
        const url = qs.stringifyUrl({
            url: apiUrl,
            query: {
                cursor: pageParam,
                [paramKey]: paramValue,
            },
        }, { skipNull: true });

        const res = await fetch(url);
        return res.json(); 
    };
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage, 
        status
    } = useInfiniteQuery({
        queryKey: [queryKey],
        queryFn: fetchMessages,
        initialPageParam: undefined, 
        getNextPageParam: (lastPage) => lastPage?.nextCursor ?? undefined,
        refetchInterval: 1000, 
    });
    return {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
    };
};