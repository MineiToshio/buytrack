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
import { UserSession } from "@/types/next-auth";

type NewOrderFormProps = {
  user: UserSession;
};

const createOrder = (data: OrderFormType, currencyId: string) => {
  const newOrder = formatOrderFormData(data, currencyId);
  return post<Order>(CREATE_ORDER, newOrder);
};

const NewOrderForm: FC<NewOrderFormProps> = ({ user }) => {
  const router = useRouter();
  const [isPending, setIsPending] = useState<boolean>(false);

  const { isLoading, mutate } = useMutation({
    mutationFn: (data: OrderFormType) => createOrder(data, user.currency?.id!),
    onSuccess: (newOrder) => {
      setIsPending(true);
      router.push(`/orders/${newOrder?.id}`);
    },
  });

  const handleSubmit: SubmitHandler<OrderFormType> = (data) => {
    mutate(data);
  };

  return (
    <OrderForm
      onSubmit={handleSubmit}
      isLoading={isLoading || isPending}
      user={user}
    />
  );
};

export default NewOrderForm;
