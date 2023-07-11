import { db } from "@/helpers/db";
import { OrderProduct, Prisma } from "@prisma/client";

type OrderData =
  | (Prisma.Without<Prisma.OrderCreateInput, Prisma.OrderUncheckedCreateInput> &
      Prisma.OrderUncheckedCreateInput)
  | (Prisma.Without<Prisma.OrderUncheckedCreateInput, Prisma.OrderCreateInput> &
      Prisma.OrderCreateInput);

type ProductCreate = {
  productName: string;
  price?: number;
};

export const getOrdersByUser = (userId: string) =>
  db.order.findMany({
    where: { userId },
    orderBy: { orderDate: "desc" },
    include: {
      products: {
        orderBy: { productName: "desc" },
        include: { delivery: true },
      },
      orderNotes: { orderBy: { createdDate: "desc" } },
      orderPayments: { orderBy: { paymentDate: "desc" } },
      store: true,
      currency: true,
    },
  });

export const getOrderById = (id: string, userId: string) =>
  db.order.findFirst({
    where: { userId, id },
    orderBy: { orderDate: "desc" },
    include: {
      products: {
        orderBy: { productName: "desc" },
        include: { delivery: true },
      },
      orderNotes: { orderBy: { createdDate: "desc" } },
      orderPayments: { orderBy: { paymentDate: "desc" } },
      store: true,
      currency: true,
    },
  });

export const getOrderByOrderNote = (orderNoteId: string, userId: string) =>
  db.order.findFirst({
    where: {
      userId,
      orderNotes: { some: { id: orderNoteId } },
    },
  });

export const createOrder = (order: OrderData, products: ProductCreate[]) =>
  db.order.create({
    data: {
      ...order,
      products: {
        create: products,
      },
    },
  });
