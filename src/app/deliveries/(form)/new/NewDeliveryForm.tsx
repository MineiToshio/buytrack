"use client";

import { CREATE_DELIVERY } from "@/helpers/apiUrls";
import { post } from "@/helpers/request";
import useRouter from "@/hooks/useRouter";
import { OrderWithProducts, UserFull } from "@/types/prisma";
import { Delivery, Store } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { FC, useState } from "react";
import { SubmitHandler } from "react-hook-form";
import DeliveryForm, { DeliveryFormType } from "../DeliveryForm";
import { formatDeliveryFormData } from "../utils";

type NewDeliveryFormProps = {
  user: UserFull;
  stores: Store[];
  orders: OrderWithProducts[];
};

const createDelivery = (data: DeliveryFormType, currencyId: string) => {
  const delivery = formatDeliveryFormData(data, currencyId);
  return post<Delivery>(CREATE_DELIVERY, delivery);
};

const NewDeliveryForm: FC<NewDeliveryFormProps> = ({
  user,
  stores,
  orders,
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, setIsPending] = useState<boolean>(false);

  const storeId = searchParams.get("storeId");
  const orderId = searchParams.get("orderId");

  const { isLoading, mutate } = useMutation({
    mutationFn: (data: DeliveryFormType) =>
      createDelivery(data, user.currencyId!),
    onSuccess: (newDelivery) => {
      setIsPending(true);
      router.push(`/deliveries/${newDelivery?.id}`);
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
      user={user}
    />
  );
};

export default NewDeliveryForm;
