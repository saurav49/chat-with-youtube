import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Youtube, CircleX } from "lucide-react";
import ChatInterface from "./chat-interface";
import ChatForm from "./chat-form";

import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { OWNER_ID } from "@/lib/utils";

export type ChatHistoryType = {
  content: string;
  conversationId: string;
  createdAt?: string;
  role: "USER" | "ASSISTANT";
  senderId: string;
  _creationTime?: number;
  _id?: string;
};

type ChatBoxProps = {
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  url: string;
  videoId: string | null;
};

const ChatBox = ({ setIsOpenModal, url, videoId }: ChatBoxProps) => {
  const conversations = useQuery(api.conversations.getConversation, {
    ownerId: OWNER_ID,
    videoId: videoId ?? ``,
  });
  const convID =
    conversations && Array.isArray(conversations) && conversations.length > 0
      ? conversations[0]._id
      : undefined;
  const messages = useQuery(api.messages.getMessages, {
    conversationId: convID ?? ``,
    senderId: OWNER_ID,
  });
  const [chatHistory, setChatHistory] =
    React.useState<Array<ChatHistoryType> | null>(null);
  const [chatMessage, setChatMessage] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const cardContentRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (messages && Array.isArray(messages) && messages.length > 0) {
      setChatHistory(messages);
    }
  }, [messages]);

  return (
    <Card
      className="bg-stone-800 shadow-md flex flex-col [&_div]:text-white gap-y-2 fixed bottom-28 right-5 w-[400px] h-[550px] z-[9999451]"
      style={{
        borderRadius: "8px",
        padding: "24px 16px",
      }}
    >
      <CardHeader className="flex items-center gap-x-3 p-0 relative">
        <div className="h-18 w-18 rounded-full flex items-center justify-center bg-red-500 cursor-pointer hover:bg-red-400">
          <Youtube className="size-9" />
        </div>
        <div className="flex flex-col items-start">
          <CardTitle
            className="font-semibold"
            style={{
              fontSize: "18px",
              lineHeight: 1.5,
            }}
          >
            ChatYT
          </CardTitle>
          <CardDescription
            className="font-normal"
            style={{
              fontSize: "12px",
              lineHeight: 1.3,
            }}
          >
            Always online
          </CardDescription>
        </div>
        <button
          type="button"
          className="absolute top-[-5px] right-2 border-none background-none cursor-pointer"
          onClick={() => setIsOpenModal(false)}
        >
          <CircleX size="18" />
        </button>
      </CardHeader>
      <CardContent
        ref={cardContentRef}
        className="flex h-full flex-col overflow-y-auto"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          margin: "8px 0px",
        }}
      >
        <ChatInterface
          chatHistory={chatHistory}
          videoUrl={url}
          cardContentRef={cardContentRef}
        />
      </CardContent>
      <CardFooter className="w-full p-0">
        <ChatForm
          setChatMessage={setChatMessage}
          setIsLoading={setIsLoading}
          chatMessage={chatMessage}
          setChatHistory={setChatHistory}
          isLoading={isLoading}
          convID={convID}
        />
      </CardFooter>
    </Card>
  );
};

export default ChatBox;
