"use client";

import { CREATE_STORE } from "@/helpers/apiUrls";
import { post } from "@/helpers/request";
import { generateId } from "@/helpers/utils";
import useRouter from "@/hooks/useRouter";
import { Store } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { FC, useState } from "react";
import { SubmitHandler } from "react-hook-form";
import slugify from "slugify";
import StoreForm, { StoreFormType } from "../StoreForm";

const createStore = async (data: StoreFormType) => {
  const randomString = generateId(5);
  const url = slugify(`${data.name}-${randomString}`);
  return post<Store>(CREATE_STORE, { ...data, url });
};

const NewStoreForm: FC = () => {
  const router = useRouter();
  const [isPending, setIsPending] = useState<boolean>(false);

  const { isLoading, mutate } = useMutation({
    mutationFn: (data: StoreFormType) => createStore(data),
    onSuccess: () => {
      setIsPending(true);
      router.push("/stores");
      // This refresh is to force the await in /stores page
      router.refresh();
    },
  });

  const submitHandler: SubmitHandler<StoreFormType> = (data) => {
    mutate(data);
  };

  return (
    <StoreForm onSubmit={submitHandler} isLoading={isLoading || isPending} />
  );
};

export default NewStoreForm;
