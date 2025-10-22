const useChromeStorage = () => {
  return {
    getKeyModel: async () => {
      const { model } = await chrome.storage.local.get("model");
      const { key } = await chrome.storage.local.get("key");
      return {
        model,
        key,
      };
    },
    setKeyModel: async (apiKey: string) => {
      chrome?.storage?.local.set({
        ["key"]: apiKey,
      });
    },
    getModel: async () => {
      const result = await chrome.storage.local.get("model");
      return result["model"];
    },
    setModel: async (model: string) => {
      chrome?.storage?.local.set({
        ["model"]: model,
      });
    },
    setCurrentVideoId: async (videoId: string) => {
      chrome?.storage?.local.set({
        ["videoId"]: videoId,
      });
    },
    setCurrentVideoUrl: async (videoUrl: string) => {
      chrome?.storage?.local.set({
        ["url"]: videoUrl,
      });
    },
    getCurrentVideoUrl: async () => {
      const result = await chrome?.storage?.local.get("url");
      return result["url"];
    },
  };
};

export default useChromeStorage;
