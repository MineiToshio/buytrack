"use client";

import { FC, useState } from "react";
import Typography from "./Typography";
import { cn } from "@/styles/utils";
import useHandleOutsideClick from "@/hooks/useHandleOutsideClick";
import { VariantProps, cva } from "class-variance-authority";

const selectVariants = cva("relative w-full cursor-pointer rounded-md p-2", {
  variants: {
    variant: {
      standard:
        "border border-solid after:absolute after:right-2 after:top-2 after:text-gray-900 after:content-['⏷']",
      ghost: "border border-solid border-transparent hover:bg-slate-100",
    },
    status: {
      open: "shadow-md",
      close: "",
    },
  },
  compoundVariants: [
    {
      variant: "ghost",
      status: "open",
      class: "border-gray-200 hover:bg-white",
    },
  ],
  defaultVariants: {
    variant: "ghost",
  },
});

type OptionValue = string | number | boolean | undefined;

export type Option = {
  label: string;
  value: OptionValue;
};

type SelectProps = VariantProps<typeof selectVariants> & {
  className?: string;
  placeholder?: string;
  options?: Array<Option>;
  value: OptionValue;
  onChange: (value: OptionValue) => void;
};

const Select: FC<SelectProps> = ({
  value,
  options,
  onChange,
  className,
  placeholder,
  variant,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const selectRef = useHandleOutsideClick(() => setIsOpen(false));

  const selectedOption = options?.find((o) => o.value === value);

  const toggleOpen = () => setIsOpen((o) => !o);

  return (
    <div
      className={cn(
        selectVariants({
          variant,
          status: isOpen ? "open" : "close",
          className,
        })
      )}
      onClick={toggleOpen}
      ref={selectRef}
    >
      {selectedOption ? (
        <Typography>{selectedOption.label}</Typography>
      ) : (
        <Typography color="muted" className="select-none">
          {placeholder}
        </Typography>
      )}
      <div
        className={cn(
          "top-13 absolute left-[-1px] z-10 flex w-[calc(100%+2px)] flex-col overflow-y-auto rounded-b-md border border-t-0 border-solid bg-white shadow-md transition max-h-40",
          {
            hidden: !isOpen,
          }
        )}
      >
        {options ? (
          <>
            {options.map((o) => {
              const key =
                typeof o.value === "boolean" ? (o.value ? 1 : 0) : o.value;
              return (
                <span
                  className="group w-full p-2 hover:bg-primary"
                  key={key}
                  onClick={() => onChange(o.value)}
                >
                  <Typography className="select-none group-hover:text-white">
                    {o.label}
                  </Typography>
                </span>
              );
            })}
          </>
        ) : (
          <Typography className="cursor-default select-none p-2 text-muted">
            No hay opciones
          </Typography>
        )}
      </div>
    </div>
  );
};

Select.displayName = "Select";

export default Select;
