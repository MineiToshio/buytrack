"use client";

import Button from "@/components/core/Button";
import Icons from "@/core/Icons";
import { CREATE_CURRENCY, GET_CURRENCY, GET_STORE } from "@/helpers/apiUrls";
import useSelect from "@/hooks/useSelect";
import FormRow from "@/modules/FormRow";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import OrderFormProducts from "./OrderFormProducts";
import { Currency } from "@prisma/client";
import { OrderFull } from "@/types/prisma";

export type Product = {
  productName: string;
  price?: number;
};

export type OrderFormType = {
  storeId: string;
  orderDate: Date;
  approximateDeliveryDate: {
    min?: Date;
    max?: Date;
  };
  products: Product[];
  currencyId: string;
  productsCost: number;
};

type OrderFormProps = {
  order?: OrderFull | null;
  isLoading?: boolean;
  onSubmit: (data: OrderFormType) => void;
};

const OrderForm: FC<OrderFormProps> = ({ isLoading, order, onSubmit }) => {
  const [isReadOnly, setIsReadOnly] = useState<boolean>(!!order);
  const { options: stores } = useSelect(["stores"], GET_STORE);

  const { options: currencyOptions, addNewOption: addNewCurrency } =
    useSelect<Currency>(["currencies"], GET_CURRENCY, CREATE_CURRENCY);

  const {
    control,
    register,
    handleSubmit,
    getValues,
    setValue,
    setFocus,
    clearErrors,
    formState: { errors },
  } = useForm<OrderFormType>();

  useEffect(() => {
    if (order) {
      setValue("storeId", order.storeId);
      setValue("orderDate", order.orderDate);
      setValue("currencyId", order.currencyId);
      setValue("productsCost", order.productsCost);
      if (
        order.minApproximateDeliveryDate &&
        order.maxApproximateDeliveryDate
      ) {
        setValue("approximateDeliveryDate", {
          min: order.minApproximateDeliveryDate,
          max: order.maxApproximateDeliveryDate,
        });
      }
      order.products.forEach((p, i) => {
        setValue(`products.${i}.productName`, p.productName);
        p.price && setValue(`products.${i}.price`, p.price);
      });
    }
  }, [order, setValue]);

  const calculatePrice = () => {
    const values = getValues();
    const productsCost = values.products.reduce(
      (acc, curr) => acc + Number(!Number.isNaN(curr.price) ? curr.price : 0),
      0,
    );

    if (productsCost >= 0) {
      setValue("productsCost", productsCost);
      clearErrors("productsCost");
    }
  };

  return (
    <form className="flex w-full flex-col" onSubmit={handleSubmit(onSubmit)}>
      <FormRow
        title="Tienda"
        Icon={Icons.Store}
        placeholder="Selecciona una tienda"
        searchPlaceholder="Busca una tienda"
        type="select"
        options={stores}
        control={control}
        formField="storeId"
        readOnly={isReadOnly}
        allowSearch
        required
        error={!!errors.storeId}
        errorMessage="La tienda es obligatoria"
      />
      <FormRow
        title="Fecha de orden"
        Icon={Icons.Calendar}
        placeholder="Selecciona la fecha de orden"
        type="datepicker"
        control={control}
        formField="orderDate"
        readOnly={isReadOnly}
        maxDate={new Date()}
        required
        error={!!errors.orderDate}
        errorMessage="La fecha de orden es obligatoria"
      />
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
        title="Costo Total"
        Icon={Icons.Money}
        placeholder="1234"
        type="input"
        readOnly={isReadOnly}
        ButtonIcon={Icons.Calculator}
        onButtonClick={calculatePrice}
        error={!!errors.productsCost}
        errorMessage="El costo total es obligatorio"
        inputType="number"
        min={0}
        {...register("productsCost", { required: true, valueAsNumber: true })}
      />
      <OrderFormProducts
        control={control}
        formField="products"
        register={register}
        setFocus={setFocus}
        errors={errors.products}
        readOnly={isReadOnly}
      />
      {!isReadOnly && (
        <Button type="submit" className="mt-5 w-fit" isLoading={isLoading}>
          Guardar
        </Button>
      )}
    </form>
  );
};

export default OrderForm;
