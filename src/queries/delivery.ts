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
    await updateOrderStatusToInRoute(tx);
    await updateOrderStatusToPartialInRoute(tx);
    return createdDelivery;
  });

export const updateDelivery = (
  deliveryId: string,
  userId: string,
  delivery: Partial<Delivery>,
) =>
  db.$transaction(async (tx) => {
    await tx.delivery.update({
      data: delivery,
      where: {
        id: deliveryId,
        orderProducts: { some: { order: { userId } } },
      },
    });
    await updateOrderStatusToInRoute(tx);
    await updateOrderStatusToDelivered(tx);
    await updateOrderStatusToPartialInRoute(tx);
    await updateOrderStatusToPartialDelivered(tx);
  });

export const deleteDelivery = (deliveryId: string) =>
  db.$transaction(async (tx) => {
    await tx.orderProduct.updateMany({
      data: { deliveryId: null },
      where: { deliveryId: deliveryId },
    });
    await updateOrderStatusToOpen(tx);
    await updateOrderStatusToPartialInRoute(tx);
    return await tx.delivery.delete({
      where: {
        id: deliveryId,
      },
    });
  });
