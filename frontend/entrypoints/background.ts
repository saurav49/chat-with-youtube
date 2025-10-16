import { getYoutubeVideoId } from "@/lib/helper";

export default defineBackground(() => {
  console.log("Hello background!", { id: browser.runtime.id });
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
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
