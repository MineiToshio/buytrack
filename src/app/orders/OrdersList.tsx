"use client";

import Button from "@/core/Button";
import Icons from "@/core/Icons";
import { GET_ORDER } from "@/helpers/apiUrls";
import { orderStatusLabel } from "@/helpers/constants";
import { get } from "@/helpers/request";
import useFilters, { DataDefinition, FilterType } from "@/hooks/useFilters";
import FiltersInfo from "@/modules/FiltersInfo";
import { cn } from "@/styles/utils";
import { OrderFull, isOrderStatus } from "@/types/prisma";
import Link from "next/link";
import { FC, useMemo } from "react";
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

const OrdersList: FC<OrdersListProps> = ({ orders }) => {
  const filterDefinition: DataDefinition = useMemo(
    () => [
      {
        type: FilterType.dateRange,
        attribute: "orderDate",
        title: "Fecha de Pedido",
      },
      {
        type: FilterType.text,
        attribute: "storeId",
        title: "Tienda",
        finderFunc: (storeId: string) => {
          const storeOrder = orders.find((s) => s.storeId === storeId);
          return storeOrder?.store.name;
        },
      },
      {
        type: FilterType.list,
        attribute: "status",
        title: "Estados",
        finderFunc: (statusIds: string[]) => {
          const statusFilters: { label: string; value: string }[] = [];
          statusIds.forEach((s) => {
            if (isOrderStatus(s)) {
              statusFilters.push({ label: orderStatusLabel[s], value: s });
            }
          });
          return statusFilters;
        },
      },
    ],
    [orders],
  );

  const {
    hasFilters,
    control,
    filteredItems,
    filteredInfo,
    isLoading,
    setValue,
    onFilterDelete,
    onSubmit,
  } = useFilters<SearchFormType, OrderFull>(
    filterDefinition,
    "orders",
    getOrders,
  );

  return (
    <>
      <div
        className={cn(
          "mb-6 flex w-full flex-col-reverse justify-end gap-0 md:flex-row md:gap-10",
          { "justify-between": hasFilters },
        )}
      >
        {hasFilters && (
          <FiltersInfo filteredData={filteredInfo} onDelete={onFilterDelete} />
        )}
        <div className="flex min-w-fit gap-2">
          <OrderSearchBar
            orders={orders}
            isLoading={isLoading}
            className="w-1/2 md:w-fit"
            control={control}
            onSubmit={onSubmit}
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
        <OrderTable orders={filteredItems} hasFilters={hasFilters} />
      )}
    </>
  );
};

export default OrdersList;
