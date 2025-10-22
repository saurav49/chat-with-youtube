import ModalConfig from "@/components/modal-config";
import LoadingComponent from "@/components/loading-component";
import SuccessComponent from "@/components/success-component";
import "@/assets/tailwind.css";
import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";

export type ModalConfigType = {
  isOpenConfig: boolean;
  isOpenLoading: boolean;
  isOpenSuccess: boolean;
};

function App() {
  const [isOpenModalConfig, setIsOpenModalConfig] = useState<ModalConfigType>({
    isOpenConfig: true,
    isOpenLoading: false,
    isOpenSuccess: false,
  });
  return (
    <>
      <Toaster />
      <div className="w-[500px] !p-0">
        {isOpenModalConfig.isOpenConfig && (
          <ModalConfig setIsOpenModalConfig={setIsOpenModalConfig} />
        )}
        {isOpenModalConfig.isOpenLoading && (
          <LoadingComponent setIsOpenModalConfig={setIsOpenModalConfig} />
        )}
        {isOpenModalConfig.isOpenSuccess && (
          <SuccessComponent setIsOpenModalConfig={setIsOpenModalConfig} />
        )}
      </div>
    </>
  );
}

export default App;
