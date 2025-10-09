import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import ContentPage from "./content-page";

const root = document.createElement("div");
root.id = "__chat_yt_ai_whisper_container";
document.body.append(root);

createRoot(root).render(
  <StrictMode>
    <ContentPage />
  </StrictMode>
);
