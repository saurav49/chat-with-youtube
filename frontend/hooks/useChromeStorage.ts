const useChromeStorage = () => {
  return {
    getKeyModel: async (model: string) => {
      const result = await chrome.storage.local.get(model);
      console.log({ result });
      return {
        model: model,
        apiKey: result[model],
      };
    },
    setKeyModel: async ({
      apiKey,
      model,
    }: {
      apiKey: string;
      model: string;
    }) => {
      chrome?.storage?.local.set({
        [model]: apiKey,
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
