"use client";

import { CREATE_ORDER } from "@/helpers/apiUrls";
import { post } from "@/helpers/request";
import useRouter from "@/hooks/useRouter";
import { Order } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { FC, useState } from "react";
import { SubmitHandler } from "react-hook-form";
import OrderForm, { OrderFormType } from "../OrderForm";
import { formatOrderFormData } from "../utils";

const createOrder = (data: OrderFormType) => {
  const newOrder = formatOrderFormData(data);
  return post<Order>(CREATE_ORDER, newOrder);
};

const NewOrderForm: FC = () => {
  const router = useRouter();
  const [isPending, setIsPending] = useState<boolean>(false);

  const { isLoading, mutate } = useMutation({
    mutationFn: (data: OrderFormType) => createOrder(data),
    onSuccess: (newOrder) => {
      setIsPending(true);
      router.push(`/orders/${newOrder?.id}`);
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
