"use client";

import { regularFont, secondaryFont } from "@/styles/fonts";
import { cn } from "@/styles/utils";
import { VariantProps, cva } from "class-variance-authority";
import { ButtonHTMLAttributes, MouseEvent, forwardRef } from "react";
import Icons from "./Icons";
import { LucideIcon } from "lucide-react";

export const buttonVariants = cva(
  "active:scale-95 inline-flex items-center justify-center rounded-md text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-green-600 uppercase",
        outline:
          "bg-transparent text-primary hover:bg-primary border border-primary hover:text-white",
        ghost:
          "bg-transparent hover:bg-primary data-[state=open]:bg-transparent",
        text: "bg-transparent underline-offset-4 hover:underline text-primary hover:text-green-600 focus:ring-0 focus:ring-offset-0",
        icon: "bg-transparent text-primary !p-0 border-transparent focus:ring-0 focus:ring-transparent !h-min hover:text-green-600",
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
        muted: "",
        error: "",
        secondary: "",
      },
    },
    compoundVariants: [
      {
        variant: "default",
        color: "white",
        class: "bg-white text-primary hover:bg-slate-200 normal-case",
      },
      {
        variant: "icon",
        color: "muted",
        class: "text-muted hover:text-gray-500",
      },
      {
        variant: "icon",
        color: "white",
        class: "text-white hover:text-slate-200",
      },
      {
        variant: "outline",
        color: "error",
        class: "border-error text-error hover:bg-error focus:ring-error",
      },
      {
        variant: "outline",
        color: "muted",
        class: "border-muted text-muted hover:bg-muted focus:ring-muted",
      },
      {
        variant: "text",
        color: "secondary",
        class: "text-secondary hover:text-secondary-alt",
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
    StartIcon?: LucideIcon;
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
      onClick,
      StartIcon,
      ...props
    },
    ref,
  ) => {
    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      if (onClick) {
        onClick(e);
      }
    };

    return (
      <button
        className={cn(
          buttonVariants({ variant, size, font, color, className }),
        )}
        ref={ref}
        disabled={isLoading}
        type={type ?? "button"}
        onClick={handleClick}
        {...props}
      >
        {isLoading ? (
          <Icons.Loader
            className={cn("h-4 w-4 animate-spin", {
              "mr-2": variant !== "icon",
            })}
          />
        ) : (
          <>{StartIcon && <StartIcon size={16} className="mr-2" />}</>
        )}
        {(variant !== "icon" || (variant === "icon" && !isLoading)) && children}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
