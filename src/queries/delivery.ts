import { db } from "@/helpers/db";
import { Prisma } from "@prisma/client";

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
    },
    orderBy: {
      minApproximateDeliveryDate: "asc",
    }
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
    return createdDelivery;
  });
