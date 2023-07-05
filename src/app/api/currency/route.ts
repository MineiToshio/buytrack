import { authOptions } from "@/helpers/auth";
import {
  createCurrency,
  getCurrencies,
  getCurrencyByName,
} from "@/queries/currency";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const reqPostSchema = z.object({
  name: z.string(),
});

export const GET = async () => {
  try {
    const currencies = await getCurrencies();
    return NextResponse.json(currencies, { status: 200 });
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

    const { name } = reqPostSchema.parse(body);

    const existingCurrency = await getCurrencyByName(name);

    if (existingCurrency) {
      return NextResponse.json(
        {
          error: `You already have a currency named ${name}.`,
        },
        { status: 400 },
      );
    }

    const newCurrency = await createCurrency({ name });
    return NextResponse.json(newCurrency, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};
