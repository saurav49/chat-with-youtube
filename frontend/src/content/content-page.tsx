import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import axios from "axios";
import { Brain, Send } from "lucide-react";
import React from "react";

import ReactMarkdown from "react-markdown";
import { ClipLoader } from "react-spinners";
import remarkGfm from "remark-gfm";

const ContentPage = () => {
  const [isOpenModal, setIsOpenModal] = React.useState<boolean>(false);
  const [chatHistory, setChatHistory] = React.useState<Array<{
    id: string;
    type: "user" | "assistant";
    content: string;
  }> | null>(null);
  const [chatMessage, setChatMessage] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  async function resolveQuery(query: string) {
    const r = await axios.post(`http://localhost:3000/api/v1/query`, {
      query: query,
    });
    return r;
  }
  const handleTimestampClick = (seconds: number) => {
    const url = `https://www.youtube.com/watch?v=YFTqeVkhNqI&t=${seconds}`;
    window.open(url, "_blank");
  };
  return (
    <>
      {isOpenModal && (
        <Card className="border border-gray-200 fixed bottom-20 right-10 rounded-md w-[416px] h-[700px] bg-black shadow-md flex flex-col [&_div]:text-white px-4 py-6 justify-between">
          <CardHeader className="flex items-center gap-x-3 p-0">
            <div className="h-11 w-11 rounded-full flex items-center justify-center border border-white">
              <Brain size={"23"} />
            </div>
            <div className="flex flex-col items-start">
              <CardTitle className="text-lg font-semibold">
                Need help?
              </CardTitle>
              <CardDescription className="text-xs font-normal">
                Always online
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col overflow-y-scroll h-full my-4">
            <ScrollArea>
              {chatHistory &&
              Array.isArray(chatHistory) &&
              chatHistory.length > 0
                ? chatHistory.map((cm, idx) => {
                    const preprocessed = cm.content.replace(
                      /\[(\d{1,2}:\d{2})\]/g,
                      "[$1](ts:$1)"
                    );
                    return (
                      <div
                        key={idx}
                        className={`w-full flex [&_div]:text-start ${
                          idx !== chatHistory.length ? `mb-4` : ``
                        } ${
                          cm.type === "user"
                            ? `justify-end [&_div]:bg-white [&_span]:text-black`
                            : `justify-start [&_div]:bg-gray-700 [&_span]:text-white`
                        }`}
                      >
                        <div
                          className={`rounded-md max-w-2/3 [&_span]:text-sm py-2 px-3`}
                        >
                          {cm.type === "user" ? (
                            <span className="text-xs">{cm.content}</span>
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
                                          handleTimestampClick(seconds)
                                        }
                                        className="text-xs p-0 [&_span]:underline
                                        [&_span]:italic
                                        [&_span]:cursor-pointer my-1"
                                      >
                                        <span>{children}</span>
                                      </div>
                                    );
                                  }
                                  return (
                                    <a href={href as string}>{children}</a>
                                  );
                                },
                              }}
                            />
                          )}
                        </div>
                      </div>
                    );
                  })
                : null}
            </ScrollArea>
          </CardContent>
          <CardFooter className="w-full p-0">
            <form
              className="flex items-center gap-x-2 w-full"
              onSubmit={(e) => {
                e.preventDefault();
                const query = chatMessage;
                setChatMessage("");
                setIsLoading(true);
                setChatHistory((prev) =>
                  prev
                    ? [
                        ...prev,
                        {
                          id: `${prev.length + 1}`,
                          type: `user`,
                          content: query,
                        },
                      ]
                    : [
                        {
                          id: `1`,
                          type: `user`,
                          content: query,
                        },
                      ]
                );
                (async function () {
                  try {
                    const r = await resolveQuery(query);
                    if (r.status === 200) {
                      setChatHistory((prev) =>
                        prev
                          ? [
                              ...prev,
                              {
                                id: `${prev.length + 1}`,
                                type: "assistant",
                                content: r.data.data,
                              },
                            ]
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
              }}
            >
              <Input
                className="placeholder:text-sm"
                placeholder="Type your message here"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <ClipLoader
                    loading={isLoading}
                    size={15}
                    color="#fff"
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                ) : (
                  <Send stroke="#fff" />
                )}
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
      <div className="z-50 fixed bottom-10 right-10">
        <Button
          variant={"outline"}
          onClick={() => setIsOpenModal((prev) => !prev)}
        >
          <Brain stroke="#fff" />
        </Button>
      </div>
    </>
  );
};

export default ContentPage;
