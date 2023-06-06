import { cn } from "@/styles/utils";
import { FC, MouseEvent } from "react";
import Typography from "@/core/Typography";
import Icons from "./Icons";

type ChipProps = {
  label: string;
  className?: string;
  onDelete?: () => void;
};

const Chip: FC<ChipProps> = ({ label, onDelete, className }) => {
  const handleDelete = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (onDelete) onDelete();
  };

  return (
    <div
      className={cn(
        "mr-2 flex items-center rounded-3xl border bg-gray-300 px-3 py-1",
        className
      )}
    >
      <Typography className="text-white">{label}</Typography>
      {onDelete && (
        <button
          onClick={handleDelete}
          className="ml-2 flex h-6 w-6 items-center justify-center rounded-full bg-gray-400 hover:bg-gray-500"
        >
          <Icons.Cancel className="h-5 w-5 text-white" />
        </button>
      )}
    </div>
  );
};

export default Chip;
