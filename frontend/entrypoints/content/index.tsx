import App from "./App";
import ReactDOM from "react-dom/client";
import React from "react";
import "./global.css";

export const PortalContext = React.createContext<HTMLElement | null>(null);

const ContentRoot = () => {
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(
    null
  );

  return (
    <React.StrictMode>
      <PortalContext.Provider value={portalContainer}>
        <div ref={setPortalContainer} id="chatyt-wxt">
          <App />
        </div>
      </PortalContext.Provider>
    </React.StrictMode>
  );
};

export default defineContentScript({
  matches: ["<all_urls>"],
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

    ui.mount();
  },
});
