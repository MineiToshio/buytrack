"use client";

import { CREATE_DELIVERY } from "@/helpers/apiUrls";
import { post } from "@/helpers/request";
import { OrderWithProducts } from "@/types/prisma";
import { Delivery, Store } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { FC, useState } from "react";
import { SubmitHandler } from "react-hook-form";
import DeliveryForm, { DeliveryFormType } from "../DeliveryForm";

type NewDeliveryFormProps = {
  stores: Store[];
  orders: OrderWithProducts[];
};

const createDelivery = (data: DeliveryFormType) => {
  const delivery = {
    ...data,
    ...(data.approximateDeliveryDate?.min && {
      minApproximateDeliveryDate: data.approximateDeliveryDate?.min,
    }),
    ...(data.approximateDeliveryDate?.max && {
      maxApproximateDeliveryDate: data.approximateDeliveryDate?.max,
    }),
  };
  return post<Delivery>(CREATE_DELIVERY, delivery);
};

const NewDeliveryForm: FC<NewDeliveryFormProps> = ({ stores, orders }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, setIsPending] = useState<boolean>(false);

  const storeId = searchParams.get("storeId");
  const orderId = searchParams.get("orderId");

  const { isLoading, mutate } = useMutation({
    mutationFn: (data: DeliveryFormType) => createDelivery(data),
    onSuccess: () => {
      setIsPending(true);
      router.push("/deliveries");
      // This refresh is to force the await in /deliveries page
      router.refresh();
    },
  });

  const handleSubmit: SubmitHandler<DeliveryFormType> = (data) => {
    mutate(data);
  };

  return (
    <DeliveryForm
      defaults={{
        storeId,
        orderId,
      }}
      stores={stores}
      orders={orders}
      onSubmit={handleSubmit}
      isLoading={isLoading || isPending}
    />
  );
};

export default NewDeliveryForm;
