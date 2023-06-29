"use client";

import { FC } from "react";
import OrderForm, { OrderFormType } from "../OrderForm";
import { SubmitHandler } from "react-hook-form";

type NewOrderFormProps = {};

const NewOrderForm: FC<NewOrderFormProps> = ({}) => {
  const handleSubmit: SubmitHandler<OrderFormType> = (data) => {
    console.log(data);
  };

  return <OrderForm onSubmit={handleSubmit} />;
};

export default NewOrderForm;
