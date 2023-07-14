"use client";

import { OrderFull } from "@/types/prisma";
import { FC } from "react";
import OrderForm from "../OrderForm";

type ViewOrderFormProps = {
  order?: OrderFull | null;
};

const ViewOrderForm: FC<ViewOrderFormProps> = ({ order }) => {
  const handleSubmit = () => {};

  return <OrderForm onSubmit={handleSubmit} order={order} />;
};

export default ViewOrderForm;
