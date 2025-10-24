import { api } from "@/convex/_generated/api";
import { OWNER_ID } from "@/lib/utils";
import ChatBox, { ChatHistoryType } from "./chat-box";
import { useQuery } from "convex/react";

type ChatBoxWrapperProps = {
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  url: string | null;
  videoId: string | null;
  chatHistory: Array<ChatHistoryType> | null;
  setChatHistory: React.Dispatch<
    React.SetStateAction<Array<ChatHistoryType> | null>
  >;
  convID: string | undefined;
  isOpenModal: boolean;
};

const ChatBoxWrapper = ({
  setIsOpenModal,
  url,
  videoId,
  chatHistory,
  setChatHistory,
  convID,
  isOpenModal,
}: ChatBoxWrapperProps) => {
  const messages = useQuery(api.messages.getMessages, {
    conversationId: convID ?? ``,
    senderId: OWNER_ID,
  });
  useEffect(() => {
    if (
      url &&
      videoId &&
      messages &&
      Array.isArray(messages) &&
      messages.length > 0
    ) {
      setChatHistory(messages);
    } else {
      setChatHistory(null);
    }
  }, [url, videoId, isOpenModal, convID]);
  useEffect(() => {
    if (url && videoId) {
      const r = new Promise((resolve) => {
        chrome.runtime.sendMessage(
          {
            type: "TRANSCRIBE_VIDEO",
            payload: {
              videoId,
              url,
            },
          },
          (res) => {
            if (chrome.runtime.lastError) {
              // @ts-expect-error
              resolve({ ok: false, error: chrome.runtime.lastError.message });
            } else {
              resolve(
                res ?? {
                  ok: true,
                },
              );
            }
          },
        );
      }) as Promise<{
        ok: boolean;
      }>;
      r.then((res) => {
        if (res && res?.ok) {
          console.log(
            `video id : ${videoId}, url : ${url} transcribed successfully`,
          );
        }
      });
    }
  }, []);
  return (
    <>
      {isOpenModal && url && (
        <ChatBox
          url={url}
          videoId={videoId}
          setIsOpenModal={setIsOpenModal}
          chatHistory={chatHistory}
          convID={convID}
          setChatHistory={setChatHistory}
        />
      )}
    </>
  );
};

export default ChatBoxWrapper;
