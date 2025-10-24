import React from "react";
import { Card } from "./ui/card";
import { Sparkle, Youtube } from "lucide-react";
import useStoredUrl from "@/hooks/useStoredUrl";
import { toast } from "sonner";
import { ModalConfigType } from "@/entrypoints/popup/App";

const LoadingComponent = ({
  setIsOpenModalConfig,
}: {
  setIsOpenModalConfig: React.Dispatch<React.SetStateAction<ModalConfigType>>;
}) => {
  const { url, videoId } = useStoredUrl();
  React.useEffect(() => {
    if (url && videoId) {
      const r = new Promise((resolve) => {
        chrome.runtime.sendMessage(
          {
            type: "TRANSCRIBE_VIDEO",
            payload: {
              videoId,
              url,
            },
          },
          (res) => {
            if (chrome.runtime.lastError) {
              // @ts-expect-error
              resolve({ ok: false, error: chrome.runtime.lastError.message });
            } else {
              resolve(
                res ?? {
                  ok: true,
                },
              );
            }
          },
        );
      }) as Promise<{
        ok: boolean;
      }>;
      r.then((res) => {
        if (res && res?.ok) {
          toast.success("Video Transcribed Successfully");
          setIsOpenModalConfig((prev) => ({
            ...prev,
            isOpenConfig: false,
            isOpenLoading: false,
            isOpenSuccess: true,
          }));
        }
      });
    }
  }, [url, videoId]);
  return (
    <Card className="flex rounded-none !h-[560px] flex-col items-center justify-center bg-slate-950 !gap-y-1 !py-10 border-none">
      <div className="bg-stone-800 w-[400px] flex flex-col items-center !px-7 !py-10 justify-center rounded-md !gap-y-2">
        <div className="h-14 w-14 rounded-full flex items-center justify-center bg-red-500 cursor-pointer hover:bg-red-400">
          <Youtube className="size-7" stroke="#fff" />
        </div>
        <h2 className="text-white text-lg font-semibold">Processing Video</h2>
        <p className="text-sm font-medium text-slate-300">
          Extracting insights from your YouTube video...
        </p>
        <div className="flex items-center justify-center !gap-x-1 !mt-10">
          <Sparkle stroke="#fff" className="size-3" />
          <p className="text-sm font-medium text-slate-300">
            Transcribing video...
          </p>
        </div>
        <p className="text-sm font-medium text-slate-300">
          This might take a moment
        </p>
      </div>
    </Card>
  );
};

export default LoadingComponent;
