"use client";

import Button from "@/components/core/Button";
import Icons from "@/components/core/Icons";
import FiltersInfo from "@/components/modules/FiltersInfo";
import { GET_DELIVERY } from "@/helpers/apiUrls";
import { deliveryStatusData } from "@/helpers/constants";
import useFilters, { FilterDefinition, FilterType } from "@/hooks/useFilters";
import { cn } from "@/styles/utils";
import { DeliveryFull, isDeliveryStatus } from "@/types/prisma";
import Link from "next/link";
import { FC, useMemo, useState } from "react";
import DeliverySearchBar from "./DeliverySearchBar";
import DeliveryTable from "./DeliveryTable";

type DeliveriesListProps = {
  deliveries: DeliveryFull[];
};

export type SearchFormType = {
  approximateDeliveryDate: {
    min: Date;
    max: Date;
  } | null;
  storeId?: string;
  status?: string[];
};

const DeliveriesList: FC<DeliveriesListProps> = ({ deliveries }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const filterDefinition: FilterDefinition<SearchFormType> = useMemo(
    () => [
      {
        type: FilterType.dateRange,
        attribute: "approximateDeliveryDate",
        title: "Entrega aprox.",
      },
      {
        type: FilterType.text,
        attribute: "storeId",
        title: "Tienda",
        finderFunc: (storeId: string) => {
          const storeDelivery = deliveries.find((d) => d.storeId === storeId);
          return storeDelivery?.store.name;
        },
      },
      {
        type: FilterType.list,
        attribute: "status",
        title: "Estado",
        finderFunc: (statusIds: string[]) => {
          const statusFilters: { label: string; value: string }[] = [];
          statusIds.forEach((s) => {
            if (isDeliveryStatus(s)) {
              statusFilters.push({
                label: deliveryStatusData[s].label,
                value: s,
              });
            }
          });
          return statusFilters;
        },
      },
    ],
    [deliveries],
  );

  const {
    hasFilters,
    control,
    filteredItems,
    filteredInfo,
    isLoading: isFetching,
    refetch,
    setValue,
    onFilterDelete,
    onSubmit,
  } = useFilters<SearchFormType, DeliveryFull>(
    filterDefinition,
    GET_DELIVERY,
    "deliveries",
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
          <DeliverySearchBar
            deliveries={deliveries}
            isLoading={isLoading}
            className="w-1/2 md:w-fit"
            control={control}
            onSubmit={onSubmit}
            setValue={setValue}
            filterDefinition={filterDefinition}
          />
          <Link href="/deliveries/new" className="w-1/2 md:w-fit">
            <Button className="w-full" StartIcon={Icons.Add}>
              Nueva Entrega
            </Button>
          </Link>
        </div>
      </div>
      {isLoading || isFetching ? (
        <div className="flex w-full justify-center">
          <Icons.Loader className="animate-spin text-muted" size={40} />
        </div>
      ) : (
        <DeliveryTable
          deliveries={filteredItems}
          setIsLoading={setIsLoading}
          refetch={refetch}
          hasFilters={hasFilters}
        />
      )}
    </>
  );
};

export default DeliveriesList;
