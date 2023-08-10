"use client";

import { CREATE_ORDER } from "@/helpers/apiUrls";
import { post } from "@/helpers/request";
import useRouter from "@/hooks/useRouter";
import { Order } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { FC, useState } from "react";
import { SubmitHandler } from "react-hook-form";
import OrderForm, { OrderFormType } from "../OrderForm";

const createOrder = (data: OrderFormType) => {
  const newOrder = {
    storeId: data.storeId,
    productsCost: data.productsCost,
    ...(data.orderDate && { orderDate: new Date(data.orderDate) }),
    ...(data.approximateDeliveryDate?.min && {
      minApproximateDeliveryDate: data.approximateDeliveryDate?.min,
    }),
    ...(data.approximateDeliveryDate?.max && {
      maxApproximateDeliveryDate: data.approximateDeliveryDate?.max,
    }),
    currencyId: data.currencyId,
    products: data.products.map((p) => ({
      productName: p.productName,
      ...(p.price && { price: p.price }),
    })),
  };
  return post<Order>(CREATE_ORDER, newOrder);
};

const NewOrderForm: FC = () => {
  const router = useRouter();
  const [isPending, setIsPending] = useState<boolean>(false);

  const { isLoading, mutate } = useMutation({
    mutationFn: (data: OrderFormType) => createOrder(data),
    onSuccess: () => {
      setIsPending(true);
      router.push("/orders");
      // This refresh is to force the await in /orders page
      router.refresh();
    },
  });

  const handleSubmit: SubmitHandler<OrderFormType> = (data) => {
    mutate(data);
  };

  return (
    <OrderForm onSubmit={handleSubmit} isLoading={isLoading || isPending} />
  );
};

export default NewOrderForm;
