import { cn } from "@/styles/utils";
import { VariantProps, cva } from "class-variance-authority";
import { InputHTMLAttributes, forwardRef } from "react";

const inputVariants = cva("text-base sm:text-lg w-full p-2 outline-0", {
  variants: {
    variant: {
      ghost:
        "cursor-pointer rounded-md hover:bg-slate-100 focus:outline focus:outline-1 focus:outline-slate-200 focus:drop-shadow-md focus:hover:bg-white",
      unstyled: "p-0",
    },
  },
  defaultVariants: {
    variant: "ghost",
  },
});

type InputProps = InputHTMLAttributes<HTMLInputElement> &
  VariantProps<typeof inputVariants>;

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(inputVariants({ variant, className }))}
        {...props}
      />
    );
  }
);

Input.displayName = "Button";

export default Input;
