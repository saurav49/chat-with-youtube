import React from "react";
import { Card } from "./ui/card";
import {
  Bot,
  ChevronDown,
  Eye,
  EyeOff,
  KeyRound,
  Sparkles,
} from "lucide-react";
import { VALID_MODELS } from "@/lib/utils";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { ModalConfigType } from "@/entrypoints/popup/App";

const ModalConfig = ({
  setIsOpenModalConfig,
}: {
  setIsOpenModalConfig: React.Dispatch<React.SetStateAction<ModalConfigType>>;
}) => {
  const selectRef = React.useRef<HTMLSelectElement | null>(null);
  const [isShowValue, setIsShowValue] = React.useState<boolean>(false);
  const [selectedModel, setSelectedModel] = React.useState<string>("");
  const [apiKey, setApiKey] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    chrome.runtime.sendMessage(
      {
        type: "SAVE_API_KEYS",
        payload: {
          model: selectedModel,
          apiKey,
        },
      },
      (res) => {
        if (res && res.ok) {
          toast.success("API keys saved successfully!");
          setIsOpenModalConfig((prev) => ({
            ...prev,
            isOpenConfig: false,
            isOpenLoading: true,
            isOpenSuccess: false,
          }));
        }
        setSelectedModel("");
        setApiKey("");
        setIsLoading(false);
      },
    );
  }
  return (
    <Card className="flex h-[600px] flex-col items-center bg-slate-950 !gap-y-1 !py-10 !px-5 border-none">
      <h2 className="text-white text-lg font-semibold">ChatYT</h2>
      <p className="text-sm font-medium text-slate-300">
        Ask questions about the current YouTube video
      </p>
      <form
        className="!mt-7 bg-stone-800 flex flex-col items-center !p-7 justify-center rounded-md"
        onSubmit={handleFormSubmit}
      >
        <h2 className="text-white text-lg font-semibold !mb-2">
          Connect with ChatYT
        </h2>
        <p className="text-sm font-medium text-slate-300">
          Enter your API key to unlock AI-powered video analysis
        </p>
        <div className="w-full !mt-8 !gap-y-1">
          <div className="flex items-center gap-x-2">
            <Bot stroke="#fff" className="size-4" />
            <label className="text-white text-sm font-semibold" htmlFor="model">
              Select Model
            </label>
          </div>
          <div className="relative w-full">
            <select
              ref={selectRef}
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="appearance-none text-white !mt-2 border border-white w-full rounded-md !px-3 !py-2 text-sm"
            >
              <option className="text-white bg-slate-900 text-sm" value={""}>
                Select model
              </option>
              {Object.keys(VALID_MODELS).map((key) => (
                <option
                  key={key}
                  className="text-white bg-slate-900 text-sm"
                  value={key}
                >
                  {VALID_MODELS[key as keyof typeof VALID_MODELS].name}
                </option>
              ))}
            </select>
            <div
              className="absolute top-4 right-5"
              onClick={() => {
                if (selectRef && selectRef?.current) {
                  selectRef.current.focus();
                  selectRef.current.click();
                }
              }}
              style={{
                background: "none",
                border: "none",
              }}
            >
              <ChevronDown stroke="white" />
            </div>
          </div>
        </div>
        <div className="w-full !mt-8 !gap-y-1">
          <div className="flex items-center !gap-x-2">
            <KeyRound stroke="#fff" className="size-4" />
            <label
              className="text-white text-sm font-semibold"
              htmlFor="api-key"
            >
              API Key
            </label>
          </div>
          <div className="relative">
            <Input
              name="api-key"
              className="!mt-3 text-white placeholder:text-sm placeholder:!text-white !pl-3 !pr-14 "
              placeholder="Enter your API key"
              value={apiKey}
              type={isShowValue ? "text" : "password"}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <div
              className="absolute cursor-pointer rounded-full top-[21px] right-6 [_&]:text-white hover:[_&]:text-white"
              onClick={() => setIsShowValue((prev) => !prev)}
              style={{
                border: "none",
              }}
            >
              {isShowValue ? (
                <EyeOff className="size-5" />
              ) : (
                <Eye className="size-5" />
              )}
            </div>
          </div>
        </div>
        <Button
          type="submit"
          className="!mt-8 !mb-3 !py-5 w-full"
          disabled={!apiKey || !selectedModel}
        >
          <>
            {isLoading ? (
              <>
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    border: "2px solid rgba(255,255,255,0.25)",
                    borderTopColor: "#fff",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
                <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
              </>
            ) : (
              <Sparkles />
            )}
          </>
          <>{isLoading ? "Processing..." : "Set API Key"}</>
        </Button>
      </form>
    </Card>
  );
};

export default ModalConfig;
