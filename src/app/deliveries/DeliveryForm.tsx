"use client";

import Button from "@/core/Button";
import Icons from "@/core/Icons";
import { CREATE_CURRENCY, GET_CURRENCY } from "@/helpers/apiUrls";
import useSelect, { formatOptions } from "@/hooks/useSelect";
import FormRow from "@/modules/FormRow";
import { OrderWithProducts } from "@/types/prisma";
import { Currency, Delivery, Store } from "@prisma/client";
import { FC, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import DeliveryProducts from "./DeliveryProducts";
import { cn } from "@/styles/utils";

export type DeliveryFormType = {
  storeId: string;
  currencyId: string;
  price: number;
  currier?: string;
  tracking?: string;
  approximateDeliveryDate: {
    min?: Date;
    max?: Date;
  };
  products: string[];
};

type DeliveryFormProps = {
  stores: Store[];
  orders: OrderWithProducts[];
  delivery?: Delivery;
  isLoading?: boolean;
  onSubmit: (data: DeliveryFormType) => void;
};

const DeliveryForm: FC<DeliveryFormProps> = ({
  stores,
  orders,
  delivery,
  isLoading,
  onSubmit,
}) => {
  const [isReadOnly, setIsReadOnly] = useState<boolean>(!!delivery);
  const [ordersWithProducts, setOrdersWithProducts] = useState<
    OrderWithProducts[]
  >([]);

  const storeOptions = formatOptions(stores);

  const { options: currencyOptions, addNewOption: addNewCurrency } =
    useSelect<Currency>(["currencies"], GET_CURRENCY, CREATE_CURRENCY);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<DeliveryFormType>();

  const handleStoreChange = (storeId: string) => {
    const currentOrders = orders.filter((p) => p.storeId === storeId);
    setOrdersWithProducts(currentOrders);
    setValue("products", []);
  };

  return (
    <div className="flex flex-col gap-x-4 md:flex-row">
      <form className="flex w-full flex-col" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex w-full flex-col gap-x-4 md:flex-row">
          <div className="flex w-full flex-col md:w-3/5">
            <FormRow
              title="Tienda"
              Icon={Icons.Store}
              placeholder="Selecciona una tienda"
              searchPlaceholder="Busca una tienda"
              type="select"
              options={storeOptions}
              control={control}
              formField="storeId"
              readOnly={isReadOnly}
              allowSearch
              required
              error={!!errors.storeId}
              errorMessage="La tienda es obligatoria"
              onChange={handleStoreChange}
            />
            {!(
              isReadOnly &&
              (delivery?.maxApproximateDeliveryDate == null ||
                delivery?.minApproximateDeliveryDate == null)
            ) && (
              <FormRow
                title="Fecha aprox. de entrega"
                Icon={Icons.CalendarDays}
                placeholder="Selecciona el rango de entrega"
                type="dateRangePicker"
                control={control}
                formField="approximateDeliveryDate"
                readOnly={isReadOnly}
                minDate={new Date()}
              />
            )}
            <FormRow
              title="Currier"
              Icon={Icons.Currier}
              placeholder="Olva, Rappi, Motorizado"
              type="input"
              readOnly={isReadOnly}
              {...register("currier")}
            />
            <FormRow
              title="Tracking"
              Icon={Icons.Currier}
              placeholder="123456789"
              type="input"
              readOnly={isReadOnly}
              {...register("tracking")}
            />
            <FormRow
              title="Moneda"
              Icon={Icons.Coins}
              placeholder="Elige el tipo de moneda"
              type="select"
              options={currencyOptions}
              control={control}
              formField="currencyId"
              newModalTitle="Nueva moneda"
              onAdd={addNewCurrency}
              required
              error={!!errors.currencyId}
              errorMessage="La moneda es obligatoria"
              readOnly={isReadOnly}
            />
            <FormRow
              title="Precio"
              Icon={Icons.Money}
              placeholder="1234"
              type="input"
              readOnly={isReadOnly}
              error={!!errors.price}
              errorMessage="El precio es obligatorio"
              min={0}
              {...register("price", { required: true, valueAsNumber: true })}
            />
          </div>
          <div
            className={cn(
              "flex w-full flex-col overflow-y-auto rounded-md border p-2 md:w-2/5",
              { "border-error": !!errors.products },
            )}
          >
            <Controller
              name="products"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <DeliveryProducts
                  orders={ordersWithProducts}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </div>
        </div>
        {!isReadOnly && (
          <Button type="submit" className="mt-5 w-fit" isLoading={isLoading}>
            Guardar
          </Button>
        )}
      </form>
    </div>
  );
};

export default DeliveryForm;
