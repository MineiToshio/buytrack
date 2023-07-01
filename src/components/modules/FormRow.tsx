import AddButton from "@/components/modules/AddButton";
import Input from "@/core/Input";
import Select, { OptionValue, type Option } from "@/core/Select";
import Typography from "@/core/Typography";
import { LucideIcon } from "lucide-react";
import { HTMLInputTypeAttribute, ReactElement, Ref, forwardRef } from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import DatePicker from "../core/DatePicker";
import DateRangePicker from "../core/DateRangePicker";
import Button from "../core/Button";

type RowInputProps = {
  type: "input";
  options?: undefined;
  control?: undefined;
  formField?: undefined;
  newModalTitle?: undefined;
  onAdd?: undefined;
  multiple?: undefined;
  searchPlaceholder?: undefined;
  minDate?: undefined;
  maxDate?: undefined;
  inputType?: HTMLInputTypeAttribute;
  ButtonIcon?: LucideIcon;
  onButtonClick?: () => void;
};

type SelectInputProps<T extends FieldValues> = {
  type: "select";
  options?: Array<Option>;
  control: Control<T>;
  formField: Path<T>;
  newModalTitle?: string;
  onAdd?: (value: string) => void;
  multiple?: boolean;
  searchPlaceholder?: string;
  minDate?: undefined;
  maxDate?: undefined;
  inputType?: undefined;
  ButtonIcon?: undefined;
  onButtonClick?: undefined;
};

type DatePickerProps<T extends FieldValues> = {
  type: "datepicker";
  options?: undefined;
  control: Control<T>;
  formField: Path<T>;
  newModalTitle?: undefined;
  onAdd?: undefined;
  multiple?: undefined;
  searchPlaceholder?: undefined;
  minDate?: Date;
  maxDate?: Date;
  inputType?: undefined;
  ButtonIcon?: undefined;
  onButtonClick?: undefined;
};

type DateRangePickerProps<T extends FieldValues> = {
  type: "dateRangePicker";
  options?: undefined;
  control: Control<T>;
  formField: Path<T>;
  newModalTitle?: undefined;
  onAdd?: undefined;
  multiple?: undefined;
  searchPlaceholder?: undefined;
  minDate?: Date;
  maxDate?: Date;
  inputType?: undefined;
  ButtonIcon?: undefined;
  onButtonClick?: undefined;
};

type FormOptionValue = string | boolean | number | string[] | undefined;

const isMultipleValue = (value: FormOptionValue): value is string[] =>
  Array.isArray(value) || value == null;

const isSingleValue = (value: FormOptionValue): value is OptionValue =>
  !Array.isArray(value);

type RowProps<T extends FieldValues> = {
  Icon: LucideIcon;
  title: string;
  placeholder?: string;
  required?: boolean;
  error?: boolean;
  errorMessage?: string;
  readOnly?: boolean;
  allowSearch?: boolean;
} & (
  | RowInputProps
  | SelectInputProps<T>
  | DatePickerProps<T>
  | DateRangePickerProps<T>
);

const FormRow = <T extends FieldValues>(
  {
    Icon,
    title,
    placeholder,
    searchPlaceholder,
    type,
    options,
    control,
    formField,
    newModalTitle,
    multiple,
    required,
    error,
    errorMessage = "Este campo es obligatorio",
    readOnly,
    allowSearch,
    minDate,
    maxDate,
    inputType,
    onAdd,
    ButtonIcon,
    onButtonClick,
    ...props
  }: RowProps<T>,
  ref: Ref<HTMLInputElement>,
) => (
  <div className="mb-2 flex flex-col items-center md:flex-row">
    <div className="mr-3 mt-2 flex h-full w-full max-w-[220px] self-start">
      <Icon className="mr-2 text-muted" />
      <Typography color="muted" className="block truncate" as="span">
        {title}
      </Typography>
    </div>
    <div className="flex w-full flex-col">
      {type === "input" && (
        <div className="flex w-full">
          <Input
            placeholder={placeholder}
            readOnly={readOnly}
            type={inputType}
            {...props}
            ref={ref}
          />
          {ButtonIcon && onButtonClick && (
            <Button variant="text" onClick={onButtonClick}>
              <ButtonIcon />
            </Button>
          )}
        </div>
      )}
      {type === "select" && (
        <div className="flex w-full">
          <Controller
            name={formField}
            control={control}
            rules={{ required }}
            render={({ field }) => (
              <>
                {multiple && isMultipleValue(field.value) ? (
                  <Select
                    placeholder={placeholder}
                    options={options}
                    multiple={true}
                    onChange={field.onChange}
                    value={field.value}
                    readOnly={readOnly}
                    allowSearch={allowSearch}
                    searchPlaceholder={searchPlaceholder}
                  />
                ) : (
                  <>
                    {isSingleValue(field.value) && (
                      <Select
                        placeholder={placeholder}
                        options={options}
                        onChange={field.onChange}
                        value={field.value}
                        readOnly={readOnly}
                        allowSearch={allowSearch}
                        searchPlaceholder={searchPlaceholder}
                      />
                    )}
                  </>
                )}
              </>
            )}
          />
          {newModalTitle && onAdd && !readOnly && (
            <AddButton title={newModalTitle} onAdd={onAdd} />
          )}
        </div>
      )}
      {type === "datepicker" && (
        <Controller
          name={formField}
          control={control}
          rules={{ required }}
          render={({ field }) => (
            <DatePicker
              placeholder={placeholder}
              onChange={field.onChange}
              value={field.value}
              readOnly={readOnly}
              minDate={minDate}
              maxDate={maxDate}
            />
          )}
        />
      )}
      {type === "dateRangePicker" && (
        <Controller
          name={formField}
          control={control}
          rules={{ required }}
          render={({ field }) => (
            <DateRangePicker
              placeholder={placeholder}
              onChange={field.onChange}
              value={field.value}
              readOnly={readOnly}
              minDate={minDate}
              maxDate={maxDate}
            />
          )}
        />
      )}
      {error && (
        <Typography size="xs" className="ml-2 text-error">
          {errorMessage}
        </Typography>
      )}
    </div>
  </div>
);

FormRow.displayName = "FormRow";

export default forwardRef(FormRow) as <T extends FieldValues>(
  p: RowProps<T> & { ref?: Ref<HTMLInputElement> },
) => ReactElement;
