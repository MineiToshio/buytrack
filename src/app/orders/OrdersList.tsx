"use client";

import Button from "@/components/core/Button";
import Icons from "@/components/core/Icons";
import { GET_ORDER } from "@/helpers/apiUrls";
import { get } from "@/helpers/request";
import { usePushStateListener } from "@/hooks/usePushStateListener";
import { OrderFull } from "@/types/prisma";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import { FC, useState } from "react";
import OrderSearchBar from "./OrderSearchBar";
import OrderTable from "./OrderTable";
import StatusLegend from "./StatusLegend";

type FilterParams = {
  orderDate?: string;
  storeId?: string;
  status?: string;
};

type OrdersListProps = {
  orders: OrderFull[];
};

const getOrders = (params: FilterParams) => {
  const searchParams: string[] = []
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

const getFilterParams = (
  params: URLSearchParams | ReadonlyURLSearchParams,
) => {
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

  return (
    <>
      <div className="mb-5 flex w-full flex-col-reverse justify-between md:flex-row">
        <OrderSearchBar orders={orders} isLoading={isLoading} />
        <div className="flex">
          <StatusLegend className="mr-2" />
          <Link href="/orders/new" className="mb-4 self-end md:mb-0">
            <Button>Agregar Pedido</Button>
          </Link>
        </div>
      </div>
      {isLoading ? (
        <div className="flex w-full justify-center">
          <Icons.Loader className="animate-spin text-muted" size={40} />
        </div>
      ) : (
        <OrderTable orders={filteredOrders ?? []} />
      )}
    </>
  );
};

export default OrdersList;
