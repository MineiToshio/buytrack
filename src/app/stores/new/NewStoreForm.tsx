"use client";

import { FC } from "react";
import { SubmitHandler } from "react-hook-form";
import StoreForm, { StoreFormType } from "../StoreForm";
import { post } from "@/helpers/request";
import { CREATE_STORE } from "@/helpers/apiUrls";
import { useMutation } from "@tanstack/react-query";
import { Store } from "@prisma/client";

const createStore = (data: StoreFormType) => post<Store>(CREATE_STORE, data);

const NewStoreForm: FC = () => {
  const { isLoading, mutate } = useMutation({
    mutationFn: (data: StoreFormType) => createStore(data),
  });

  const submitHandler: SubmitHandler<StoreFormType> = (data) => {
    mutate(data);
  };

  return <StoreForm onSubmit={submitHandler} isLoading={isLoading} />;
};

export default NewStoreForm;
