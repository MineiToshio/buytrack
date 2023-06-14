import { db } from "@/helpers/db";
import { Prisma } from "@prisma/client";

type StoreData =
  | (Prisma.Without<Prisma.StoreCreateInput, Prisma.StoreUncheckedCreateInput> &
      Prisma.StoreUncheckedCreateInput)
  | (Prisma.Without<Prisma.StoreUncheckedCreateInput, Prisma.StoreCreateInput> &
      Prisma.StoreCreateInput);

export const getStores = () =>
  db.store.findMany({
    include: {
      productsCountry: { include: { country: true } },
      productTypes: { include: { productType: true } },
    },
    orderBy: { name: "asc" },
  });

export const getStoreById = (id: string) =>
  db.store.findFirst({ where: { id } });

export const getStoreByUrl = (url: string) =>
  db.store.findFirst({
    where: { url },
    include: {
      productsCountry: { include: { country: true } },
      productTypes: { include: { productType: true } },
      country: true,
    },
  });

export const createStore = (
  store: StoreData,
  productsCountryIds?: string[],
  productTypeIds?: string[]
) =>
  db.store.create({
    data: {
      ...store,
      ...(productsCountryIds != null && {
        productsCountry: {
          create: productsCountryIds?.map((c) => ({
            country: {
              connect: { id: c },
            },
          })),
        },
      }),
      ...(productTypeIds != null && {
        productTypes: {
          create: productTypeIds?.map((p) => ({
            productType: {
              connect: { id: p },
            },
          })),
        },
      }),
    },
  });
