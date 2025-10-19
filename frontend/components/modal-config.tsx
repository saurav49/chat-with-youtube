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
import useChromeStorage from "@/hooks/useChromeStorage";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const ModalConfig = () => {
  const selectRef = React.useRef<HTMLSelectElement | null>(null);
  const [isShowValue, setIsShowValue] = React.useState<boolean>(false);
  const [selectedModel, setSelectedModel] = React.useState<string>("");
  const [apiKey, setApiKey] = React.useState<string>("");
  const { setModel, setKeyModel } = useChromeStorage();
  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setModel(selectedModel);
    setKeyModel({
      apiKey,
      model: selectedModel,
    });
    setSelectedModel("");
    setApiKey("");
  }
  return (
    <Card className="flex flex-col items-center bg-slate-950 !gap-y-1 !py-10 !px-5 border-none">
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
              className="!mt-3 text-white placeholder:text-sm placeholder:!text-white !px-3"
              placeholder="Enter your API key"
              value={apiKey}
              type={isShowValue ? "text" : "password"}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <div
              className="absolute cursor-pointer rounded-full top-5 right-6 [_&]:text-white hover:[_&]:text-white"
              onClick={() => setIsShowValue((prev) => !prev)}
              style={{
                background: "none",
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
          <Sparkles />
          Set API Key
        </Button>
      </form>
    </Card>
  );
};

export default ModalConfig;
