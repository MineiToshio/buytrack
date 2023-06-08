import { db } from "@/helpers/db";
import { Prisma } from "@prisma/client";

type StoreData =
  | (Prisma.Without<Prisma.StoreCreateInput, Prisma.StoreUncheckedCreateInput> &
      Prisma.StoreUncheckedCreateInput)
  | (Prisma.Without<Prisma.StoreUncheckedCreateInput, Prisma.StoreCreateInput> &
      Prisma.StoreCreateInput);

export const getStores = () => db.store.findMany({ orderBy: { name: "asc" } });

export const getStoreById = (id: string) =>
  db.store.findFirst({ where: { id } });

export const createStore = (
  store: StoreData,
  storeCountryIds: string[],
  productTypeIds: string[]
) =>
  db.store.create({
    data: {
      ...store,
      productsCountry: {
        create: storeCountryIds.map((c) => ({
          country: {
            connect: { id: c },
          },
        })),
      },
      productTypes: {
        create: productTypeIds.map((p) => ({
          productType: {
            connect: { id: p },
          },
        })),
      },
    },
  });
