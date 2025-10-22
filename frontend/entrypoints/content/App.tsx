import { Button } from "@/components/ui/button";

import "@/assets/tailwind.css";
import { Youtube } from "lucide-react";
import useStoredUrl from "@/hooks/useStoredUrl";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { OWNER_ID } from "@/lib/utils";
import ChatBoxWrapper from "@/components/chat-box-wrapper";

export default function App() {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [chatHistory, setChatHistory] = useState<Array<ChatHistoryType> | null>(
    null,
  );
  const [convId, setConvId] = useState<string | undefined>(undefined);
  const [apiKey, setApiKey] = useState<string | undefined>(undefined);
  const { url, videoId } = useStoredUrl();
  const convMutate = useMutation(api.conversations.createConversation);
  const { getKeyModel, setModel, setKeyModel } = useChromeStorage();
  useEffect(() => {
    if (url && videoId) {
      (async function () {
        const conversations = await convMutate({
          ownerId: OWNER_ID,
          videoId: videoId,
        });
        const convID =
          conversations &&
          Array.isArray(conversations) &&
          conversations.length > 0
            ? conversations[0]._id
            : undefined;
        setConvId(convID);
        const k = await getKeyModel();
        setApiKey(k.key);
        if (!apiKey && !k?.key) {
          alert(`Please enter your API Key`);
          return;
        }
      })();
    }
  }, [url, videoId]);
  useEffect(() => {
    function onChange(changes: any, area: any) {
      if (area !== "local") {
        chrome.storage.onChanged.removeListener(onChange);
        return;
      }
      const changesKey = Object.keys(changes);
      for (const key of changesKey) {
        if (key === "model") setModel(changes.model.newValue);
        if (key === "key") {
          setKeyModel(changes.key.newValue);
          setApiKey(changes.key.newValue);
        }
      }
    }
    chrome.storage.onChanged.addListener(onChange);
    return () => chrome.storage.onChanged.removeListener(onChange);
  }, []);
  return (
    <>
      <ChatBoxWrapper
        url={url}
        videoId={videoId}
        setIsOpenModal={setIsOpenModal}
        chatHistory={chatHistory}
        convID={convId}
        setChatHistory={setChatHistory}
        isOpenModal={isOpenModal}
      />
      {apiKey && (
        <Button
          className="fixed flex items-center justify-center bottom-5 right-5 z-[9999451] w-20 h-20 rounded-full bg-red-500 cursor-pointer hover:bg-red-400"
          onClick={() => setIsOpenModal((prev) => !prev)}
        >
          <Youtube className="size-9" />
        </Button>
      )}
    </>
  );
}
