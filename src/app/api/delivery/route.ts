import { apiResponses } from "@/helpers/api";
import { authOptions } from "@/helpers/auth";
import { createDelivery } from "@/queries/delivery";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { z } from "zod";

const reqPostSchema = z.object({
  currencyId: z.string(),
  price: z.number(),
  currier: z.string().optional(),
  tracking: z.string().optional(),
  minApproximateDeliveryDate: z.string().pipe(z.coerce.date()).optional(),
  maxApproximateDeliveryDate: z.string().pipe(z.coerce.date()).optional(),
  products: z.string().array(),
});

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const user = await getServerSession(authOptions).then((res) => res?.user);

    if (!user) {
      return apiResponses().unauthorized;
    }

    const { products, ...deliveryData } = reqPostSchema.parse(body);

    const newDelivery = await createDelivery(deliveryData, products);
    return apiResponses(newDelivery).success;
  } catch (error) {
    return apiResponses(error).error;
  }
};
