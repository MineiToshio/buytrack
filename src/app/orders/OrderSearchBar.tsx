"use client";

import Button from "@/core/Button";
import DateRangePicker from "@/core/DateRangePicker";
import Icons from "@/core/Icons";
import Select, { Option as SelectOption } from "@/core/Select";
import Typography from "@/core/Typography";
import { orderStatusLabel } from "@/helpers/constants";
import { pushState } from "@/helpers/utils";
import ChipToggleButtons, {
  Option as ChipOption,
} from "@/modules/ChipToggleButtons";
import { cn } from "@/styles/utils";
import { OrderFull } from "@/types/prisma";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import { FC, useEffect, useState } from "react";
import {
  Control,
  Controller,
  UseFormHandleSubmit,
  UseFormSetValue,
} from "react-hook-form";

type OrderSearchBarProps = {
  orders: OrderFull[];
  isLoading: boolean;
  className?: string;
  control: Control<SearchFormType>;
  onSubmit: UseFormHandleSubmit<SearchFormType>;
  setValue: UseFormSetValue<SearchFormType>;
};

export type SearchFormType = {
  orderDate: {
    min: Date;
    max: Date;
  } | null;
  storeId?: string;
  status?: string[];
};

const setFilterValues = (
  params: URLSearchParams | ReadonlyURLSearchParams,
  setValue: UseFormSetValue<SearchFormType>,
) => {
  const orderDate = params.get("orderDate")?.split(",");
  const storeId = params.get("storeId");
  const status = params.get("status")?.split(",");

  orderDate
    ? setValue("orderDate", {
        min: new Date(orderDate[0]),
        max: new Date(orderDate[1]),
      })
    : setValue("orderDate", null);
  storeId ? setValue("storeId", storeId) : setValue("storeId", undefined);
  status ? setValue("status", status) : setValue("status", undefined);
};

const OrderSearchBar: FC<OrderSearchBarProps> = ({
  orders,
  isLoading,
  className,
  control,
  onSubmit: handleSubmit,
  setValue,
}) => {
  const [showBar, setShowBar] = useState<boolean>(false);
  const params = useSearchParams();

  useEffect(() => {
    setFilterValues(params, setValue);
  }, [params, setValue]);

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

  const toggleBar = () => setShowBar((b) => !b);

  const handleSearch = (data: SearchFormType) => {
    let params: string[] = [];
    if (data.orderDate && data.orderDate.min && data.orderDate.max) {
      params.push(`orderDate=${data.orderDate.min},${data.orderDate.max}`);
    }
    if (data.storeId) {
      params.push(`storeId=${data.storeId}`);
    }
    if (data.status && data.status.length > 0) {
      params.push(`status=${data.status.join(",")}`);
    }
    pushState(params.join("&"));
    toggleBar();
  };

  const clear = () => {
    handleSearch({
      orderDate: null,
    });
    setValue("orderDate", null);
    setValue("storeId", undefined);
    setValue("status", undefined);
  };

  const handleClose = () => {
    toggleBar();
    const currentParams = new URLSearchParams(window.location.search);
    setFilterValues(currentParams, setValue);
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
          onSubmit={handleSubmit(handleSearch)}
        >
          <div className="flex h-full flex-col overflow-y-auto overflow-x-hidden">
            <div className="mt-3 flex flex-col">
              <Typography>Fecha de Pedido</Typography>
              <Controller
                name="orderDate"
                control={control}
                render={({ field }) => (
                  <DateRangePicker
                    variant="standard"
                    onChange={field.onChange}
                    value={field.value}
                    maxDate={new Date()}
                  />
                )}
              />
            </div>
            <div className="mt-3 flex flex-col">
              <Typography>Tienda</Typography>
              <Controller
                name="storeId"
                control={control}
                render={({ field }) => (
                  <Select
                    variant="standard"
                    options={storeOptions}
                    onChange={field.onChange}
                    value={field.value}
                    allowSearch
                    clearValue
                    searchPlaceholder="Busca una tienda"
                  />
                )}
              />
            </div>
            <div className="mt-3 flex flex-col">
              <Typography>Estado</Typography>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <ChipToggleButtons
                    options={statusOptions}
                    onChange={field.onChange}
                    value={field.value}
                  />
                )}
              />
            </div>
          </div>
          <Button type="submit" StartIcon={Icons.Search}>
            Buscar
          </Button>
          <Button variant="outline" onClick={clear} className="mt-2">
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

export default OrderSearchBar;
