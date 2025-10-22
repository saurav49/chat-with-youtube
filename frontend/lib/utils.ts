import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const OWNER_ID = `101`;
const roles: Record<"USER" | "ASSISTANT", "USER" | "ASSISTANT"> = {
  USER: `USER`,
  ASSISTANT: `ASSISTANT`,
};

const VALID_MODELS: Record<
  ValidModelTypes,
  {
    model: ValidModelTypes;
    name: string;
  }
> = {
  "gpt-4o-mini": {
    model: "gpt-4o-mini",
    name: "GPT4 o mini",
  },
  "gemini_1.5_pro": {
    model: "gemini_1.5_pro",
    name: "Gemini 1.5 Pro (Latest)",
  },
};

type ValidModelTypes = "gpt-4o-mini" | "gemini_1.5_pro";

const exampleMessages = [
  {
    heading: "What is the video about?",
    message: "Can you tell me about the video?",
  },
  {
    heading: "What are the key points?",
    message: "What are the key points of the video?",
  },
  {
    heading: "What are the main takeaways?",
    message: "What are the main takeaways of the video?",
  },
  {
    heading: "What are the main topics?",
    message: "What are the main topics discussed in the video?",
  },
];

export { cn, OWNER_ID, roles, VALID_MODELS, ValidModelTypes, exampleMessages };
