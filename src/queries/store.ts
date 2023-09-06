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
      productsCountry: {
        include: { country: true },
        orderBy: { country: { name: "asc" } },
      },
      productTypes: {
        include: { productType: true },
        orderBy: { productType: { name: "asc" } },
      },
      country: true,
    },
    orderBy: { name: "asc" },
  });

export const filterStores = (
  name?: string,
  productTypeIds?: string[],
  productsCountryIds?: string[],
) =>
  db.store.findMany({
    where: {
      ...(name && { name: { contains: name } }),
      ...(productTypeIds && {
        productTypes: { some: { idProductType: { in: productTypeIds } } },
      }),
      ...(productsCountryIds && {
        productsCountry: {
          some: { idProductsCountry: { in: productsCountryIds } },
        },
      }),
    },
    include: {
      productsCountry: {
        include: { country: true },
        orderBy: { country: { name: "asc" } },
      },
      productTypes: {
        include: { productType: true },
        orderBy: { productType: { name: "asc" } },
      },
      country: true,
    },
    orderBy: { name: "asc" },
  });

export const getStoreById = (id: string) =>
  db.store.findFirst({ where: { id } });

export const getStoreByUrl = (url: string) =>
  db.store.findFirst({
    where: { url },
    include: {
      productsCountry: {
        include: { country: true },
        orderBy: { country: { name: "asc" } },
      },
      productTypes: {
        include: { productType: true },
        orderBy: { productType: { name: "asc" } },
      },
      country: true,
    },
  });

export const getStoreByAvailableOrders = (userId: string) =>
  db.store.findMany({
    include: {
      orders: {
        include: { products: true },
        where: {
          userId,
          products: { some: { deliveryId: null } },
          status: { in: ["Open", "In_Route"] },
        },
      },
    },
    where: {
      orders: {
        some: {
          userId,
          products: { some: { deliveryId: null } },
          status: {
            in: ["Open", "In_Route", "Partial_Delivered", "Partial_In_Route"],
          },
        },
      },
    },
    orderBy: { name: "asc" },
  });

export const createStore = (
  store: StoreData,
  productsCountryIds?: string[],
  productTypeIds?: string[],
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
