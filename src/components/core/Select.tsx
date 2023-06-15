"use client";

import Chip from "@/core/Chip";
import useHandleOutsideClick from "@/hooks/useHandleOutsideClick";
import { cn } from "@/styles/utils";
import { VariantProps, cva } from "class-variance-authority";
import { FC, useMemo, useState } from "react";
import Typography from "./Typography";

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
      readOnly: "",
    },
  },
  compoundVariants: [
    {
      variant: "ghost",
      status: "open",
      class: "border-gray-200 hover:bg-white",
    },
    {
      variant: "ghost",
      status: "readOnly",
      class: "shadow-none hover:bg-transparent cursor-default",
    },
  ],
  defaultVariants: {
    variant: "ghost",
  },
});

export type OptionValue = string | number | boolean;

export type Option = {
  label: string;
  value: OptionValue;
};

type SingleOption = {
  multiple?: false;
  value: OptionValue | undefined;
  onChange: (value: OptionValue) => void;
};

type MultipleOption = {
  multiple: true;
  value: OptionValue[] | undefined;
  onChange: (value: OptionValue[]) => void;
};

type SelectProps = VariantProps<typeof selectVariants> & {
  className?: string;
  placeholder?: string;
  options?: Array<Option>;
  readOnly?: boolean;
} & (SingleOption | MultipleOption);

const Select: FC<SelectProps> = ({
  value,
  options,
  onChange,
  className,
  placeholder,
  variant,
  multiple,
  readOnly,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const selectRef = useHandleOutsideClick(() => setIsOpen(false));

  const selectedOption = useMemo(() => {
    if (options && value != null) {
      if (multiple)
        return options?.filter((o) => o.value && value.includes(o.value));
      return options?.filter((o) => o.value === value);
    }
  }, [multiple, options, value]);

  const handleChange = (selectedValue: OptionValue) => {
    if (multiple) {
      const formattedValue = value ?? [];
      const isSelected = formattedValue.find((v) => v === selectedValue);

      if (isSelected) {
        const newValue = formattedValue.filter((v) => v !== selectedValue);
        onChange(newValue);
      } else {
        const newValue = [...formattedValue, selectedValue];
        onChange(newValue);
      }
    } else {
      onChange(selectedValue);
    }
  };

  const handleDelete = (selectedValue: OptionValue) => {
    if (multiple) {
      const formattedValue = value ?? [];
      const newValue = formattedValue.filter((v) => v !== selectedValue);
      onChange(newValue);
    }
  };

  const toggleOpen = () => setIsOpen((o) => !o);

  return (
    <div
      className={cn(
        selectVariants({
          variant,
          status: readOnly ? "readOnly" : isOpen ? "open" : "close",
          className,
        }),
      )}
      onClick={toggleOpen}
      ref={selectRef}
    >
      {selectedOption && selectedOption.length > 0 ? (
        <>
          {multiple ? (
            <div className="flex">
              {selectedOption.map((so) => {
                const key =
                  typeof so.value === "boolean" ? (so.value ? 1 : 0) : so.value;
                return (
                  <Chip
                    className="mr-2"
                    label={so.label}
                    key={key}
                    readOnly={readOnly}
                    onDelete={() => handleDelete(so.value)}
                  />
                );
              })}
            </div>
          ) : (
            <Typography>{selectedOption[0].label}</Typography>
          )}
        </>
      ) : (
        <Typography color="muted" className="select-none">
          {placeholder}
        </Typography>
      )}
      <div
        className={cn(
          "top-13 absolute left-[-1px] z-10 flex max-h-40 w-[calc(100%+2px)] flex-col overflow-y-auto rounded-b-md border border-t-0 border-solid bg-white shadow-md transition",
          {
            hidden: !isOpen || readOnly,
          },
        )}
      >
        {options && options.length > 0 ? (
          <>
            {options.map((o) => {
              const key =
                typeof o.value === "boolean" ? (o.value ? 1 : 0) : o.value;
              return (
                <span
                  className="group w-full p-2 hover:bg-primary"
                  key={key}
                  onClick={() => handleChange(o.value)}
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
