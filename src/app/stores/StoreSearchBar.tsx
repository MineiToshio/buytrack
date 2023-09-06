import SearchBar, {
  ChipToggleField,
  TextToggleField,
} from "@/components/modules/SearchBar";
import { FilterDefinition } from "@/hooks/useFilters";
import { FC, useMemo } from "react";
import {
  Control,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import { SearchFormType } from "./StoresList";
import { StoreFull } from "@/types/prisma";
import { Option as ChipOption } from "@/modules/ChipToggleButtons";

type StoreSearchBarProps = {
  stores: StoreFull[];
  isLoading: boolean;
  className?: string;
  control: Control<SearchFormType>;
  filterDefinition: FilterDefinition<SearchFormType>;
  onSubmit: UseFormHandleSubmit<SearchFormType>;
  setValue: UseFormSetValue<SearchFormType>;
  register: UseFormRegister<SearchFormType>;
};

const StoreSearchBar: FC<StoreSearchBarProps> = ({
  stores,
  isLoading,
  className,
  control,
  filterDefinition,
  onSubmit,
  setValue,
  register,
}) => {
  const productTypeOptions = useMemo(
    () =>
      stores
        .map((s) => s.productTypes)
        .flat()
        .reduce((acc: ChipOption[], curr) => {
          if (curr && acc.find((a) => a.value === curr.productType.id) == null)
            acc.push({
              label: curr.productType.name,
              value: curr.productType.id,
            });
          return acc;
        }, []),
    [stores],
  );

  const productsCountryOptions = useMemo(
    () =>
      stores
        .map((s) => s.productsCountry)
        .flat()
        .reduce((acc: ChipOption[], curr) => {
          if (curr && acc.find((a) => a.value === curr.country.id) == null)
            acc.push({
              label: curr.country.name,
              value: curr.country.id,
            });
          return acc;
        }, []),
    [stores],
  );

  return (
    <SearchBar
      isLoading={isLoading}
      className={className}
      onSubmit={onSubmit}
      setValue={setValue}
      filterDefinition={filterDefinition}
    >
      <TextToggleField
        title="Nombre"
        placeholder="Nombre de la tienda"
        formField="name"
        register={register}
      />
      <ChipToggleField
        title="Productos"
        control={control}
        formField="productTypes"
        options={productTypeOptions}
      />
      <ChipToggleField
        title="Países de importación"
        control={control}
        formField="productsCountry"
        options={productsCountryOptions}
      />
    </SearchBar>
  );
};

export default StoreSearchBar;
