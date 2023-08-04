import { apiResponses } from "@/helpers/api";
import { authOptions } from "@/helpers/auth";
import {
  createDelivery,
  deleteDelivery,
  getDeliveries,
  getDeliveryById,
} from "@/queries/delivery";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { z } from "zod";

const reqPostSchema = z.object({
  storeId: z.string(),
  currencyId: z.string(),
  price: z.number(),
  currier: z.string().optional(),
  tracking: z.string().optional(),
  minApproximateDeliveryDate: z.string().pipe(z.coerce.date()).optional(),
  maxApproximateDeliveryDate: z.string().pipe(z.coerce.date()).optional(),
  products: z.string().array(),
});

export const GET = async () => {
  try {
    const user = await getServerSession(authOptions).then((res) => res?.user);

    if (!user) {
      return apiResponses().unauthorized;
    }

    const deliveries = await getDeliveries(user.id);
    return apiResponses(deliveries).success;
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

    const { products, ...deliveryData } = reqPostSchema.parse(body);

    const newDelivery = await createDelivery(deliveryData, products);
    return apiResponses(newDelivery).success;
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

    const delivery = getDeliveryById(id, user.id);

    if (!delivery) {
      return apiResponses().unauthorized;
    }

    await deleteDelivery(id);
    return apiResponses({ success: true }).success;
  } catch (error) {
    return apiResponses(error).error;
  }
};
