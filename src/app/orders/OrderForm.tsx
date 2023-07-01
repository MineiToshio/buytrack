"use client";

import Button from "@/components/core/Button";
import Icons from "@/core/Icons";
import { GET_STORE } from "@/helpers/apiUrls";
import useSelect from "@/hooks/useSelect";
import FormRow from "@/modules/FormRow";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import OrderFormProducts from "./OrderFormProducts";

export type Product = {
  productName: string;
  price?: number;
};

export type OrderFormType = {
  storeId: string;
  orderDate: Date;
  approximateDeliveryDate: {
    min: Date;
    max: Date;
  };
  products: Product[];
  productsCost: number;
};

type OrderFormProps = {
  order?: {};
  isLoading?: boolean;
  onSubmit: (data: OrderFormType) => void;
};

const OrderForm: FC<OrderFormProps> = ({ isLoading, order, onSubmit }) => {
  const [isReadOnly, setIsReadOnly] = useState<boolean>(!!order);
  const { options: stores } = useSelect(["stores"], GET_STORE);

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
