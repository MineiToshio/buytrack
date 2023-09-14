"use client";

import { CREATE_STORE } from "@/helpers/apiUrls";
import { post } from "@/helpers/request";
import { createId } from "@/helpers/utils";
import useRouter from "@/hooks/useRouter";
import { Store, StoreType } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { FC, useState } from "react";
import { SubmitHandler } from "react-hook-form";
import slugify from "slugify";
import StoreForm, { StoreFormType } from "../StoreForm";

const createStore = async (data: StoreFormType) => {
  const isBusiness = data.type === StoreType.Business;
  const { facebook, instagram, whatsapp, website, ...remainingData } = data;
  const randomString = createId(5);
  const url = slugify(`${data.name}-${randomString}`);
  return post<Store>(CREATE_STORE, {
    ...remainingData,
    ...(isBusiness && { facebook }),
    ...(isBusiness && { instagram }),
    ...(isBusiness && { whatsapp }),
    ...(isBusiness && { website }),
    url,
  });
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
