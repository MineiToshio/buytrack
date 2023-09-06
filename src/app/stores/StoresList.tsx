"use client";

import Button from "@/components/core/Button";
import Icons from "@/components/core/Icons";
import FiltersInfo from "@/components/modules/FiltersInfo";
import { GET_STORE } from "@/helpers/apiUrls";
import useFilters, { FilterDefinition, FilterType } from "@/hooks/useFilters";
import { cn } from "@/styles/utils";
import { StoreFull } from "@/types/prisma";
import Link from "next/link";
import { FC, useMemo } from "react";
import StoreTable from "./StoreTable";
import StoreSearchBar from "./StoreSearchBar";

type StoresListProps = {
  stores: StoreFull[];
};

export type SearchFormType = {
  name?: string;
  productTypes?: string[];
  productsCountry?: string[];
};

const StoresList: FC<StoresListProps> = ({ stores }) => {
  const filterDefinition: FilterDefinition<SearchFormType> = useMemo(
    () => [
      {
        type: FilterType.text,
        attribute: "name",
        title: "Nombre",
      },
      {
        type: FilterType.list,
        attribute: "productTypes",
        title: "Productos",
        finderFunc: (productTypeIds: string[]) => {
          const productTypesFilters: { label: string; value: string }[] = [];
          const productTypes = stores.map((s) => s.productTypes).flat();
          productTypeIds.forEach((p) => {
            const productType = productTypes.find(
              (pt) => pt?.productType.id === p,
            );
            if (productType) {
              productTypesFilters.push({
                label: productType.productType.name,
                value: productType.productType.id,
              });
            }
          });
          return productTypesFilters;
        },
      },
      {
        type: FilterType.list,
        attribute: "productsCountry",
        title: "Países de importación",
        finderFunc: (productsCountryIds: string[]) => {
          const productsCountryFilters: { label: string; value: string }[] = [];
          const productsCountry = stores.map((s) => s.productsCountry).flat();
          productsCountryIds.forEach((p) => {
            const productCountry = productsCountry.find(
              (pc) => pc?.country.id === p,
            );
            if (productCountry) {
              productsCountryFilters.push({
                label: productCountry.country.name,
                value: productCountry.country.id,
              });
            }
          });
          return productsCountryFilters;
        },
      },
    ],
    [stores],
  );

  const {
    hasFilters,
    control,
    filteredItems,
    filteredInfo,
    isLoading,
    register,
    setValue,
    onFilterDelete,
    onSubmit,
  } = useFilters<SearchFormType, StoreFull>(
    filterDefinition,
    GET_STORE,
    "stores",
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
          <StoreSearchBar
            stores={stores}
            isLoading={isLoading}
            className="w-1/2 md:w-fit"
            control={control}
            onSubmit={onSubmit}
            setValue={setValue}
            filterDefinition={filterDefinition}
            register={register}
          />
          <Link href="/stores/new" className="mb-4 w-1/2 md:mb-0 md:w-fit">
            <Button className="w-full md:w-fit" StartIcon={Icons.Add}>
              Agregar Tienda
            </Button>
          </Link>
        </div>
      </div>
      {isLoading ? (
        <div className="flex w-full justify-center">
          <Icons.Loader className="animate-spin text-muted" size={40} />
        </div>
      ) : (
        <StoreTable stores={filteredItems} hasFilters={false} />
      )}
    </>
  );
};

export default StoresList;
