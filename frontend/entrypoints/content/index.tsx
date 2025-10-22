import App from "./App";
import ReactDOM from "react-dom/client";
import React from "react";
import "./global.css";
import { ConvexProvider, ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

export const PortalContext = React.createContext<HTMLElement | null>(null);

const ContentRoot = () => {
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(
    null,
  );

  return (
    <React.StrictMode>
      <PortalContext.Provider value={portalContainer}>
        <div ref={setPortalContainer} id="chatyt-wxt">
          <ConvexProvider client={convex}>
            <App />
          </ConvexProvider>
        </div>
      </PortalContext.Provider>
    </React.StrictMode>
  );
};

function sendURLToBackground(url: string) {
  chrome.runtime.sendMessage({
    type: "CHATYT_URL_UPDATE",
    url,
  });
}

function debounce<T extends (...args: any[]) => void>(fn: T, ms: number) {
  let t: number | undefined;
  return (...args: Parameters<T>) => {
    if (t) clearTimeout(t);
    t = window.setTimeout(() => fn(...args), ms);
  };
}

export default defineContentScript({
  matches: [
    "https://www.youtube.com/watch*",
    "https://m.youtube.com/watch*",
    "https://youtube.com/watch*",
  ],
  cssInjectionMode: "ui",

  async main(ctx) {
    const ui = await createShadowRootUi(ctx, {
      name: "chatyt-wxt-container",
      position: "inline",
      anchor: "body",
      isolateEvents: ["keydown", "keyup", "keypress", "wheel"],
      onMount: (container) => {
        const app = document.createElement("main");
        app.id = "chatyt-app-dialog";
        const style = document.createElement("style");
        style.textContent = `
					@font-face {
						font-weight: normal;
						font-style: normal;
						font-display: swap;
					}
					#chatyt-app-dialog {
						font-family: 'Roboto', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
					}
				`;
        container.append(app);
        container.append(style);
        const root = ReactDOM.createRoot(app);
        root.render(<ContentRoot />);
        return root;
      },
      onRemove: (root) => {
        root?.unmount();
      },
    });

    (function setupURLWatcher() {
      sendURLToBackground(window?.location?.href);

      const d = debounce((url) => sendURLToBackground(url), 300);

      const _push = history.pushState;
      history.pushState = function (...args: any[]) {
        const r = _push.apply(this, args as any);
        d(window?.location?.href);
        return r;
      };

      const _replace = history.replaceState;
      history.replaceState = function (...args: any[]) {
        const r = _replace.apply(this, args as any);
        d(window?.location?.href);
        return r;
      };

      window.addEventListener("yt-navigate-finish", () =>
        d(window?.location?.href),
      );

      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") {
          d(window.location.href);
        }
      });
      window.addEventListener("focus", () => d(window.location.href));

      let lastKnownUrl = window.location.href;
      const obs = new MutationObserver(() => {
        const c = window.location.href;
        if (lastKnownUrl !== c) {
          lastKnownUrl = c;
          d(c);
        }
      });

      obs.observe(document.documentElement, {
        childList: true,
        subtree: true,
      });
    })();

    ui.mount();
  },
});
