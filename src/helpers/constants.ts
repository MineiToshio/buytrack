import { StoreType } from "@prisma/client";

export const storeTypeLabel = {
  [StoreType.Business]: "Negocio",
  [StoreType.Person]: "Persona",
};

export const storeTypeOptions = Object.entries(storeTypeLabel).map(
  ([value, label]) => ({
    label,
    value,
  }),
);
