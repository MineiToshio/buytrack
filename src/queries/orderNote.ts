import { db } from "@/helpers/db";
import { OrderNote } from "@prisma/client";

export const getNotesByOrder = (orderId: string) =>
  db.orderNote.findMany({
    where: { orderId },
    orderBy: { createdDate: "desc" },
  });

export const createorderNote = (
  orderNote: Omit<OrderNote, "id" | "createdDate">,
) =>
  db.orderNote.create({
    data: orderNote,
  });