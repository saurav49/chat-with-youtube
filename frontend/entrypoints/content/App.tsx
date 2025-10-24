import { Button } from "@/components/ui/button";

import "@/assets/tailwind.css";
import { Youtube } from "lucide-react";
import useStoredUrl from "@/hooks/useStoredUrl";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { OWNER_ID } from "@/lib/utils";
import ChatBoxWrapper from "@/components/chat-box-wrapper";
import { debounce, fetchConversation } from "@/lib/helper";

export default function App() {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [chatHistory, setChatHistory] = useState<Array<ChatHistoryType> | null>(
    null,
  );
  const [convId, setConvId] = useState<string | undefined>(undefined);
  const [apiKey, setApiKey] = useState<string | undefined>(undefined);
  const { url, videoId } = useStoredUrl();
  const lastUrl = useRef<string | null>(url);
  const lastVideoId = useRef<string | null>(videoId);
  const convMutate = useMutation(api.conversations.createConversation);
  const { getKeyModel, setModel, setKeyModel } = useChromeStorage();
  useEffect(() => {
    if (url && videoId) {
      (async function () {
        await fetchConversation({
          convMutate,
          setConvId,
          videoId,
        });
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
  useEffect(() => {
    let mounted = true;
    const url = window.location.href;
    if (!mounted) return;
    const handleUrlChange = debounce((url: string) => {
      if (lastUrl.current !== url || lastVideoId.current !== videoId) {
        lastUrl.current = url;
        lastVideoId.current = videoId;
        if (!videoId) return;
        (async function () {
          const r = await fetchConversation({
            convMutate,
            setConvId,
            videoId,
          });
          if (r) {
            const messages = useQuery(api.messages.getMessages, {
              conversationId: r ?? ``,
              senderId: OWNER_ID,
            });
            if (messages && Array.isArray(messages) && messages.length > 0) {
              setChatHistory(messages);
            } else {
              setChatHistory(null);
              setIsOpenModal(false);
            }
          }
        })();
      }
    }, 300);

    const _push = history.pushState;
    history.pushState = function (...args: any[]) {
      const r = _push.apply(this, args as any);
      handleUrlChange(url);
      return r;
    };

    const _replace = history.replaceState;
    history.replaceState = function (...args: any[]) {
      const r = _replace.apply(this, args as any);
      handleUrlChange(url);
      return r;
    };

    document.addEventListener("yt-navigate-finish", () => handleUrlChange(url));
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "visible") handleUrlChange(url);
    });

    const obs = new MutationObserver(() => handleUrlChange(url));
    obs.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });

    return () => {
      mounted = false;
      obs.disconnect();
      history.pushState = _push;
      history.replaceState = _replace;
      document.removeEventListener("yt-navigate-finish", () =>
        handleUrlChange(url),
      );
      document.removeEventListener("visibilitychange", () =>
        handleUrlChange(url),
      );
    };
  }, [setChatHistory, setIsOpenModal]);
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
