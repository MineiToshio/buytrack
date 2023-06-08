"use client";

import { FC } from "react";
import { SubmitHandler } from "react-hook-form";
import StoreForm, { StoreFormType } from "../StoreForm";
import { post } from "@/helpers/request";
import { CREATE_STORE } from "@/helpers/apiUrls";

const NewStoreForm: FC = () => {
  const submitHandler: SubmitHandler<StoreFormType> = (data) => {
    post(CREATE_STORE, data);
  };

  return <StoreForm onSubmit={submitHandler} />;
};

export default NewStoreForm;
