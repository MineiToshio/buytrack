"use client";

import Button from "@/core/Button";
import Icons from "@/core/Icons";
import { GET_ORDER } from "@/helpers/apiUrls";
import { orderStatusLabel } from "@/helpers/constants";
import { get } from "@/helpers/request";
import { formatDate, pushState } from "@/helpers/utils";
import { usePushStateListener } from "@/hooks/usePushStateListener";
import FiltersInfo from "@/modules/FiltersInfo";
import { cn } from "@/styles/utils";
import { OrderFull, isOrderStatus } from "@/types/prisma";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import { FC, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import OrderSearchBar, { SearchFormType } from "./OrderSearchBar";
import OrderTable from "./OrderTable";

type FilterParams = {
  orderDate?: string;
  storeId?: string;
  status?: string;
};

type OrdersListProps = {
  orders: OrderFull[];
};

const isFilterParamsKey = (value: string): value is keyof FilterParams =>
  value === "orderDate" || value === "storeId" || value === "status";

const getOrders = (params: FilterParams) => {
  const searchParams: string[] = [];
  if (params.orderDate) {
    searchParams.push(`orderDate=${params.orderDate}`);
  }
  if (params.storeId) {
    searchParams.push(`storeId=${params.storeId}`);
  }
  if (params.status) {
    searchParams.push(`status=${params.status}`);
  }
  return get<OrderFull[]>(`${GET_ORDER}?${searchParams.join("&")}`);
};

const getFilterParams = (params: URLSearchParams | ReadonlyURLSearchParams) => {
  const orderDate = params.get("orderDate") ?? undefined;
  const storeId = params.get("storeId") ?? undefined;
  const status = params.get("status") ?? undefined;

  return {
    orderDate,
    storeId,
    status,
  };
};

const OrdersList: FC<OrdersListProps> = ({ orders }) => {
  const params = useSearchParams();
  const [filterParams, setFilterParams] = useState<FilterParams>(() =>
    getFilterParams(params),
  );
  const { control, handleSubmit, setValue } = useForm<SearchFormType>();

  usePushStateListener((filterParams) => {
    const filterData = getFilterParams(filterParams);
    setFilterParams(filterData);
  });

  const { data: filteredOrders, isLoading } = useQuery(
    [
      "orders",
      filterParams.orderDate,
      filterParams.status,
      filterParams.storeId,
    ],
    () => getOrders(filterParams),
  );

  const filteredData = useMemo(() => {
    let orderDate, status, storeId;
    if (filterParams.orderDate) {
      const dates = filterParams.orderDate.split(",");
      orderDate = {
        order: 1,
        title: "Fecha de Pedido",
        value: `${formatDate(dates[0])} - ${formatDate(dates[1])}`,
      };
    }
    if (filterParams.storeId) {
      const storeOrder = orders.find((s) => s.storeId === filterParams.storeId);
      storeId = {
        order: 2,
        title: "Tienda",
        value: storeOrder?.store.name,
      };
    }
    if (filterParams.status) {
      const statusArray = filterParams.status.split(",");
      const statusFilters: { label: string; value: string }[] = [];
      statusArray.forEach((s) => {
        if (isOrderStatus(s)) {
          statusFilters.push({ label: orderStatusLabel[s], value: s });
        }
      });
      if (statusArray.length !== Object.entries(orderStatusLabel).length) {
        status = {
          order: 3,
          title: "Estados",
          value: statusFilters,
        };
      }
    }

    return {
      orderDate,
      status,
      storeId,
    };
  }, [
    filterParams.orderDate,
    filterParams.status,
    filterParams.storeId,
    orders,
  ]);

  const hasFilters = useMemo(() => {
    let hasFilter = false;
    Object.values(filteredData).forEach((value) => {
      if (value != null) {
        hasFilter = true;
      }
    });
    return hasFilter;
  }, [filteredData]);

  const handleFilterDelete = (searchKey: string, searchValue?: string) => {
    let params: string[] = [];
    Object.entries(filterParams).forEach(([key, value]) => {
      if (value && isFilterParamsKey(key)) {
        if (key !== searchKey) {
          params.push(`${key}=${value}`);
        } else if (searchValue) {
          const values = value.split(",");
          const newValues = values.filter((v) => v !== searchValue);
          if (newValues.length > 0) {
            params.push(`${key}=${newValues.join(",")}`);
            setValue(key, newValues);
          } else {
            setValue(key, undefined);
          }
        } else {
          setValue(key, undefined);
        }
      }
    });
    pushState(params.join("&"));
  };

  return (
    <>
      <div
        className={cn(
          "mb-6 flex w-full flex-col-reverse justify-end gap-10 md:flex-row",
          { "justify-between": hasFilters },
        )}
      >
        {hasFilters && (
          <FiltersInfo
            filteredData={filteredData}
            onDelete={handleFilterDelete}
          />
        )}
        <div className="flex min-w-fit gap-2">
          <OrderSearchBar
            orders={orders}
            isLoading={isLoading}
            className="w-1/2 md:w-fit"
            control={control}
            onSubmit={handleSubmit}
            setValue={setValue}
          />
          <Link href="/orders/new" className="mb-4 w-1/2 md:mb-0 md:w-fit">
            <Button className="w-full md:w-fit">Agregar Pedido</Button>
          </Link>
        </div>
      </div>
      {isLoading ? (
        <div className="flex w-full justify-center">
          <Icons.Loader className="animate-spin text-muted" size={40} />
        </div>
      ) : (
        <OrderTable orders={filteredOrders} hasFilters={hasFilters} />
      )}
    </>
  );
};

export default OrdersList;
