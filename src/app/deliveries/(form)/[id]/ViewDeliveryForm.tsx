"use client";

import { DeliveryFull, OrderWithProducts } from "@/types/prisma";
import { Store } from "@prisma/client";
import { FC } from "react";
import DeliveryForm, { DeliveryFormType } from "../DeliveryForm";
import { formatDeliveryFormData } from "../utils";
import { put } from "@/helpers/request";
import { UPDATE_DELIVERY } from "@/helpers/apiUrls";
import { useMutation } from "@tanstack/react-query";
import { SubmitHandler } from "react-hook-form";

type ViewDeliveryFormProps = {
  delivery?: DeliveryFull | null;
  stores: Store[];
  orders: OrderWithProducts[];
};

const updateDelivery = (data: DeliveryFormType, deliveryId: string) => {
  const delivery = formatDeliveryFormData(data, deliveryId);
  return put(UPDATE_DELIVERY, delivery);
};

const ViewDeliveryForm: FC<ViewDeliveryFormProps> = ({
  orders,
  stores,
  delivery,
}) => {
  const { isLoading, mutate } = useMutation({
    mutationFn: ({
      data,
      deliveryId,
    }: {
      data: DeliveryFormType;
      deliveryId: string;
    }) => updateDelivery(data, deliveryId),
  });

  const handleSubmit: SubmitHandler<DeliveryFormType> = (data) => {
    if (delivery) {
      mutate({ data, deliveryId: delivery.id });
    }
  };

  return (
    <DeliveryForm
      onSubmit={handleSubmit}
      orders={orders}
      stores={stores}
      delivery={delivery}
      isLoading={isLoading}
    />
  );
};

export default ViewDeliveryForm;
