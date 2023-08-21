"use client";

import Button from "@/components/core/Button";
import Link from "next/link";
import { FC, useEffect, useMemo, useState } from "react";
import DeliveryTable from "./DeliveryTable";
import { DeliveryFull, isDeliveryStatus } from "@/types/prisma";
import { GET_DELIVERY } from "@/helpers/apiUrls";
import { get } from "@/helpers/request";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import { usePushStateListener } from "@/hooks/usePushStateListener";
import { useQuery } from "@tanstack/react-query";
import { formatDate } from "@/helpers/utils";
import { deliveryStatusData } from "@/helpers/constants";
import Icons from "@/components/core/Icons";
import Typography from "@/components/core/Typography";
import DeliverySearchBar from "./DeliverySearchBar";
import { cn } from "@/styles/utils";

type FilterParams = {
  approximateDeliveryDate?: string;
  storeId?: string;
  status?: string;
};

type DeliveriesListProps = {
  deliveries: DeliveryFull[];
};

const getDeliveries = (params: FilterParams) => {
  const searchParams: string[] = [];
  if (params.approximateDeliveryDate) {
    searchParams.push(
      `approximateDeliveryDate=${params.approximateDeliveryDate}`,
    );
  }
  if (params.storeId) {
    searchParams.push(`storeId=${params.storeId}`);
  }
  if (params.status) {
    searchParams.push(`status=${params.status}`);
  }
  return get<DeliveryFull[]>(`${GET_DELIVERY}?${searchParams.join("&")}`);
};

const getFilterParams = (params: URLSearchParams | ReadonlyURLSearchParams) => {
  const approximateDeliveryDate =
    params.get("approximateDeliveryDate") ?? undefined;
  const storeId = params.get("storeId") ?? undefined;
  const status = params.get("status") ?? undefined;

  return {
    approximateDeliveryDate,
    storeId,
    status,
  };
};

const DeliveriesList: FC<DeliveriesListProps> = ({ deliveries }) => {
  const params = useSearchParams();
  const [filterParams, setFilterParams] = useState<FilterParams>(() =>
    getFilterParams(params),
  );
  const [filteredDeliveries, setFilteredDeliveries] = useState<
    DeliveryFull[] | undefined
  >(undefined);

  usePushStateListener((filterParams) => {
    const filterData = getFilterParams(filterParams);
    setFilterParams(filterData);
  });

  const { data, isLoading } = useQuery(
    [
      "deliveries",
      filterParams.approximateDeliveryDate,
      filterParams.status,
      filterParams.storeId,
    ],
    () => getDeliveries(filterParams),
  );

  useEffect(() => {
    setFilteredDeliveries(data);
  }, [data]);

  const filtersDescription = useMemo(() => {
    const filters: string[] = [];
    if (filterParams.approximateDeliveryDate) {
      const dates = filterParams.approximateDeliveryDate.split(",");
      filters.push(
        `Fecha de Pedido: ${formatDate(dates[0])} - ${formatDate(dates[1])}`,
      );
    }
    if (filterParams.storeId) {
      const storeOrder = deliveries.find(
        (d) => d.storeId === filterParams.storeId,
      );
      filters.push(`Tienda: ${storeOrder?.store.name}`);
    }
    if (filterParams.status) {
      const status = filterParams.status.split(",");
      const deliveredArray = status?.filter((s) => isDeliveryStatus(s));

      if (
        deliveredArray &&
        deliveredArray.length === 1 &&
        isDeliveryStatus(deliveredArray[0])
      ) {
        filters.push(`Estado: ${deliveryStatusData[deliveredArray[0]].label}`);
      }
    }
    return filters.join(" | ");
  }, [
    filterParams.approximateDeliveryDate,
    filterParams.status,
    filterParams.storeId,
    deliveries,
  ]);

  return (
    <>
      <div
        className={cn("flex w-full justify-end gap-2", {
          "mb-5": !filtersDescription,
        })}
      >
        <DeliverySearchBar
          deliveries={deliveries}
          isLoading={isLoading}
          className="w-1/2 md:w-fit"
        />
        <Link href="/deliveries/new" className="w-1/2 md:w-fit">
          <Button className="w-full">Nueva Entrega</Button>
        </Link>
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
        <DeliveryTable
          deliveries={filteredDeliveries}
          onChange={setFilteredDeliveries}
          hasFilters={filtersDescription.length > 0}
        />
      )}
    </>
  );
};

export default DeliveriesList;
