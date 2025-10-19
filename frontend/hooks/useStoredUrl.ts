const useStoredUrl = () => {
  const [url, setUrl] = useState<string | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);
  useEffect(() => {
    let mounted = true;

    (async function () {
      if (!mounted) return;

      const url = await chrome.storage.local.get("lastChatYtUrl");
      setUrl(url.lastChatYtUrl);
      const vID = await chrome.storage.local.get("lastChatYtVideoId");
      setVideoId(vID.lastChatYtVideoId);
      const key = await chrome.storage.local.get("apiKey");
      setApiKey(key.apiKey);
    })();

    const changeHandler = (changes: {
      [k: string]: chrome.storage.StorageChange;
    }) => {
      if (changes.lastChatYtUrl?.newValue !== undefined) {
        setUrl(changes.lastChatYtUrl.newValue ?? null);
      }
      if (changes.lastChatYtVideoId?.newValue !== undefined) {
        setVideoId(changes.lastChatYtVideoId.newValue ?? null);
      }
      if (changes.apiKey?.newValue !== undefined) {
        setApiKey(changes.apiKey.newValue ?? null);
      }
    };

    chrome.storage.onChanged.addListener(changeHandler);

    return () => {
      mounted = false;
      chrome.storage.onChanged.removeListener(changeHandler);
    };
  }, []);
  return {
    url,
    videoId,
    apiKey,
  };
};

export default useStoredUrl;
