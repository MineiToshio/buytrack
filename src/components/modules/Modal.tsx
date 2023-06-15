import { cn } from "@/styles/utils";
import { FC } from "react";
import Portal from "@/modules/Portal";
import Icons from "@/core/Icons";

type ModalProps = {
  children: React.ReactNode | Array<React.ReactNode>;
  onClose: () => void;
  open: boolean;
};

const Modal: FC<ModalProps> = ({ children, onClose, open }) => {
  return (
    <Portal>
      <div
        className={cn(
          "fixed inset-0 z-50 items-center justify-center bg-emerald-700/90 transition-opacity",
          {
            "hidden opacity-0": !open,
            "flex opacity-100": open,
          },
        )}
      >
        <div className="relative w-min min-w-[300px] max-w-3xl rounded-md bg-white">
          <button
            type="button"
            onClick={onClose}
            className="absolute -right-3 -top-3 rounded-full bg-gray-600/80 p-1 hover:bg-gray-800/80"
          >
            <Icons.Cancel className="h-4 w-4 text-white" />
          </button>
          {children}
        </div>
      </div>
    </Portal>
  );
};

export default Modal;
