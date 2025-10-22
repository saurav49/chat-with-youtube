import axios from "axios";

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
  const url = `${videoUrl}&t=${seconds}`;
  window.location.assign(url);
  // window.open(url, "_blank");
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

export {
  resolveQuery,
  handleTimestampClick,
  getYoutubeVideoId,
  askLlmInBackground,
};
