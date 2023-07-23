import { db } from "@/helpers/db";

export const getOrderProductsByStore = (storeId: string) =>
  db.orderProduct.findMany({
    where: {
      order: { storeId },
      delivery: { delivered: false },
    },
  });

export const getOrderProductsNotDelivered = (userId: string) =>
  db.orderProduct.findMany({
    where: {
      deliveryId: null,
      order: { userId },
    },
    include: {
      order: true,
    },
    orderBy: [
      {
        order: { orderDate: "asc" },
      },
    ],
  });
