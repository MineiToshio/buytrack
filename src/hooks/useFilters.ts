import { formatDate, pushState } from "@/helpers/utils";
import { useQuery } from "@tanstack/react-query";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { usePushStateListener } from "./usePushStateListener";

export enum FilterType {
  dateRange,
  text,
  list,
}

type TextDefinition = {
  type: FilterType.text;
  finderFunc: (id: string) => string | undefined;
};

type ListDefinition = {
  type: FilterType.list;
  finderFunc: (ids: string[]) => Array<{ label: string; value: string }>;
};

type DefaultDefinition = {
  type: FilterType.dateRange;
  finderFunc?: undefined;
};

export type DataDefinition = Array<
  {
    attribute: string;
    title: string;
  } & (TextDefinition | ListDefinition | DefaultDefinition)
>;

type FilterParams = Record<string, string | undefined>;

const getFilterParams = (
  params: URLSearchParams | ReadonlyURLSearchParams,
  dataDefinition: DataDefinition,
) => {
  let filterParams = {};
  dataDefinition.forEach((d) => {
    const data = params.get(d.attribute) ?? undefined;
    filterParams = {
      ...filterParams,
      [d.attribute]: data,
    };
  });

  return filterParams;
};

const useFilters = <SearchFormType extends FieldValues, FilteredItem>(
  dataDefinition: DataDefinition,
  queryKey: string,
  filterFn: (params: FilterParams) => Promise<FilteredItem[] | undefined>,
) => {
  const params = useSearchParams();
  const [filterParams, setFilterParams] = useState<FilterParams>(() =>
    getFilterParams(params, dataDefinition),
  );

  usePushStateListener((filterParams) => {
    const filterData = getFilterParams(filterParams, dataDefinition);
    setFilterParams(filterData);
  });

  const filterKeys = useMemo(
    () => dataDefinition.map((d) => filterParams[d.attribute]),
    [dataDefinition, filterParams],
  );

  const {
    data: filteredItems,
    isFetching,
    refetch,
  } = useQuery([queryKey, ...filterKeys], () => filterFn(filterParams));

  const { control, handleSubmit, setValue } = useForm<SearchFormType>();

  const filteredInfo = useMemo(() => {
    let filters = {};
    dataDefinition.forEach((d, i) => {
      if (filterParams[d.attribute]) {
        if (d.type === FilterType.dateRange) {
          const dates = filterParams[d.attribute]!.split(",");
          filters = {
            ...filters,
            [d.attribute]: {
              order: i,
              title: d.title,
              value: `${formatDate(dates[0])} - ${formatDate(dates[1])}`,
            },
          };
        } else if (d.type === FilterType.text) {
          const value = d.finderFunc(filterParams[d.attribute]!);
          if (value) {
            filters = {
              ...filters,
              [d.attribute]: {
                order: i,
                title: d.title,
                value,
              },
            };
          }
        } else if (d.type === FilterType.list) {
          const listArray = filterParams[d.attribute]!.split(",");
          const listFilters = d.finderFunc(listArray);
          filters = {
            ...filters,
            [d.attribute]: {
              order: i,
              title: d.title,
              value: listFilters,
            },
          };
        }
      }
    });

    return filters;
  }, [dataDefinition, filterParams]);

  const hasFilters = useMemo(() => {
    let hasFilter = false;
    Object.values(filteredInfo).forEach((value) => {
      if (value != null) {
        hasFilter = true;
      }
    });
    return hasFilter;
  }, [filteredInfo]);

  const onFilterDelete = (searchKey: string, searchValue?: string) => {
    let params: string[] = [];
    Object.entries(filterParams).forEach(([key, value]) => {
      if (value) {
        if (key !== searchKey) {
          params.push(`${key}=${value}`);
        } else if (searchValue) {
          const values = value.split(",");
          const newValues = values.filter((v) => v !== searchValue);
          if (newValues.length > 0) {
            params.push(`${key}=${newValues.join(",")}`);
            // @ts-ignore TODO: Fix this later
            setValue(key, newValues);
          } else {
            // @ts-ignore TODO: Fix this later
            setValue(key, undefined);
          }
        } else {
          // @ts-ignore TODO: Fix this later
          setValue(key, undefined);
        }
      }
    });
    pushState(params.join("&"));
  };

  return {
    hasFilters,
    control,
    filteredItems,
    filteredInfo,
    isLoading: isFetching,
    refetch,
    setValue,
    onFilterDelete,
    onSubmit: handleSubmit,
  };
};

export default useFilters;
