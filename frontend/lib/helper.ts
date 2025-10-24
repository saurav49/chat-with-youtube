import { Id } from "@/convex/_generated/dataModel";
import axios from "axios";
import { ReactMutation } from "convex/react";
import { FunctionReference } from "convex/server";
import { OWNER_ID } from "./utils";

async function resolveQuery(query: string) {
  try {
    const r = await axios.post(`http://localhost:3000/api/v1/query`, {
      query: query,
    });
    return r;
  } catch (e) {
    console.error(`Error:`, e);
  }
}
function handleTimestampClick(seconds: number, videoUrl: string) {
  const url = new URL(videoUrl);
  if (seconds && seconds > 0) {
    url.searchParams.delete("t");
    url.searchParams.append("t", seconds.toString());
  }
  window.location.assign(url);
}
function getYoutubeVideoId(url: string) {
  if (!url) return null;
  const videoUrl = new URL(url);
  const videoId = videoUrl.searchParams.get("v");
  return videoId;
}
function askLlmInBackground(
  query: string,
  videoId: string,
  url: string,
): Promise<{
  ok: boolean;
  data: { status: string; data: string };
}> {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(
      {
        type: "LLM_QUERY",
        payload: {
          query,
          videoId,
          url,
        },
      },
      (res) => {
        if (chrome.runtime.lastError) {
          resolve({
            ok: false,
            // @ts-expect-error
            error: (chrome.runtime.lastError.message as string) ?? `llm error`,
          });
        } else {
          resolve(
            res ?? {
              ok: true,
            },
          );
        }
      },
    );
  });
}
function debounce<T extends (...args: any[]) => void>(fn: T, ms: number) {
  let t: number | undefined;
  return (...args: Parameters<T>) => {
    if (t) clearTimeout(t);
    t = window.setTimeout(() => fn(...args), ms);
  };
}
async function fetchConversation({
  setConvId,
  convMutate,
  videoId,
}: {
  setConvId: React.Dispatch<React.SetStateAction<string | undefined>>;
  convMutate: ReactMutation<
    FunctionReference<
      "mutation",
      "public",
      {
        videoId: string;
        ownerId: string;
      },
      | Id<"conversations">
      | {
          _id: Id<"conversations">;
          _creationTime: number;
          videoId: string;
          ownerId: string;
          createdAt: string;
        }[],
      string | undefined
    >
  >;
  videoId: string;
}) {
  const conversations = await convMutate({
    ownerId: OWNER_ID,
    videoId: videoId,
  });
  const convID =
    conversations && Array.isArray(conversations) && conversations.length > 0
      ? conversations[0]._id
      : undefined;
  setConvId(convID);
  return convID;
}
export {
  fetchConversation,
  resolveQuery,
  handleTimestampClick,
  getYoutubeVideoId,
  askLlmInBackground,
  debounce,
};
