import Typography from "@/core/Typography";
import { cn } from "@/styles/utils";
import { VariantProps, cva } from "class-variance-authority";
import { FC, MouseEvent } from "react";
import Icons from "./Icons";

const chipVariants = cva("flex items-center rounded-3xl bg-gray-300", {
  variants: {
    size: {
      lg: "px-3 py-1",
      md: "px-3 py-1",
      sm: "px-2 py-1",
      xs: "px-1 py-1",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

type ChipProps = VariantProps<typeof chipVariants> & {
  label: string;
  className?: string;
  title?: string;
  readOnly?: boolean;
  onDelete?: () => void;
};

const Chip: FC<ChipProps> = ({
  label,
  onDelete,
  className,
  size,
  title,
  readOnly,
}) => {
  const handleDelete = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (onDelete) onDelete();
  };

  return (
    <div className={cn(chipVariants({ size, className }))} title={title}>
      <Typography className="text-white" size={size}>
        {label}
      </Typography>
      {onDelete && !readOnly && (
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
