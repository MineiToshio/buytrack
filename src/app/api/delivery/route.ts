import { apiResponses } from "@/helpers/api";
import { authOptions } from "@/helpers/auth";
import {
  createDelivery,
  deleteDelivery,
  getDeliveries,
  getDeliveryById,
  updateDelivery,
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

const reqPutSchema = z.object({
  deliveryId: z.string(),
  storeId: z.string().optional(),
  currencyId: z.string().optional(),
  price: z.number().optional(),
  currier: z.string().optional(),
  tracking: z.string().optional(),
  minApproximateDeliveryDate: z.string().pipe(z.coerce.date()).optional(),
  maxApproximateDeliveryDate: z.string().pipe(z.coerce.date()).optional(),
  delivered: z.boolean().optional(),
  deliveryDate: z.string().pipe(z.coerce.date()).optional(),
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

export const PUT = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const user = await getServerSession(authOptions).then((res) => res?.user);

    if (!user) {
      return apiResponses().unauthorized;
    }

    const { deliveryId, ...deliveryData } = reqPutSchema.parse(body);

    const delivery = getDeliveryById(deliveryId, user.id);

    if (!delivery) {
      return apiResponses().unauthorized;
    }

    const updatedOrder = await updateDelivery(
      deliveryId,
      user.id,
      deliveryData,
    );
    return apiResponses(updatedOrder).success;
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
