import { db } from "@/helpers/db";
import { Transaction } from "@/types/prisma";
import {
  Delivery,
  Order,
  OrderPayment,
  OrderProduct,
  OrderStatus,
  Prisma,
} from "@prisma/client";

type OrderCreate =
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
      status: {
        in: ["Open", "In_Route", "Partial_Delivered", "Partial_In_Route"],
      },
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

export const createOrder = (order: OrderCreate, products: ProductCreate[]) =>
  db.order.create({
    data: {
      ...order,
      products: {
        create: products,
      },
    },
  });

export const updateOrder = (
  orderId: string,
  userId: string,
  order: Partial<Order>,
) =>
  db.order.update({
    data: order,
    where: {
      id: orderId,
      userId,
    },
  });

// No product has a scheduled delivery
export const updateOrderStatusToOpen = (tx: Transaction) =>
  tx.order.updateMany({
    data: {
      status: OrderStatus.Open,
    },
    where: {
      status: { notIn: ["Canceled", "Open"] },
      products: { every: { deliveryId: null } },
    },
  });

// All products have a scheduled delivery, but not all have been delivered.
export const updateOrderStatusToInRoute = (tx: Transaction) =>
  tx.order.updateMany({
    data: {
      status: OrderStatus.In_Route,
    },
    where: {
      status: { notIn: ["Canceled", "In_Route"] },
      AND: [
        { products: { every: { NOT: { deliveryId: null } } } },
        { products: { some: { delivery: { delivered: false } } } },
      ],
    },
  });

// All products have been delivered
export const updateOrderStatusToDelivered = (tx: Transaction) =>
  tx.order.updateMany({
    data: {
      status: OrderStatus.Delivered,
    },
    where: {
      status: { notIn: ["Canceled", "Delivered"] },
      products: { every: { delivery: { delivered: true } } },
    },
  });

// Some products have scheduled delivery and some have no delivery schedured
export const updateOrderStatusToPartialInRoute = (tx: Transaction) =>
  tx.order.updateMany({
    data: {
      status: OrderStatus.Partial_In_Route,
    },
    where: {
      status: { notIn: ["Canceled", "Partial_In_Route"] },
      AND: [
        { products: { some: { delivery: { delivered: false } } } },
        { products: { some: { deliveryId: null } } },
      ],
    },
  });

// Some products have been delivered and all other products have no delivery scheduled
export const updateOrderStatusToPartialDelivered = (tx: Transaction) =>
  tx.order.updateMany({
    data: {
      status: OrderStatus.Partial_Delivered,
    },
    where: {
      status: { notIn: ["Canceled", "Partial_Delivered"] },
      AND: [
        { products: { some: { delivery: { delivered: true } } } },
        { products: { none: { delivery: { delivered: false } } } },
        { products: { some: { deliveryId: null } } },
      ],
    },
  });
