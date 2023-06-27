import { cn } from "@/styles/utils";
import { VariantProps, cva } from "class-variance-authority";
import { FC } from "react";
import ReactDatePicker, {
  ReactDatePickerProps,
  registerLocale,
} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import es from "date-fns/locale/es";

registerLocale("es", es);

const datePickerVariants = cva("text-base sm:text-lg w-full p-2 outline-0", {
  variants: {
    variant: {
      standard:
        "border border-solid rounded-md focus:outline focus:outline-1 focus:outline-slate-200 focus:drop-shadow-md",
      ghost:
        "cursor-pointer rounded-md hover:bg-slate-100 focus:outline focus:outline-1 focus:outline-slate-200 focus:drop-shadow-md focus:cursor-text focus:hover:bg-white",
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
  ],
  defaultVariants: {
    variant: "ghost",
  },
});

type DatePickerProps = {
  value: Date | null;
  placeholder?: string;
  className?: string;
} & ReactDatePickerProps &
  VariantProps<typeof datePickerVariants>;

const DatePicker: FC<DatePickerProps> = ({
  value,
  variant,
  readOnly,
  placeholder,
  className,
  ...props
}) => (
  <ReactDatePicker
    className={cn(
      datePickerVariants({
        variant,
        status: readOnly ? "readOnly" : null,
        className,
      }),
    )}
    calendarClassName="[&_.react-datepicker\_\_day--selected]:bg-primary [&_.react-datepicker\_\_day--selected:hover]:bg-green-600 [&_.react-datepicker\_\_day--keyboard-selected]:bg-green-200 [&_.react-datepicker\_\_day--keyboard-selected:hover]:bg-green-600 [&_.react-datepicker\_\_triangle::after]:!left-[-110px] [&_.react-datepicker\_\_triangle::before]:!left-[-110px]"
    selected={value}
    placeholderText={placeholder}
    readOnly={readOnly}
    dateFormat="dd/MM/yyyy"
    locale="es"
    {...props}
  />
);

export default DatePicker;
