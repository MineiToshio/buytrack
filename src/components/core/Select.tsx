"use client";

import { FC, useState } from "react";
import Typography from "./Typography";
import { cn } from "@/styles/utils";
import useHandleOutsideClick from "@/hooks/useHandleOutsideClick";

type OptionValue = string | number | boolean | undefined;

export type Option = {
  label: string;
  value: OptionValue;
};

type SelectProps = {
  className?: string;
  placeholder?: string;
  options: Array<Option>;
  value: OptionValue;
  onChange: (value: OptionValue) => void;
};

const Select: FC<SelectProps> = ({
  value,
  options,
  onChange,
  className,
  placeholder,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const selectRef = useHandleOutsideClick(() => setIsOpen(false));

  const selectedOption = options?.find((o) => o.value === value);

  const toggleOpen = () => setIsOpen((o) => !o);

  return (
    <div
      className={cn(
        "relative w-full cursor-pointer rounded-md border border-solid p-2 after:absolute after:right-2 after:top-2 after:text-gray-900 after:content-['⏷']",
        className
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
          "top-13 absolute left-[-1px] flex w-[calc(100%+2px)] flex-col overflow-y-auto border border-t-0 border-solid bg-white transition",
          {
            hidden: !isOpen,
          }
        )}
      >
        {options.map((o) => {
          const key =
            typeof o.value === "boolean" ? (o.value ? 1 : 0) : o.value;
          return (
            <span
              className="w-full select-none p-2 hover:bg-primary hover:text-white"
              key={key}
              onClick={() => onChange(o.value)}
            >
              {o.label}
            </span>
          );
        })}
      </div>
    </div>
  );
};

Select.displayName = "Select";

export default Select;
