import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Youtube, CircleX, ArrowRightIcon } from "lucide-react";
import ChatInterface from "./chat-interface";
import ChatForm from "./chat-form";
import { OWNER_ID, roles, exampleMessages } from "@/lib/utils";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { askLlmInBackground } from "@/lib/helper";

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
  chatHistory: Array<ChatHistoryType> | null;
  setChatHistory: React.Dispatch<
    React.SetStateAction<Array<ChatHistoryType> | null>
  >;
  convID: string | undefined;
};

const ChatBox = ({
  setIsOpenModal,
  url,
  videoId,
  chatHistory,
  setChatHistory,
  convID,
}: ChatBoxProps) => {
  const [chatMessage, setChatMessage] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const cardContentRef = useRef<HTMLDivElement | null>(null);
  const mutateMessage = useMutation(api.messages.createMessage);

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
      <div className="grid grid-cols-2 grid-rows-2 items-start !space-y-2 !gap-x-3 justify-start !mt-5">
        {exampleMessages.map((message, index) => (
          <Button
            key={index}
            onClick={(e) => {
              e.preventDefault();
              if (!convID) return;
              if (!videoId) return;
              const query = message.message;
              setIsLoading(true);
              const assistantId = `assistant-temp-${Date.now()}`;
              const userId = `user-temp-${Date.now()}`;
              setChatHistory((prev) =>
                prev && Array.isArray(prev) && prev.length > 0
                  ? [
                      ...prev,
                      {
                        _id: userId,
                        role: roles.USER,
                        content: query,
                        conversationId: convID,
                        senderId: OWNER_ID,
                      },
                      {
                        _id: assistantId,
                        role: roles.ASSISTANT,
                        content: "",
                        conversationId: convID,
                        senderId: OWNER_ID,
                      },
                    ]
                  : [
                      {
                        _id: userId,
                        role: roles.USER,
                        content: query,
                        conversationId: convID,
                        senderId: OWNER_ID,
                      },
                      {
                        _id: assistantId,
                        role: roles.ASSISTANT,
                        content: "",
                        conversationId: convID,
                        senderId: OWNER_ID,
                      },
                    ],
              );
              (async function () {
                try {
                  const r = await askLlmInBackground(query, videoId, url);
                  if (r && r?.ok) {
                    setChatHistory((prev) =>
                      prev && Array.isArray(prev) && prev.length > 0
                        ? prev.map((p) =>
                            p._id === assistantId
                              ? { ...p, content: r.data.data }
                              : { ...p },
                          )
                        : [
                            {
                              _id: assistantId,
                              role: roles.ASSISTANT,
                              content: r.data.data,
                              senderId: OWNER_ID,
                              conversationId: convID,
                            },
                          ],
                    );
                    mutateMessage({
                      content: query,
                      role: roles.USER,
                      conversationId: convID,
                      senderId: OWNER_ID,
                    });
                    mutateMessage({
                      content: r.data.data,
                      role: roles.ASSISTANT,
                      conversationId: convID,
                      senderId: OWNER_ID,
                    });
                  }
                  setIsLoading(false);
                } catch (e) {
                  console.error(e);
                }
              })();
            }}
            className="h-[45px] cursor-pointer w-full justify-start dark:bg-transparent border-[0.5px] !p-3 opacity-80 flex items-start whitespace-normal break-words text-left"
          >
            <ArrowRightIcon
              stroke="#fff"
              className="!mr-2 text-muted-foreground size-6 shrink-0"
            />
            <span className="!text-lg whitespace-normal break-words">
              {message.heading}
            </span>
          </Button>
        ))}
      </div>
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
        {videoId && (
          <ChatForm
            setChatMessage={setChatMessage}
            setIsLoading={setIsLoading}
            chatMessage={chatMessage}
            setChatHistory={setChatHistory}
            isLoading={isLoading}
            convID={convID}
            videoId={videoId}
            url={url}
          />
        )}
      </CardFooter>
    </Card>
  );
};

export default ChatBox;
