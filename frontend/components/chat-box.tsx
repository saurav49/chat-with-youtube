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

export type ChatHistoryType = {
  id: string;
  type: "user" | "assistant";
  content: string;
};

type ChatBoxProps = {
  videoUrl: string;
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const ChatBox = ({ videoUrl, setIsOpenModal }: ChatBoxProps) => {
  const [chatHistory, setChatHistory] =
    React.useState<Array<ChatHistoryType> | null>(
      //   [
      //   {
      //     id: `1`,
      //     type: `user`,
      //     content: `how did maxine dupree won the match?`,
      //   },
      //   // {
      //   //   id: `2`,
      //   //   type: `assistant`,
      //   //   content: "",
      //   // },
      //   {
      //     id: `2`,
      //     type: `assistant`,
      //     content: `Maxine surprised the audience with her impressive performance in the match, showcasing unexpected sustained offense. Initially underestimated, she revitalized the crowd's excitement with back-to-back nearfalls and a key ankle lock. The atmosphere intensified as she executed a German suplex followed by a powerful kick, leading to a dramatic conclusion.\n\nHer primary strategy included applying pressure with grappling moves and capitalizing on her opponent's vulnerabilities. By maintaining a high energy level and leveraging crowd support, Maxine not only secured the victory but also became the highlight of the match.\n\n- Maxine delivered surprising sustained offense, leading to nearfalls. [03:44]\n- An ankle lock tactic further excited the crowd during the match. [03:50]\n- The intensity escalated with back-and-forth cradle attempts. [03:56]\n- A pivotal German suplex executed by Maxine showcased her skill. [04:02]\n- The match concluded with a powerful kick that secured her victory. [04:08]`,
      //   },
      // ]
      null
    );
  const [chatMessage, setChatMessage] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const cardContentRef = useRef<HTMLDivElement | null>(null);
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
        className="flex h-full flex-col overflow-y-auto border border-yellow-500"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          margin: "8px 0px",
        }}
      >
        <ChatInterface
          chatHistory={chatHistory}
          videoUrl={videoUrl}
          cardContentRef={cardContentRef}
        />
      </CardContent>
      <CardFooter className="w-full p-0">
        <ChatForm
          setChatMessage={setChatMessage}
          setIsLoading={setIsLoading}
          chatMessage={chatMessage}
          chatHistory={chatHistory}
          setChatHistory={setChatHistory}
          isLoading={isLoading}
        />
      </CardFooter>
    </Card>
  );
};

export default ChatBox;
