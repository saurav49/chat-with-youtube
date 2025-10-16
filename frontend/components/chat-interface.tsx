import { handleTimestampClick } from "@/lib/helper";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type ChatInterfaceType = {
  chatHistory: ChatHistoryType[] | null;
  videoUrl: string;
  cardContentRef: React.RefObject<HTMLDivElement | null>;
};

const ChatInterface = ({
  chatHistory,
  videoUrl,
  cardContentRef,
}: ChatInterfaceType) => {
  const chatRef = useRef<HTMLDivElement | null>(null);
  const lastKnownChat =
    chatHistory && Array.isArray(chatHistory) && chatHistory.length > 0
      ? chatHistory[chatHistory.length - 1]
      : null;
  useEffect(() => {
    if (chatRef?.current && cardContentRef?.current) {
      if (
        lastKnownChat?.role === "ASSISTANT" &&
        typeof lastKnownChat.content === "string" &&
        lastKnownChat.content.length > 0
      ) {
        cardContentRef.current.scrollTo({
          top: chatRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    }
  }, [lastKnownChat]);
  return (
    <>
      {chatHistory && Array.isArray(chatHistory) && chatHistory.length > 0
        ? chatHistory.map((cm, idx) => {
            const preprocessed = cm.content.replace(
              /\[(\d{1,2}:\d{2})\]/g,
              "[$1](ts:$1)"
            );
            return (
              <div
                ref={chatRef}
                key={idx}
                className={`w-full flex [&_div]:text-start ${
                  cm.role === "USER" ? "justify-end" : "justify-start"
                }`}
                style={
                  idx !== chatHistory.length ? { marginBottom: "16px" } : {}
                }
              >
                <div
                  className={`[&_p]:text-[14px] [&_ul]:text-[14px] text-white rounded-lg ${
                    cm.role === "USER"
                      ? "bg-red-500 !rounded-[16px_0px_16px_16px]"
                      : "bg-gray-600 !rounded-[0px_16px_16px_16px]"
                  } ${
                    typeof cm.content === "string" && cm.content.length === 0
                      ? "rounded-full !py-[10px] !px-[12px] !w-[60px] h-[40px]"
                      : "max-w-2/3 !py-[10px] !px-[12px]"
                  } ${
                    cm.role === "ASSISTANT" &&
                    typeof cm.content === "string" &&
                    cm.content.length === 0
                      ? "flex items-center gap-x-2"
                      : ""
                  }`}
                >
                  {cm.role === "USER" ? (
                    <p>{cm.content}</p>
                  ) : (
                    <>
                      {cm.role === "ASSISTANT" &&
                      typeof cm.content === "string" &&
                      cm.content.length === 0 ? (
                        <AnimatedTyping />
                      ) : (
                        <ReactMarkdown
                          children={preprocessed}
                          remarkPlugins={[remarkGfm]}
                          components={{
                            a({ href, children }) {
                              const parts =
                                children && typeof children === "string"
                                  ? children.split(":").reverse()
                                  : undefined;
                              if (
                                parts &&
                                Array.isArray(parts) &&
                                parts.length > 0
                              ) {
                                let seconds = 0;
                                if (parts[0]) seconds += +parts[0];
                                if (parts[1]) seconds += +parts[1] * 60;
                                if (parts[2]) seconds += +parts[2] * 3600;
                                return (
                                  <div
                                    onClick={() =>
                                      handleTimestampClick(seconds, videoUrl)
                                    }
                                    style={{
                                      padding: "0px",
                                    }}
                                  >
                                    <span
                                      style={{
                                        cursor: "pointer",
                                        margin: "4px 0px",
                                        fontStyle: "italic",
                                        textDecoration: "underline",
                                      }}
                                    >
                                      {children}
                                    </span>
                                  </div>
                                );
                              }
                              return <a href={href as string}>{children}</a>;
                            },
                          }}
                        />
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })
        : null}
    </>
  );
};

export default ChatInterface;
