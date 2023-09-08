import { apiResponses } from "@/helpers/api";
import { authOptions } from "@/helpers/auth";
import {
  createOrder,
  filterOrdersByUser,
  getOrderById,
  updateOrder,
} from "@/queries/order";
import { isOrderStatus } from "@/types/prisma";
import { OrderStatus } from "@prisma/client";
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

const reqPutSchema = z.object({
  orderId: z.string(),
  storeId: z.string().optional(),
  orderDate: z.string().pipe(z.coerce.date()).optional(),
  productsCost: z.number().optional(),
  minApproximateDeliveryDate: z.string().pipe(z.coerce.date()).optional(),
  maxApproximateDeliveryDate: z.string().pipe(z.coerce.date()).optional(),
  currencyId: z.string().optional(),
  status: z
    .enum([
      OrderStatus.Canceled,
      OrderStatus.Delivered,
      OrderStatus.In_Route,
      OrderStatus.Open,
      OrderStatus.Partial_Delivered,
      OrderStatus.Partial_In_Route,
    ])
    .optional(),
  products: z
    .array(
      z.object({
        id: z.string().optional(),
        productName: z.string(),
        price: z.number().optional(),
      }),
    )
    .optional(),
});

export const GET = async (req: NextRequest) => {
  try {
    const user = await getServerSession(authOptions).then((res) => res?.user);

    if (!user) {
      return apiResponses().unauthorized;
    }

    const { searchParams } = new URL(req.url);
    const orderDate = searchParams.get("orderDate")?.split(",");
    const storeId = searchParams.get("storeId") ?? undefined;
    const status = searchParams.get("status")?.split(",");

    const orderDateFilter = orderDate
      ? {
          min: new Date(orderDate[0]),
          max: new Date(orderDate[1]),
        }
      : undefined;

    const statusFilter = status?.reduce((acc: OrderStatus[], curr) => {
      if (isOrderStatus(curr)) {
        acc.push(curr);
      }
      return acc;
    }, []);

    const orders = await filterOrdersByUser(
      user.id,
      orderDateFilter,
      storeId,
      statusFilter,
    );
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

export const PUT = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const user = await getServerSession(authOptions).then((res) => res?.user);

    if (!user) {
      return apiResponses().unauthorized;
    }

    const { orderId, products, ...orderData } = reqPutSchema.parse(body);

    const order = getOrderById(orderId, user.id);

    if (!order) {
      return apiResponses().unauthorized;
    }

    await updateOrder(orderId, user.id, orderData, products);

    return apiResponses({
      id: orderId,
      products,
      ...orderData,
    }).success;
  } catch (error) {
    return apiResponses(error).error;
  }
};
