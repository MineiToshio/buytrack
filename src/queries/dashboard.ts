import { deliveryStatus } from "@/helpers/constants";
import { db } from "@/helpers/db";
import { getMonthRange } from "@/helpers/utils";
import { UserSession } from "@/types/next-auth";
import { DeliveryStatus } from "@/types/prisma";
import { OrderStatus, Prisma } from "@prisma/client";
import { computeOrder } from "./order";

const DB_NAME = Prisma.raw(process.env.DATABASE_NAME ?? "");

type OrdersByStatusResponse = Array<{
  status: OrderStatus;
  count: number;
  productsCost: number;
  paidAmount: number | null;
}>;

export type OrderByStatus =
  | Record<
      OrderStatus,
      {
        count: number;
        productsCost: number;
        paidAmount: number;
        remainingPayment: number;
      }
    >
  | {};

export type DeliveryByStatus = Record<DeliveryStatus, number> | {};

type OrderByMonth = {
  year: number;
  month: number;
  quantity: number;
  cost: number;
};

export const getOrdersGroupByStatus = async (user: UserSession) => {
  const userId = Prisma.raw(user.id);
  const currencyId = Prisma.raw(user.currency?.id ?? "");

  const res: OrdersByStatusResponse = await db.$queryRaw`
    select
      o.status as 'status',
      count(distinct o.id) as 'count',
      sum(op.amount)  as 'paidAmount',
      (select sum(o2.productsCost) from buytrack.order o2 where o.status = o2.status) as 'productsCost'
    from \`${DB_NAME}\`.Order o
      left join \`${DB_NAME}\`.orderpayment op on o.id = op.orderId
    where o.userId = \'${userId}\'
      and o.currencyId = \'${currencyId}\'
    group by o.status
  `;

  return res.reduce(
    (acc: OrderByStatus, curr) => ({
      ...acc,
      [curr.status]: {
        count: Number(curr.count),
        productsCost: curr.productsCost,
        paidAmount: curr.paidAmount ?? 0,
        remainingPayment: curr.productsCost - (curr.paidAmount ?? 0),
      },
    }),
    {},
  );
};

export const getDeliveriesGroupByStatus = async (user: UserSession) => {
  const res = await db.delivery.groupBy({
    by: "delivered",
    _count: {
      _all: true,
    },
    where: {
      currencyId: user.currency?.id,
      orderProducts: { some: { order: { userId: user.id } } },
    },
  });

  return res.reduce(
    (acc: DeliveryByStatus, curr) => ({
      ...acc,
      [curr.delivered ? deliveryStatus.delivered : deliveryStatus.inRoute]:
        curr._count._all,
    }),
    {},
  );
};

export const getOrdersOfTheMonth = async (user: UserSession) => {
  const monthRange = getMonthRange();

  const orders = await db.order.findMany({
    include: {
      orderPayments: true,
    },
    where: {
      orderDate: {
        gte: monthRange.first,
        lte: monthRange.last,
      },
      currencyId: user.currency?.id,
      userId: user.id,
    },
  });
  return orders.map((o) => computeOrder(o));
};

export const getOrdersForThisMonth = async (user: UserSession) => {
  const monthRange = getMonthRange();

  const orders = await db.order.findMany({
    include: {
      orderPayments: true,
    },
    where: {
      AND: [
        {
          NOT: { status: OrderStatus.Canceled },
        },
        {
          NOT: { status: OrderStatus.Delivered },
        },
      ],
      minApproximateDeliveryDate: { lte: monthRange.last },
      currencyId: user.currency?.id,
      userId: user.id,
    },
  });
  return orders.map((o) => computeOrder(o));
};

export const getOrdersByMonth = (
  user: UserSession,
): Promise<OrderByMonth[]> => {
  const userId = Prisma.raw(user.id);
  const currencyId = Prisma.raw(user.currency?.id ?? "");

  return db.$queryRaw`
    select
      year(o.orderDate) as 'year',
      month(o.orderDate) as 'month',
      count(o.id) as 'quantity',
      sum(o.productsCost) as 'cost'
    from \`${DB_NAME}\`.Order o 
    where o.userId = \'${userId}\'
      and o.currencyId = \'${currencyId}\'
    group by year(o.orderDate), month(o.orderDate)
  `;
};
