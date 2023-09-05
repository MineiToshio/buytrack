"use client";

import { Option as SelectOption } from "@/core/Select";
import { deliveryStatusData } from "@/helpers/constants";
import { FilterDefinition } from "@/hooks/useFilters";
import SearchBar, {
  ChipToggleField,
  DateRangeField,
  SelectField,
} from "@/modules/SearchBar";
import { DeliveryFull, isDeliveryStatus } from "@/types/prisma";
import { FC } from "react";
import { Control, UseFormHandleSubmit, UseFormSetValue } from "react-hook-form";
import { SearchFormType } from "./DeliveriesList";

type DeliverySearchBarProps = {
  deliveries: DeliveryFull[];
  isLoading: boolean;
  className?: string;
  control: Control<SearchFormType>;
  filterDefinition: FilterDefinition<SearchFormType>;
  onSubmit: UseFormHandleSubmit<SearchFormType>;
  setValue: UseFormSetValue<SearchFormType>;
};

const DeliverySearchBar: FC<DeliverySearchBarProps> = ({
  deliveries,
  isLoading,
  className,
  control,
  filterDefinition,
  onSubmit,
  setValue,
}) => {
  const statusOptions = Object.entries(deliveryStatusData)
    .map(([key, value]) => ({
      label: value.label,
      value: key,
    }))
    .filter((s) => isDeliveryStatus(s.value));

  const storeOptions = deliveries
    .map((d) => ({ label: d.store.name, value: d.store.id }))
    .reduce((acc: SelectOption[], curr) => {
      if (acc.find((a) => a.value === curr.value) == null) acc.push(curr);
      return acc;
    }, []);

  return (
    <SearchBar
      isLoading={isLoading}
      className={className}
      onSubmit={onSubmit}
      setValue={setValue}
      filterDefinition={filterDefinition}
    >
      <DateRangeField
        control={control}
        formField="approximateDeliveryDate"
        title="Entrega aprox."
        maxDate={new Date()}
      />
      <SelectField
        control={control}
        formField="storeId"
        options={storeOptions}
        placeholder="Busca una tienda"
        title="Tienda"
      />
      <ChipToggleField
        control={control}
        formField="status"
        options={statusOptions}
        title="Estado"
      />
    </SearchBar>
  );
};

export default DeliverySearchBar;
