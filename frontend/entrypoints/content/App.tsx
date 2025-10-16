import { Button } from "@/components/ui/button";

import "@/assets/tailwind.css";
import { Youtube } from "lucide-react";
import ChatBox from "@/components/chat-box";

export default function App() {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  return (
    <>
      {isOpenModal && (
        <ChatBox
          videoUrl="https://www.youtube.com/watch?app=desktop&v=YFTqeVkhNqI"
          setIsOpenModal={setIsOpenModal}
        />
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

// <div className="fixed bottom-28 right-5 w-[400px] h-[550px] rounded-md bg-background z-[9999451]"></div>

// className="fixed top-2 min-h-[400px] right-2 min-w-[400px] bg-background z-[9999451] rounded-lg flex justify-center items-center p-4"
