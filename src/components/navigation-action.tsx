"use client"
import { Plus } from "lucide-react";
import ActionTooltip from "./action-tooltip";
import { useModal } from "@/hooks/use-modal-store";
const NavigationAction = () => {
  const {onOpen} = useModal()
  return (
    <div>
      <ActionTooltip side="right" align="center" label="Add a server">
        <button onClick={() => onOpen("createServer")} className="group flex items-center cursor-pointer">
          <div className="flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all duration-300 ease-out overflow-hidden items-center justify-center bg-background dark:bg-[#313338] group-hover:bg-emerald-500 dark:group-hover:bg-emerald-500">
            <Plus
              className="group-hover:text-white transition-colors duration-300 text-emerald-500"
              size={25}
            />
          </div>
        </button>
      </ActionTooltip>
    </div>
  );
};

export default NavigationAction;