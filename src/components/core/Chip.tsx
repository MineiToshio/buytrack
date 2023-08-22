import Typography from "@/core/Typography";
import { cn } from "@/styles/utils";
import { VariantProps, cva } from "class-variance-authority";
import { FC, MouseEvent } from "react";
import Icons from "./Icons";

const chipVariants = cva("flex items-center rounded-3xl w-fit", {
  variants: {
    variant: {
      filled: "bg-gray-300 text-white drop-shadow-md",
      outlined: "border-2",
    },
    size: {
      lg: "px-3 py-1",
      md: "px-3 py-1",
      sm: "px-2 py-1",
      xs: "px-1 py-1",
    },
    color: {
      error: "",
      primary: "",
      "primary-alt": "",
      secondary: "",
      "secondary-alt": "",
      muted: "",
    },
  },
  compoundVariants: [
    {
      variant: "filled",
      color: "error",
      class: "bg-error",
    },
    {
      variant: "filled",
      color: "primary",
      class: "bg-primary",
    },
    {
      variant: "filled",
      color: "primary-alt",
      class: "bg-primary-alt",
    },
    {
      variant: "filled",
      color: "secondary",
      class: "bg-secondary",
    },
    {
      variant: "filled",
      color: "secondary-alt",
      class: "bg-secondary-alt",
    },
    {
      variant: "filled",
      color: "muted",
      class: "bg-muted",
    },
    {
      variant: "outlined",
      color: "error",
      class: "border-error text-error",
    },
    {
      variant: "outlined",
      color: "primary",
      class: "border-primary text-primary",
    },
    {
      variant: "outlined",
      color: "primary-alt",
      class: "border-primary-alt text-primary-alt",
    },
    {
      variant: "outlined",
      color: "secondary",
      class: "border-secondary text-secondary",
    },
    {
      variant: "outlined",
      color: "secondary-alt",
      class: "border-secondary-alt text-secondary-alt",
    },
    {
      variant: "outlined",
      color: "muted",
      class: "border-muted text-muted",
    },
  ],
  defaultVariants: {
    variant: "filled",
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
  color,
  variant,
  title,
  readOnly,
}) => {
  const handleDelete = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (onDelete) onDelete();
  };

  return (
    <div
      className={cn(chipVariants({ variant, size, color, className }))}
      title={title}
    >
      <Typography size={size} color="unset">
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
