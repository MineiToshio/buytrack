"use client";

import Button from "@/components/core/Button";
import Icons from "@/components/core/Icons";
import { GET_ORDER } from "@/helpers/apiUrls";
import { get } from "@/helpers/request";
import { usePushStateListener } from "@/hooks/usePushStateListener";
import { OrderFull, isOrderStatus } from "@/types/prisma";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import { FC, useMemo, useState } from "react";
import OrderSearchBar from "./OrderSearchBar";
import OrderTable from "./OrderTable";
import StatusLegend from "./StatusLegend";
import Typography from "@/components/core/Typography";
import { formatDate } from "@/helpers/utils";
import { cn } from "@/styles/utils";
import { orderStatusLabel } from "@/helpers/constants";

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

  const filtersDescription = useMemo(() => {
    const filters: string[] = [];
    if (filterParams.orderDate) {
      const dates = filterParams.orderDate.split(",");
      filters.push(
        `Fecha de Pedido: ${formatDate(dates[0])} - ${formatDate(dates[1])}`,
      );
    }
    if (filterParams.storeId) {
      const storeOrder = orders.find((s) => s.storeId === filterParams.storeId);
      filters.push(`Tienda: ${storeOrder?.store.name}`);
    }
    if (filterParams.status) {
      const status = filterParams.status.split(",");
      const labelStatus = status.map((s) => {
        if (isOrderStatus(s)) {
          return orderStatusLabel[s];
        }
        return s;
      });
      filters.push(`Status: ${labelStatus.join(", ")}`);
    }
    return filters.join(" | ");
  }, [
    filterParams.orderDate,
    filterParams.status,
    filterParams.storeId,
    orders,
  ]);

  return (
    <>
      <div
        className={cn(
          "flex w-full flex-col-reverse justify-between md:flex-row",
          {
            "mb-5": !filtersDescription,
          },
        )}
      >
        <StatusLegend className="mr-2 justify-center md:justify-normal" />
        <div className="flex gap-2">
          <OrderSearchBar
            orders={orders}
            isLoading={isLoading}
            className="w-1/2 md:w-fit"
          />
          <Link
            href="/orders/new"
            className="mb-4 w-1/2 self-end md:mb-0 md:w-fit"
          >
            <Button className="w-full md:w-fit">Agregar Pedido</Button>
          </Link>
        </div>
      </div>
      {filtersDescription && (
        <div className="mb-5 mt-2 flex w-full justify-center md:justify-normal">
          <Typography color="muted" size="sm">
            {filtersDescription}
          </Typography>
        </div>
      )}
      {isLoading ? (
        <div className="flex w-full justify-center">
          <Icons.Loader className="animate-spin text-muted" size={40} />
        </div>
      ) : (
        <OrderTable
          orders={filteredOrders}
          hasFilters={filtersDescription.length > 0}
        />
      )}
    </>
  );
};

export default OrdersList;
