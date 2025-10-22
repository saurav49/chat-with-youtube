import { Card } from "@/components/ui/card";
import { ModalConfigType } from "@/entrypoints/popup/App";

const SuccessComponent = ({
  setIsOpenModalConfig,
}: {
  setIsOpenModalConfig: React.Dispatch<React.SetStateAction<ModalConfigType>>;
}) => {
  return (
    <Card className="flex rounded-md !h-[560px] flex-col items-center justify-center bg-slate-950 !gap-y-1 !py-10 border-none">
      <div className="bg-stone-800 w-[400px] flex flex-col items-center !px-7 !py-10 justify-center rounded-md !gap-y-4">
        <h2 className="text-white text-lg font-semibold">Ready to chat</h2>
        <p className="text-sm text-slate-300">
          Your video has been transcribed and stored. Start a conversation with
          the transcript.
        </p>

        <div className="flex gap-3 mt-6">
          {/*<button
            className="px-4 py-2 rounded bg-green-600 text-white"
            onClick={() => {
              setIsOpenModalConfig((prev) => ({
                ...prev,
                isOpenConfig: false,
                isOpenLoading: false,
                isOpenSuccess: false,
              }));
              openFloatingButtonInContent();
            }}
          >
            Open Chat
          </button>*/}
          <button
            className="px-4 py-2 rounded bg-neutral-700 text-white"
            onClick={() => {
              // Optionally close the popup entirely
              window.close();
            }}
          >
            Close Popup
          </button>
        </div>
      </div>
    </Card>
  );
};

export default SuccessComponent;
