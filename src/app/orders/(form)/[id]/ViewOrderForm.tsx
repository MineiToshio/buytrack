"use client";

import { OrderFull } from "@/types/prisma";
import { FC } from "react";
import OrderForm, { OrderFormType } from "../OrderForm";
import { SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Order } from "@prisma/client";
import { UPDATE_ORDER } from "@/helpers/apiUrls";
import { put } from "@/helpers/request";
import { formatOrderFormData } from "../utils";

type ViewOrderFormProps = {
  order: OrderFull;
};

const updateOrder = (
  data: OrderFormType,
  currencyId: string,
  orderId: string,
) => {
  const updateOrder = formatOrderFormData(data, currencyId, orderId);
  return put<Order>(UPDATE_ORDER, updateOrder);
};

const ViewOrderForm: FC<ViewOrderFormProps> = ({ order }) => {
  const { isLoading, mutate } = useMutation({
    mutationFn: ({ data, orderId }: { data: OrderFormType; orderId: string }) =>
      updateOrder(data, order.currencyId, orderId),
  });

  const handleSubmit: SubmitHandler<OrderFormType> = (data) => {
    if (order) {
      mutate({ data, orderId: order.id });
    }
  };

  return (
    <OrderForm onSubmit={handleSubmit} order={order} isLoading={isLoading} />
  );
};

export default ViewOrderForm;
