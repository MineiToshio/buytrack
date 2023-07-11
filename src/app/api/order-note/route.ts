import { apiResponses } from "@/helpers/api";
import { authOptions } from "@/helpers/auth";
import { getOrderById, getOrderByOrderNote } from "@/queries/order";
import { createOrderNote, deleteOrderNote } from "@/queries/orderNote";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { z } from "zod";

const reqPostSchema = z.object({
  note: z.string(),
  orderId: z.string(),
});

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const user = await getServerSession(authOptions).then((res) => res?.user);

    if (!user) {
      return apiResponses().unauthorized;
    }

    const data = reqPostSchema.parse(body);
    const order = getOrderById(data.orderId, user.id);

    if (!order) {
      return apiResponses().unauthorized;
    }

    const newOrderNote = await createOrderNote(data);
    return apiResponses(newOrderNote).success;
  } catch (error) {
    return apiResponses(error).error;
  }
};

export const DELETE = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const user = await getServerSession(authOptions).then((res) => res?.user);

    if (!user) {
      return apiResponses().unauthorized;
    }

    if (id == null || id?.trim() === "") {
      return apiResponses("The id is missing.").badRequest;
    }

    const order = getOrderByOrderNote(id, user.id);

    if (!order) {
      return apiResponses().unauthorized;
    }

    await deleteOrderNote(id);
    return apiResponses({ success: true }).success;
  } catch (error) {
    return apiResponses(error).error;
  }
};
