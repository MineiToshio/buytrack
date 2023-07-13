import { apiResponses } from "@/helpers/api";
import { authOptions } from "@/helpers/auth";
import { createOrder, getOrdersByUser } from "@/queries/order";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { z } from "zod";

const reqPostSchema = z.object({
  storeId: z.string(),
  orderDate: z.string().pipe(z.coerce.date()),
  productsCost: z.number(),
  minApproximateDeliveryDate: z.string().pipe(z.coerce.date()).optional(),
  maxApproximateDeliveryDate: z.string().pipe(z.coerce.date()).optional(),
  currencyId: z.string(),
  products: z.array(
    z.object({
      productName: z.string(),
      price: z.number().optional(),
    }),
  ),
});

export const GET = async () => {
  try {
    const user = await getServerSession(authOptions).then((res) => res?.user);

    if (!user) {
      return apiResponses().unauthorized;
    }

    const orders = await getOrdersByUser(user.id);
    return apiResponses(orders).success;
  } catch (error) {
    return apiResponses(error).error;
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const user = await getServerSession(authOptions).then((res) => res?.user);

    if (!user) {
      return apiResponses().unauthorized;
    }

    const { products, ...order } = reqPostSchema.parse(body);

    const newOrder = await createOrder(
      {
        ...order,
        userId: user.id,
      },
      products,
    );
    return apiResponses(newOrder).success;
  } catch (error) {
    return apiResponses(error).error;
  }
};
