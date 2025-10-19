import { resolveQuery } from "@/lib/helper";
import React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { OWNER_ID, roles } from "@/lib/utils";

type ChatFormType = {
  setChatMessage: React.Dispatch<React.SetStateAction<string>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  chatMessage: string;
  setChatHistory: React.Dispatch<
    React.SetStateAction<ChatHistoryType[] | null>
  >;
  isLoading: boolean;
  convID: string | undefined;
};

const ChatForm = ({
  setChatMessage,
  setIsLoading,
  chatMessage,
  setChatHistory,
  isLoading,
  convID,
}: ChatFormType) => {
  const mutateMessage = useMutation(api.messages.createMessage);
  function handleOnSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!convID) return;
    const query = chatMessage;
    setChatMessage("");
    setIsLoading(true);
    const assistantId = `assistant-temp-${Date.now()}`;
    const userId = `user-temp-${Date.now()}`;
    setChatHistory((prev) =>
      prev
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
              _id: `${assistantId}`,
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
    mutateMessage({
      content: query,
      role: roles.USER,
      conversationId: convID,
      senderId: OWNER_ID,
    });
    (async function () {
      try {
        const r = await resolveQuery(query);
        if (r && r.status === 200) {
          setChatHistory((prev) =>
            prev
              ? prev.map((p) =>
                  p._id === `${assistantId}`
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
            content: r.data.data,
            role: roles.ASSISTANT,
            conversationId: convID,
            senderId: OWNER_ID,
          });
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
        disabled={isLoading || chatMessage.length == 0 || convID === undefined}
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
