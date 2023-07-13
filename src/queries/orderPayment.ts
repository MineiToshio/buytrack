import { db } from "@/helpers/db";
import { OrderPayment } from "@prisma/client";

export const getOrderPaymentsByOrder = (orderId: string) =>
  db.orderPayment.findMany({
    where: { orderId },
    orderBy: { paymentDate: "desc" },
  });

export const createOrderPayment = (orderPayment: Omit<OrderPayment, "id">) =>
  db.orderPayment.create({
    data: orderPayment,
  });

export const deleteOrderPayment = (id: string) =>
  db.orderPayment.delete({ where: { id } });
