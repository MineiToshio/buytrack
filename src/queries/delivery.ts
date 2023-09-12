import { db } from "@/helpers/db";
import { Delivery, Prisma } from "@prisma/client";
import {
  updateOrderStatusToDelivered,
  updateOrderStatusToInRoute,
  updateOrderStatusToOpen,
  updateOrderStatusToPartialDelivered,
  updateOrderStatusToPartialInRoute,
} from "./order";
import { DateRange } from "@/types/types";

type DeliveryCreate =
  | (Prisma.Without<
      Prisma.DeliveryCreateInput,
      Prisma.DeliveryUncheckedCreateInput
    > &
      Prisma.DeliveryUncheckedCreateInput)
  | (Prisma.Without<
      Prisma.DeliveryUncheckedCreateInput,
      Prisma.DeliveryCreateInput
    > &
      Prisma.DeliveryCreateInput);

export const getDeliveries = (userId: string) =>
  db.delivery.findMany({
    where: { orderProducts: { some: { order: { userId } } } },
    include: {
      orderProducts: true,
      currency: true,
      store: true,
    },
    orderBy: {
      minApproximateDeliveryDate: "asc",
    },
  });

export const filterDeliveries = (
  userId: string,
  approximateDeliveryDate?: DateRange,
  storeId?: string,
  delivered?: boolean,
) =>
  db.delivery.findMany({
    where: {
      orderProducts: { some: { order: { userId } } },
      ...(approximateDeliveryDate && {
        minApproximateDeliveryDate: {
          gte: approximateDeliveryDate.min,
          lte: approximateDeliveryDate.max,
        },
      }),
      ...(storeId && { storeId }),
      ...(delivered != null && { delivered }),
    },
    include: {
      orderProducts: true,
      currency: true,
      store: true,
    },
    orderBy: {
      minApproximateDeliveryDate: "asc",
    },
  });

export const getDeliveryById = (id: string, userId: string) =>
  db.delivery.findFirst({
    where: {
      id,
      orderProducts: { some: { order: { userId } } },
    },
    include: {
      orderProducts: true,
      currency: true,
      store: true,
    },
  });

export const createDelivery = (delivery: DeliveryCreate, products: string[]) =>
  db.$transaction(async (tx) => {
    const createdDelivery = await tx.delivery.create({
      data: delivery,
    });
    await tx.orderProduct.updateMany({
      data: { deliveryId: createdDelivery.id },
      where: { id: { in: products } },
    });
    await Promise.all([
      updateOrderStatusToInRoute(tx),
      updateOrderStatusToPartialInRoute(tx),
    ]);
    return createdDelivery;
  });

export const updateDelivery = (
  deliveryId: string,
  userId: string,
  delivery: Partial<Delivery>,
  products?: string[],
) =>
  db.$transaction(
    async (tx) => {
      await tx.delivery.update({
        data: delivery,
        where: {
          id: deliveryId,
          orderProducts: { some: { order: { userId } } },
        },
      });
      if (products) {
        await Promise.all([
          tx.orderProduct.updateMany({
            data: { deliveryId: null },
            where: { id: { notIn: products }, deliveryId },
          }),
          tx.orderProduct.updateMany({
            data: { deliveryId: deliveryId },
            where: { id: { in: products } },
          }),
        ]);
      }
      await Promise.all([
        updateOrderStatusToOpen(tx),
        updateOrderStatusToInRoute(tx),
        updateOrderStatusToDelivered(tx),
        updateOrderStatusToPartialInRoute(tx),
        updateOrderStatusToPartialDelivered(tx),
      ]);
    },
    { maxWait: 5000, timeout: 10000 },
  );

export const deleteDelivery = (deliveryId: string) =>
  db.$transaction(async (tx) => {
    await tx.orderProduct.updateMany({
      data: { deliveryId: null },
      where: { deliveryId: deliveryId },
    });
    await Promise.all([
      updateOrderStatusToOpen(tx),
      updateOrderStatusToPartialInRoute(tx),
    ]);
    return await tx.delivery.delete({
      where: {
        id: deliveryId,
      },
    });
  });
