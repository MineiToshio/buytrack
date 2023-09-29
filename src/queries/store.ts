import { db } from "@/helpers/db";
import { Prisma, Store, StoreReview } from "@prisma/client";

type StoreData =
  | (Prisma.Without<Prisma.StoreCreateInput, Prisma.StoreUncheckedCreateInput> &
      Prisma.StoreUncheckedCreateInput)
  | (Prisma.Without<Prisma.StoreUncheckedCreateInput, Prisma.StoreCreateInput> &
      Prisma.StoreCreateInput);

type StoreCompute = Store & {
  storeReviews: StoreReview[];
};

const computeStore = <T extends StoreCompute>(store: T) => {
  if (store.storeReviews == null || store.storeReviews.length == 0) {
    return store;
  }

  return {
    ...store,
    rating:
      Math.round(
        (store.storeReviews.reduce((acc, curr) => acc + curr.rating, 0) /
          store.storeReviews.length) *
          10,
      ) / 10,
  };
};

export const getStores = async () => {
  const stores = await db.store.findMany({
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
      storeReviews: {
        orderBy: { createdDate: "desc" },
      },
    },
    orderBy: { name: "asc" },
  });
  return stores.map((s) => computeStore(s));
};

export const filterStores = async (
  name?: string,
  productTypeIds?: string[],
  productsCountryIds?: string[],
) => {
  const stores = await db.store.findMany({
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
      storeReviews: {
        orderBy: { createdDate: "desc" },
      },
    },
    orderBy: { name: "asc" },
  });
  return stores.map((s) => computeStore(s));
};

export const getStoreById = (id: string) =>
  db.store.findFirst({ where: { id } });

export const getStoreByUrl = async (url: string) => {
  const store = await db.store.findFirst({
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
      storeReviews: {
        orderBy: { createdDate: "desc" },
      },
    },
  });
  if (store) return computeStore(store);
};

export const getStoreByAvailableOrders = (
  userId: string,
  currentStoreId?: string,
) =>
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
      OR: [
        {
          orders: {
            some: {
              userId,
              products: { some: { deliveryId: null } },
              status: {
                in: [
                  "Open",
                  "In_Route",
                  "Partial_Delivered",
                  "Partial_In_Route",
                ],
              },
            },
          },
        },
        ...(currentStoreId
          ? [
              {
                id: currentStoreId,
              },
            ]
          : []),
      ],
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
