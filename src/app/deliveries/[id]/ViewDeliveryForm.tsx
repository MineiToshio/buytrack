"use client";

import { DeliveryFull, OrderWithProducts } from "@/types/prisma";
import { Store } from "@prisma/client";
import { FC } from "react";
import DeliveryForm from "../DeliveryForm";

type ViewDeliveryFormProps = {
  delivery?: DeliveryFull | null;
  stores: Store[];
  orders: OrderWithProducts[];
};

const ViewDeliveryForm: FC<ViewDeliveryFormProps> = ({
  orders,
  stores,
  delivery,
}) => {
  const handleSubmit = () => {};

  return (
    <DeliveryForm
      onSubmit={handleSubmit}
      orders={orders}
      stores={stores}
      delivery={delivery}
    />
  );
};

export default ViewDeliveryForm;
