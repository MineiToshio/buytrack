import AddButton from "@/components/modules/AddButton";
import Input from "@/core/Input";
import Select, { OptionValue, type Option } from "@/core/Select";
import Typography from "@/core/Typography";
import { LucideIcon } from "lucide-react";
import { FC, forwardRef } from "react";
import { Control, Controller } from "react-hook-form";
import { StoreFormType } from "./StoreForm";

type RowInputProps = {
  type: "input";
  options?: undefined;
  control?: undefined;
  formField?: undefined;
  newModalTitle?: undefined;
  onAdd?: undefined;
  multiple?: undefined;
};

type SelectInputProps = {
  type: "select";
  options?: Array<Option>;
  control: Control<StoreFormType>;
  formField: keyof StoreFormType;
  newModalTitle?: string;
  onAdd?: (value: string) => void;
  multiple?: boolean;
};

type FormOptionValue = string | boolean | number | string[] | undefined;

const isMultipleValue = (value: FormOptionValue): value is string[] =>
  Array.isArray(value) || value == null;

const isSingleValue = (value: FormOptionValue): value is OptionValue =>
  !Array.isArray(value);

type RowProps = {
  Icon: LucideIcon;
  title: string;
  placeholder?: string;
  required?: boolean;
  error?: boolean;
  errorMessage?: string;
} & (RowInputProps | SelectInputProps);

const StoreFormRow: FC<RowProps> = forwardRef<HTMLInputElement, RowProps>(
  (
    {
      Icon,
      title,
      placeholder,
      type,
      options,
      control,
      formField,
      newModalTitle,
      multiple,
      required,
      error,
      errorMessage = "Este campo es obligatorio",
      onAdd,
      ...props
    },
    ref
  ) => (
    <div className="mb-2 flex items-center">
      <div className="mr-3 flex w-full max-w-[220px] items-center">
        <Icon className="mr-2 text-muted" />
        <Typography color="muted" className="block truncate" as="span">
          {title}
        </Typography>
      </div>
      <div className="flex w-full flex-col">
        {type === "input" && (
          <Input placeholder={placeholder} {...props} ref={ref} />
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
                    />
                  ) : (
                    <>
                      {isSingleValue(field.value) && (
                        <Select
                          placeholder={placeholder}
                          options={options}
                          onChange={field.onChange}
                          value={field.value}
                        />
                      )}
                    </>
                  )}
                </>
              )}
            />
            {newModalTitle && onAdd && (
              <AddButton title={newModalTitle} onAdd={onAdd} />
            )}
          </div>
        )}
        {error && (
          <Typography size="xs" className="ml-2 text-error">
            {errorMessage}
          </Typography>
        )}
      </div>
    </div>
  )
);

StoreFormRow.displayName = "StoreFormRow";

export default StoreFormRow;
