import Button from "@/components/core/Button";
import DateRangePicker from "@/components/core/DateRangePicker";
import Icons from "@/components/core/Icons";
import Typography from "@/components/core/Typography";
import ChipToggleButtons from "@/components/modules/ChipToggleButtons";
import Select, { Option as SelectOption } from "@/core/Select";
import { deliveryStatusData } from "@/helpers/constants";
import { pushState } from "@/helpers/utils";
import { cn } from "@/styles/utils";
import { DeliveryFull, isDeliveryStatus } from "@/types/prisma";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import { FC, useEffect, useState } from "react";
import {
  Control,
  Controller,
  UseFormHandleSubmit,
  UseFormSetValue,
  useForm,
} from "react-hook-form";

export type SearchFormType = {
  approximateDeliveryDate: {
    min: Date;
    max: Date;
  } | null;
  storeId?: string;
  status?: string[];
};

type DeliverySearchBarProps = {
  deliveries: DeliveryFull[];
  isLoading: boolean;
  className?: string;
  control: Control<SearchFormType>;
  onSubmit: UseFormHandleSubmit<SearchFormType>;
  setValue: UseFormSetValue<SearchFormType>;
};

const setFilterValues = (
  params: URLSearchParams | ReadonlyURLSearchParams,
  setValue: UseFormSetValue<SearchFormType>,
) => {
  const orderDate = params.get("orderDate")?.split(",");
  const storeId = params.get("storeId");
  const status = params.get("status")?.split(",");

  orderDate
    ? setValue("approximateDeliveryDate", {
        min: new Date(orderDate[0]),
        max: new Date(orderDate[1]),
      })
    : setValue("approximateDeliveryDate", null);
  storeId ? setValue("storeId", storeId) : setValue("storeId", undefined);
  status ? setValue("status", status) : setValue("status", undefined);
};

const DeliverySearchBar: FC<DeliverySearchBarProps> = ({
  deliveries,
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

  const statusOptions = Object.entries(deliveryStatusData)
    .map(([key, value]) => ({
      label: value.label,
      value: key,
    }))
    .filter((s) => isDeliveryStatus(s.value));

  const storeOptions = deliveries
    .map((d) => ({ label: d.store.name, value: d.store.id }))
    .reduce((acc: SelectOption[], curr) => {
      if (acc.find((a) => a.value === curr.value) == null) acc.push(curr);
      return acc;
    }, []);

  const toggleBar = () => setShowBar((b) => !b);

  const handleSearch = (data: SearchFormType) => {
    let params: string[] = [];
    if (
      data.approximateDeliveryDate &&
      data.approximateDeliveryDate.min &&
      data.approximateDeliveryDate.max
    ) {
      params.push(
        `approximateDeliveryDate=${data.approximateDeliveryDate.min},${data.approximateDeliveryDate.max}`,
      );
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
      approximateDeliveryDate: null,
    });
    setValue("approximateDeliveryDate", null);
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
              <Typography>Entrega aprox.</Typography>
              <Controller
                name="approximateDeliveryDate"
                control={control}
                render={({ field }) => (
                  <DateRangePicker
                    variant="standard"
                    placeholder=""
                    onChange={field.onChange}
                    value={field.value}
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

export default DeliverySearchBar;
