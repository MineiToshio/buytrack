import { apiResponses } from "@/helpers/api";
import { authOptions } from "@/helpers/auth";
import { getOrderById } from "@/queries/order";
import { createorderNote } from "@/queries/orderNote";
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

    const newOrderNote = await createorderNote(data);
    return apiResponses(newOrderNote).success;
  } catch (error) {
    return apiResponses(error).error;
  }
};
