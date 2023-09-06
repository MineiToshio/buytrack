"use client";

import Button from "@/core/Button";
import DateRangePicker from "@/core/DateRangePicker";
import Icons from "@/core/Icons";
import Select, { Option as SelectOption } from "@/core/Select";
import Typography from "@/core/Typography";
import { pushState } from "@/helpers/utils";
import { FilterDefinition, FilterType } from "@/hooks/useFilters";
import ChipToggleButtons, {
  Option as ChipOption,
} from "@/modules/ChipToggleButtons";
import { cn } from "@/styles/utils";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import { ChangeEvent, FC, useEffect, useState } from "react";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
  type UseFormHandleSubmit,
  type UseFormSetValue,
  UseFormRegister,
} from "react-hook-form";
import Input from "../core/Input";

type SearchBarProps<T extends FieldValues> = {
  isLoading: boolean;
  className?: string;
  onSubmit: UseFormHandleSubmit<T>;
  setValue: UseFormSetValue<T>;
  filterDefinition: FilterDefinition<T>;
  children: React.ReactNode;
};

const setFilterValues = <SearchFormType extends FieldValues>(
  params: URLSearchParams | ReadonlyURLSearchParams,
  setValue: UseFormSetValue<SearchFormType>,
  filterDefinition: FilterDefinition<SearchFormType>,
) => {
  filterDefinition.forEach((d) => {
    const value = params.get(d.attribute);
    if (value) {
      if (d.type === FilterType.dateRange) {
        const date = value.split(",");
        date
          ? // @ts-ignore TODO: Fix this later
            setValue(d.attribute, {
              min: new Date(date[0]),
              max: new Date(date[1]),
            })
          : // @ts-ignore TODO: Fix this later
            setValue(d.attribute, null);
      } else if (d.type === FilterType.text) {
        // @ts-ignore TODO: Fix this later
        value ? setValue(d.attribute, value) : setValue(d.attribute, undefined);
      } else if (d.type === FilterType.list) {
        value
          ? // @ts-ignore TODO: Fix this later
            setValue(d.attribute, value.split(","))
          : // @ts-ignore TODO: Fix this later
            setValue(d.attribute, undefined);
      }
    }
  });
};

type SearchFieldProps = {
  title: string;
  children: React.ReactNode;
};

const SearchField: FC<SearchFieldProps> = ({ title, children }) => (
  <div className="mt-3 flex flex-col">
    <Typography>{title}</Typography>
    {children}
  </div>
);

type DateRangeFieldProps<SearchFormType extends FieldValues> = {
  title: string;
  formField: Path<SearchFormType>;
  control: Control<SearchFormType>;
  maxDate?: Date;
};

export const DateRangeField = <SearchFormType extends FieldValues>({
  title,
  formField,
  control,
  maxDate,
}: DateRangeFieldProps<SearchFormType>) => (
  <SearchField title={title}>
    <Controller
      name={formField}
      control={control}
      render={({ field }) => (
        <DateRangePicker
          variant="standard"
          onChange={field.onChange}
          value={field.value}
          maxDate={maxDate}
        />
      )}
    />
  </SearchField>
);

type SelectFieldProps<SearchFormType extends FieldValues> = {
  title: string;
  formField: Path<SearchFormType>;
  control: Control<SearchFormType>;
  options: SelectOption[];
  placeholder: string;
};

export const SelectField = <SearchFormType extends FieldValues>({
  title,
  formField,
  control,
  options,
  placeholder,
}: SelectFieldProps<SearchFormType>) => (
  <SearchField title={title}>
    <Controller
      name={formField}
      control={control}
      render={({ field }) => (
        <Select
          variant="standard"
          options={options}
          onChange={field.onChange}
          value={field.value}
          allowSearch
          clearValue
          searchPlaceholder={placeholder}
        />
      )}
    />
  </SearchField>
);

type ChipToggleFieldProps<SearchFormType extends FieldValues> = {
  title: string;
  formField: Path<SearchFormType>;
  control: Control<SearchFormType>;
  options: ChipOption[];
};

