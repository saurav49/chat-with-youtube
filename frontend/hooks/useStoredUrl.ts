const useStoredUrl = () => {
  const [url, setUrl] = useState<string | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);
  useEffect(() => {
    let mounted = true;

    (async function () {
      if (!mounted) return;

      const url = await chrome.storage.local.get("lastChatYtUrl");
      setUrl(url.lastChatYtUrl);
      const vID = await chrome.storage.local.get("lastChatYtVideoId");
      setVideoId(vID.lastChatYtVideoId);
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
  };
};

export default useStoredUrl;
