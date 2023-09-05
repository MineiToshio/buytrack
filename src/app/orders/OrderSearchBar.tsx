"use client";

import SearchBar, {
  ChipToggleField,
  DateRangeField,
  SelectField,
} from "@/components/modules/SearchBar";
import { Option as SelectOption } from "@/core/Select";
import { orderStatusLabel } from "@/helpers/constants";
import { FilterDefinition } from "@/hooks/useFilters";
import { Option as ChipOption } from "@/modules/ChipToggleButtons";
import { OrderFull } from "@/types/prisma";
import { FC } from "react";
import { Control, UseFormHandleSubmit, UseFormSetValue } from "react-hook-form";
import { SearchFormType } from "./OrdersList";

type OrderSearchBarProps = {
  orders: OrderFull[];
  isLoading: boolean;
  className?: string;
  control: Control<SearchFormType>;
  filterDefinition: FilterDefinition<SearchFormType>;
  onSubmit: UseFormHandleSubmit<SearchFormType>;
  setValue: UseFormSetValue<SearchFormType>;
};

const OrderSearchBar: FC<OrderSearchBarProps> = ({
  orders,
  isLoading,
  className,
  control,
  filterDefinition,
  onSubmit,
  setValue,
}) => {
  const statusOptions = orders
    .map((o) => o.status)
    .reduce((acc: ChipOption[], curr) => {
      if (acc.find((a) => a.value === curr) == null)
        acc.push({
          label: orderStatusLabel[curr],
          value: curr,
        });
      return acc;
    }, []);

  const storeOptions = orders
    .map((o) => ({ label: o.store.name, value: o.store.id }))
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
        formField="orderDate"
        title="Fecha de Pedido"
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

export default OrderSearchBar;
