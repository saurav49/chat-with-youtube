import { Button } from "@/components/ui/button";

import "@/assets/tailwind.css";
import { Youtube } from "lucide-react";
import ChatBox from "@/components/chat-box";
import useStoredUrl from "@/hooks/useStoredUrl";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { OWNER_ID } from "@/lib/utils";

export default function App() {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const { url, videoId } = useStoredUrl();
  const convMutate = useMutation(api.conversations.createConversation);
  useEffect(() => {
    if (url && videoId) {
      convMutate({
        ownerId: OWNER_ID,
        videoId: videoId,
      });
    }
  }, [videoId, url]);

  return (
    <>
      {isOpenModal && url && (
        <ChatBox url={url} videoId={videoId} setIsOpenModal={setIsOpenModal} />
      )}
      <Button
        className="fixed flex items-center justify-center bottom-5 right-5 z-[9999451] w-20 h-20 rounded-full bg-red-500 cursor-pointer hover:bg-red-400"
        onClick={() => setIsOpenModal((prev) => !prev)}
      >
        <Youtube className="size-9" />
      </Button>
    </>
  );
}
