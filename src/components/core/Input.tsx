import { cn } from "@/styles/utils";
import { VariantProps, cva } from "class-variance-authority";
import { InputHTMLAttributes, forwardRef } from "react";

const inputVariants = cva("text-base sm:text-lg w-full p-2 outline-0", {
  variants: {
    variant: {
      standard:
        "border border-solid rounded-md focus:outline focus:outline-1 focus:outline-slate-200 focus:drop-shadow-md",
      ghost:
        "cursor-pointer rounded-md hover:bg-slate-100 focus:outline focus:outline-1 focus:outline-slate-200 focus:drop-shadow-md focus:cursor-text focus:hover:bg-white",
      unstyled: "p-0",
    },
    status: {
      readOnly: "",
    },
  },
  compoundVariants: [
    {
      variant: "ghost",
      status: "readOnly",
      class:
        "shadow-none cursor-default focus:outline-0 focus:drop-shadow-none hover:bg-transparent",
    },
    {
      variant: "standard",
      status: "readOnly",
      class: "cursor-default focus:outline-0 focus:drop-shadow-none",
    },
  ],
  defaultVariants: {
    variant: "ghost",
  },
});

type InputProps = InputHTMLAttributes<HTMLInputElement> &
  VariantProps<typeof inputVariants>;

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, readOnly, ...props }, ref) => (
    <input
      ref={ref}
      readOnly={readOnly}
      className={cn(
        inputVariants({
          variant,
          status: readOnly ? "readOnly" : null,
          className,
        }),
      )}
      {...props}
    />
  ),
);

Input.displayName = "Input";

export default Input;
