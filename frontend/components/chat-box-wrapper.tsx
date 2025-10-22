import ChatBox from "./chat-box";
import { OWNER_ID } from "@/lib/utils";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

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
    if (messages && Array.isArray(messages) && messages.length > 0) {
      setChatHistory(messages);
    }
  }, [messages]);
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
