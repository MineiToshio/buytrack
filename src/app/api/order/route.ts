import { authOptions } from "@/helpers/auth";
import { createOrder, getOrdersByUser } from "@/queries/order";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
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
      return NextResponse.json(
        {
          error: "Unauthorized to perform this action.",
        },
        { status: 401 },
      );
    }

    const orders = await getOrdersByUser(user.id);
    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const user = await getServerSession(authOptions).then((res) => res?.user);

    if (!user) {
      return NextResponse.json(
        {
          error: "Unauthorized to perform this action.",
        },
        { status: 401 },
      );
    }

    const { products, ...order } = reqPostSchema.parse(body);

    const newOrder = await createOrder(
      {
        ...order,
        userId: user.id,
      },
      products,
    );
    return NextResponse.json(newOrder, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error }, { status: 500 });
  }
};
