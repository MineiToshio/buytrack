import { db } from "@/helpers/db";
import { addDays, createId } from "@/helpers/utils";
import { OrderArrivalStatus, Transaction } from "@/types/prisma";
import { DateRange } from "@/types/types";
import { Order, OrderPayment, OrderStatus, Prisma } from "@prisma/client";

type OrderCreate =
  | (Prisma.Without<Prisma.OrderCreateInput, Prisma.OrderUncheckedCreateInput> &
      Prisma.OrderUncheckedCreateInput)
  | (Prisma.Without<Prisma.OrderUncheckedCreateInput, Prisma.OrderCreateInput> &
      Prisma.OrderCreateInput);

type ProductCreate = {
  productName: string;
  price?: number;
};

type ProductUpdate = {
  id?: string;
  productName: string;
  price?: number;
};

type OrderCompute = Order & {
  orderPayments: OrderPayment[];
};

export const computeOrder = <T extends OrderCompute>(order: T) => {
  const today = new Date();
  let arrivalStatus = OrderArrivalStatus.Pending;

  if (
    order.status === OrderStatus.Canceled ||
    order.status === OrderStatus.Delivered
  ) {
    arrivalStatus = OrderArrivalStatus.Completed;
  } else if (
    order.maxApproximateDeliveryDate &&
    order.minApproximateDeliveryDate
  ) {
    const maxDelivery = addDays(order.maxApproximateDeliveryDate, 1).getTime();
    const minDelivery = order.minApproximateDeliveryDate.getTime();

    if (maxDelivery < today.getTime()) {
      arrivalStatus = OrderArrivalStatus.Delayed;
    } else if (
      minDelivery <= today.getTime() &&
      maxDelivery >= today.getTime()
    ) {
      arrivalStatus = OrderArrivalStatus.OnTime;
    }
  }

  const paidAmount = order.orderPayments.reduce(
    (acc, curr) => acc + curr.amount,
    0,
  );

  return {
    ...order,
    paidAmount,
    remainingPayment: order.productsCost - paidAmount,
    arrivalStatus,
  };
};

export const getOrdersByUser = async (userId: string) => {
  const orders = await db.order.findMany({
    where: { userId },
    orderBy: { orderDate: "desc" },
    include: {
      products: {
        orderBy: { productName: "asc" },
        include: { delivery: true },
      },
      orderNotes: { orderBy: { createdDate: "desc" } },
      orderPayments: { orderBy: { paymentDate: "desc" } },
      store: true,
      currency: true,
      review: true,
    },
  });
  return orders.map((o) => computeOrder(o));
};

export const filterOrdersByUser = async (
  userId: string,
  orderDate?: DateRange,
  storeId?: string,
  status?: OrderStatus[],
) => {
  const orders = await db.order.findMany({
    where: {
      userId,
      ...(orderDate && {
        orderDate: {
          gte: orderDate.min,
          lte: orderDate.max,
        },
      }),
      ...(storeId && { storeId }),
      ...(status && { status: { in: status } }),
    },
    orderBy: { orderDate: "desc" },
    include: {
      products: {
        orderBy: { productName: "asc" },
        include: { delivery: true },
      },
      orderNotes: { orderBy: { createdDate: "desc" } },
      orderPayments: { orderBy: { paymentDate: "desc" } },
      store: true,
      currency: true,
      review: true,
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
        orderBy: { productName: "asc" },
        include: { delivery: true },
      },
      orderNotes: { orderBy: { createdDate: "desc" } },
      orderPayments: { orderBy: { paymentDate: "desc" } },
      store: true,
      currency: true,
      review: true,
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

export const getOrdersWithoutDeliveredProducts = (
  userId: string,
  currentDeliveryId?: string,
) =>
  db.order.findMany({
    where: {
      OR: [
        {
          status: {
            in: ["Open", "In_Route", "Partial_Delivered", "Partial_In_Route"],
          },
          userId,
          products: {
            some: { deliveryId: null },
          },
        },
        ...(currentDeliveryId
          ? [
              {
                userId,
                products: {
                  some: { deliveryId: currentDeliveryId },
                },
              },
            ]
          : []),
      ],
    },
    include: {
      products: {
        where: {
          OR: [
            { deliveryId: null },
            ...(currentDeliveryId ? [{ deliveryId: currentDeliveryId }] : []),
          ],
        },
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

// No product has a scheduled delivery
export const updateOrderStatusToOpen = (tx: Transaction) =>
  tx.order.updateMany({
    data: {
      status: OrderStatus.Open,
      deliveryDate: null,
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
      deliveryDate: null,
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
      deliveryDate: new Date(),
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
      deliveryDate: null,
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
      deliveryDate: null,
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

export const updateOrder = (
  orderId: string,
  userId: string,
  order: Partial<Order>,
  orderProducts?: ProductUpdate[],
) =>
  db.$transaction(
    async (tx) => {
      const productsIds =
        orderProducts?.filter((o) => o.id != null)?.map((o) => o.id) ?? [];

      await tx.order.update({
        data: {
          ...order,
        },
        where: {
          id: orderId,
          userId,
        },
      });
      await tx.orderProduct.deleteMany({
        where: {
          orderId,
          // @ts-ignore: items will never be undefined because of filter in orderProductsIds
          id: { notIn: productsIds },
        },
      });

      if (orderProducts) {
        const dbName = Prisma.raw(process.env.DATABASE_NAME ?? "");

        await tx.$executeRaw`
          INSERT INTO \`${dbName}\`.OrderProduct (id, orderId, productName, price)
          VALUES ${Prisma.join(
            orderProducts.map(
              (field) =>
                Prisma.sql`(${Prisma.join([
                  field.id ?? createId(),
                  orderId,
                  field.productName,
                  field.price,
                ])})`,
            ),
          )}
          ON DUPLICATE KEY UPDATE
            orderId = VALUES(orderId),
            productName = VALUES(productName),
            price = VALUES(price);
        `;
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
