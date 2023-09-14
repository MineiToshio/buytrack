"use client";

import { StoreFull } from "@/types/prisma";
import { FC } from "react";
import StoreForm from "../StoreForm";

type ViewStoreFormProps = {
  store: StoreFull | null;
};

const ViewStoreForm: FC<ViewStoreFormProps> = ({ store }) => {
  const handleSubmit = () => {};

  return <StoreForm onSubmit={handleSubmit} store={store} />;
};

export default ViewStoreForm;
