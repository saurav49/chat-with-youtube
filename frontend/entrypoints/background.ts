import { getYoutubeVideoId } from "@/lib/helper";
import axios from "axios";

export default defineBackground(() => {
  console.log("Hello background!", { id: browser.runtime.id });
});

chrome.runtime.onMessage.addListener((msg, _sender, _sendResponse) => {
  if (msg?.type === "CHATYT_URL_UPDATE" && typeof msg.url === "string") {
    const url = msg.url;

    const vId = getYoutubeVideoId(url);
    chrome.storage.local.set({
      lastChatYtUrl: url,
      lastChatYtVideoId: vId,
      lastChatYtAt: Date.now(),
    });
  }
});

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type !== "LLM_QUERY") return;

  (async function () {
    try {
      const { key } = await chrome.storage.local.get("key");
      if (!key)
        return sendResponse({
          ok: false,
          error: "Missing API Key",
        });

      const { query, videoId } = msg.payload;
      const r = await axios.post(
        `http://localhost:3000/api/v1/query`,
        {
          query,
          videoId,
        },
        {
          headers: {
            Authorization: `Bearer ${key}`,
          },
        },
      );
      if (!r || (r.status !== 200 && r.status !== 201)) {
        return sendResponse({
          ok: false,
          error: `LLM Error ${r.status} `,
        });
      }
      sendResponse({
        ok: true,
        data: r.data,
      });
    } catch (e: any) {
      return sendResponse({
        ok: false,
        error: e?.message ?? `Request failed`,
      });
    }
  })();
  return true;
});

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type !== "TRANSCRIBE_VIDEO") return;

  (async function () {
    try {
      const { key } = await chrome.storage.local.get("key");

      if (!key)
        return sendResponse({
          ok: false,
          error: "Missing API Key",
        });

      const { url, videoId } = msg.payload;
      const r = await axios.post(
        `http://localhost:3000/api/v1/transcribe-video`,
        {
          url,
          videoId,
        },
        {
          headers: {
            Authorization: `Bearer ${key}`,
          },
        },
      );
      if (!r || (r.status !== 200 && r.status !== 201)) {
        return sendResponse({
          ok: false,
          error: `LLM Error ${r.status} `,
        });
      }
      sendResponse({
        ok: true,
        data: r.data,
      });
    } catch (e: any) {
      return sendResponse({
        ok: false,
        error: e?.message ?? `Request failed`,
      });
    }
  })();
  return true;
});

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg?.type === "SAVE_API_KEYS") {
    const { model, apiKey } = msg.payload;

    chrome.storage.local.set(
      {
        model: model,
        key: apiKey,
        lastKeySavedAt: Date.now(),
      },
      () => {
        sendResponse({
          ok: true,
          data: msg,
        });
      },
    );
    return true;
  }
});
