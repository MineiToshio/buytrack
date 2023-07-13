import { apiResponses } from "@/helpers/api";
import { authOptions } from "@/helpers/auth";
import { getOrderById, getOrderByOrderPayment } from "@/queries/order";
import { createOrderPayment, deleteOrderPayment } from "@/queries/orderPayment";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { z } from "zod";

const reqPostSchema = z.object({
  orderId: z.string(),
  paymentDate: z.string().pipe(z.coerce.date()),
  amount: z.number(),
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

    const newOrderPayment = await createOrderPayment(data);
    return apiResponses(newOrderPayment).success;
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

    const order = getOrderByOrderPayment(id, user.id);

    if (!order) {
      return apiResponses().unauthorized;
    }

    await deleteOrderPayment(id);
    return apiResponses({ success: true }).success;
  } catch (error) {
    return apiResponses(error).error;
  }
};
