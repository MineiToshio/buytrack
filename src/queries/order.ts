import { db } from "@/helpers/db";
import { OrderFull } from "@/types/prisma";
import {
  Delivery,
  Order,
  OrderPayment,
  OrderProduct,
  Prisma,
} from "@prisma/client";

type OrderData =
  | (Prisma.Without<Prisma.OrderCreateInput, Prisma.OrderUncheckedCreateInput> &
      Prisma.OrderUncheckedCreateInput)
  | (Prisma.Without<Prisma.OrderUncheckedCreateInput, Prisma.OrderCreateInput> &
      Prisma.OrderCreateInput);

type ProductCreate = {
  productName: string;
  price?: number;
};

type OrderCompute = Order & {
  products: (OrderProduct & {
    delivery: Delivery | null;
  })[];
  orderPayments: OrderPayment[];
};

const computeOrder = <T extends OrderCompute>(order: T) => ({
  ...order,
  paidAmount: order.orderPayments.reduce((acc, curr) => acc + curr.amount, 0),
});

export const getOrdersByUser = async (userId: string) => {
  const orders = await db.order.findMany({
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
  return orders.map((o) => computeOrder(o));
};

export const getOrderById = async (id: string, userId: string) => {
  const order = await db.order.findFirst({
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
  if (order) return computeOrder(order);
};

export const getOrderByOrderNote = (orderNoteId: string, userId: string) =>
  db.order.findFirst({
    where: {
      userId,
      orderNotes: { some: { id: orderNoteId } },
    },
  });

export const getOrdersWithoutDeliveredProducts = (userId: string) =>
  db.order.findMany({
    where: {
      userId,
      products: {
        some: { deliveryId: null },
      },
    },
    include: {
      products: {
        where: { deliveryId: null },
        orderBy: { productName: "asc" },
      },
    },
    orderBy: [
      {
        orderDate: "asc",
      },
      {
        id: "asc",
      },
    ],
  });

export const getOrderByOrderPayment = (
  orderPaymentId: string,
  userId: string,
) =>
  db.order.findFirst({
    where: {
      userId,
      orderPayments: { some: { id: orderPaymentId } },
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
