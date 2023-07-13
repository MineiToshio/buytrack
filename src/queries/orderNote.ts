import { db } from "@/helpers/db";
import { OrderNote } from "@prisma/client";

export const getOrderNotesByOrder = (orderId: string) =>
  db.orderNote.findMany({
    where: { orderId },
    orderBy: { createdDate: "desc" },
  });

export const createOrderNote = (
  orderNote: Omit<OrderNote, "id" | "createdDate">,
) =>
  db.orderNote.create({
    data: orderNote,
  });

export const deleteOrderNote = (id: string) =>
  db.orderNote.delete({ where: { id } });