export const ChipToggleField = <SearchFormType extends FieldValues>({
  title,
  formField,
  control,
  options,
}: ChipToggleFieldProps<SearchFormType>) => (
  <SearchField title={title}>
    <Controller
      name={formField}
      control={control}
      render={({ field }) => (
        <ChipToggleButtons
          options={options}
          onChange={field.onChange}
          value={field.value}
        />
      )}
    />
  </SearchField>
);

type TextFieldProps<SearchFormType extends FieldValues> = {
  title: string;
  placeholder?: string;
  formField: Path<SearchFormType>;
  register: UseFormRegister<SearchFormType>;
};

export const TextToggleField = <SearchFormType extends FieldValues>({
  title,
  placeholder,
  formField,
  register,
}: TextFieldProps<SearchFormType>) => (
  <SearchField title={title}>
    <Input
      variant="standard"
      placeholder={placeholder}
      {...register(formField)}
    />
  </SearchField>
);

const SearchBar = <SearchFormType extends FieldValues>({
  isLoading,
  className,
  onSubmit,
  setValue,
  filterDefinition,
  children,
}: SearchBarProps<SearchFormType>) => {
  const [showBar, setShowBar] = useState<boolean>(false);
  const params = useSearchParams();

  useEffect(() => {
    setFilterValues(params, setValue, filterDefinition);
  }, [filterDefinition, params, setValue]);

  const toggleBar = () => setShowBar((b) => !b);

  const handleSearch = (data: SearchFormType) => {
    let params: string[] = [];
    filterDefinition.forEach((d) => {
      if (data[d.attribute]) {
        if (d.type === FilterType.dateRange) {
          if (data[d.attribute].min && data[d.attribute].max) {
            params.push(
              `${d.attribute}=${data[d.attribute].min},${
                data[d.attribute].max
              }`,
            );
          }
        } else if (d.type === FilterType.text) {
          params.push(`${d.attribute}=${data[d.attribute]}`);
        } else if (d.type === FilterType.list) {
          params.push(`${d.attribute}=${data[d.attribute].join(",")}`);
        }
      }
    });
    pushState(params.join("&"));
    toggleBar();
  };

  const clear = () => {
    let clearData = {};
    filterDefinition.forEach((d) => {
      if (d.type === FilterType.dateRange) {
        clearData = {
          ...clearData,
          [d.attribute]: null,
        };
        // @ts-ignore TODO: Fix this later
        setValue(d.attribute, null);
      } else {
        // @ts-ignore TODO: Fix this later
        setValue(d.attribute, undefined);
      }
    });
    // @ts-ignore TODO: Fix this later
    handleSearch(clearData);
  };

  const handleClose = () => {
    toggleBar();
    const currentParams = new URLSearchParams(window.location.search);
    setFilterValues(currentParams, setValue, filterDefinition);
  };

  return (
    <>
      <div
        className={cn(
          "fixed z-10 bg-muted opacity-0 transition duration-1000",
          {
            "inset-0 opacity-70": showBar,
          },
        )}
      />
      <div
        className={cn(
          "fixed left-0 top-[80px] z-10 h-[calc(100vh-80px)] w-full bg-white p-4 shadow-2xl transition duration-700 md:w-72",
          { "-translate-x-full": !showBar },
        )}
      >
        <Button
          variant="icon"
          className="absolute right-3 top-2"
          onClick={handleClose}
        >
          <Icons.Cancel />
        </Button>
        <form
          className="flex h-full flex-col"
          onSubmit={onSubmit(handleSearch)}
        >
          <div className="flex h-full flex-col overflow-y-auto overflow-x-hidden">
            {children}
          </div>
          <Button type="submit" StartIcon={Icons.Search}>
            Buscar
          </Button>
          <Button
            variant="outline"
            onClick={clear}
            className="mt-2"
            StartIcon={Icons.Restart}
          >
            Restablecer valores
          </Button>
        </form>
      </div>
      <Button
        variant="outline"
        onClick={toggleBar}
        isLoading={isLoading}
        className={className}
        StartIcon={Icons.Search}
      >
        Buscar
      </Button>
    </>
  );
};

export default SearchBar;
