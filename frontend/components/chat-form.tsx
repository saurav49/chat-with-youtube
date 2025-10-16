import { resolveQuery } from "@/lib/helper";
import React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Send } from "lucide-react";

type ChatFormType = {
  setChatMessage: React.Dispatch<React.SetStateAction<string>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  chatMessage: string;
  chatHistory: ChatHistoryType[] | null;
  setChatHistory: React.Dispatch<
    React.SetStateAction<ChatHistoryType[] | null>
  >;
  isLoading: boolean;
};

const ChatForm = ({
  setChatMessage,
  setIsLoading,
  chatMessage,
  chatHistory,
  setChatHistory,
  isLoading,
}: ChatFormType) => {
  function handleOnSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const query = chatMessage;
    setChatMessage("");
    setIsLoading(true);
    const assistantId =
      chatHistory && Array.isArray(chatHistory) && chatHistory.length > 0
        ? chatHistory.length + 2
        : 2;
    setChatHistory((prev) =>
      prev
        ? [
            ...prev,
            {
              id: `${prev.length + 1}`,
              type: `user`,
              content: query,
            },
            {
              id: `${assistantId}`,
              type: `assistant`,
              content: "",
            },
          ]
        : [
            {
              id: `1`,
              type: `user`,
              content: query,
            },
            {
              id: `${assistantId}`,
              type: `assistant`,
              content: "",
            },
          ]
    );
    (async function () {
      try {
        const r = await resolveQuery(query);
        if (r && r.status === 200) {
          setChatHistory((prev) =>
            prev
              ? prev.map((p) =>
                  p.id === `${assistantId}`
                    ? { ...p, content: r.data.data }
                    : { ...p }
                )
              : [
                  {
                    id: `1`,
                    type: "assistant",
                    content: r.data.data,
                  },
                ]
          );
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    })();
  }
  return (
    <form
      className="flex items-center h-16 gap-x-3 w-full"
      onSubmit={handleOnSubmit}
    >
      <Input
        className="border border-neutral-700 text-sm h-full bg-neutral-900 placeholder:text-[14px] placeholder:text-white/80"
        placeholder="Type your message here"
        value={chatMessage}
        onChange={(e) => setChatMessage(e.target.value)}
        style={{
          fontSize: "16px",
          padding: "14px 10px",
          borderRadius: "8px",
        }}
      />
      <Button
        type="submit"
        disabled={isLoading || chatMessage.length == 0}
        className="bg-red-500 cursor-pointer hover:bg-red-400 rounded-lg flex items-center justify-center h-full w-20"
      >
        {isLoading ? (
          <>
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                border: "2px solid rgba(255,255,255,0.25)",
                borderTopColor: "#fff",
                animation: "spin 0.8s linear infinite",
              }}
            />
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
          </>
        ) : (
          <Send stroke="#fff" className="size-7" />
        )}
      </Button>
    </form>
  );
};

export default ChatForm;
