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

export { cn, OWNER_ID, roles, VALID_MODELS, ValidModelTypes };
