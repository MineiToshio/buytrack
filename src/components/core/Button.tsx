import { regularFont, secondaryFont } from "@/styles/fonts";
import { cn } from "@/styles/utils";
import { VariantProps, cva } from "class-variance-authority";
import { ButtonHTMLAttributes, forwardRef } from "react";
import Icons from "./Icons";

export const buttonVariants = cva(
  "active:scale-95 inline-flex items-center justify-center rounded-md text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-green-600",
        outline:
          "bg-transparent text-primary hover:bg-primary border border-primary hover:text-white",
        ghost:
          "bg-transparent hover:bg-primary data-[state=open]:bg-transparent",
        text: "bg-transparent underline-offset-4 hover:underline text-primary hover:text-green-600",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-2 rounded-md",
        lg: "px-4 py-2 rounded-md text-lg",
      },
      font: {
        default: regularFont.className,
        secondary: secondaryFont.className,
      },
      color: {
        default: "",
        white: "",
      },
    },
    compoundVariants: [
      {
        variant: "default",
        color: "white",
        class: "bg-white text-primary hover:bg-slate-50",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
      color: "default",
    },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    isLoading?: boolean;
  };

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant,
      font,
      color,
      isLoading,
      size,
      type,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        className={cn(
          buttonVariants({ variant, size, font, color, className }),
        )}
        ref={ref}
        disabled={isLoading}
        type={type ?? "button"}
        {...props}
      >
        {isLoading && <Icons.Loader className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
