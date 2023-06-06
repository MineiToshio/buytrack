import { authOptions } from "@/helpers/auth";
import {
  createProductType,
  getProductTypes,
  getProductTypeByName,
} from "@/queries/productType";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const reqPostSchema = z.object({
  name: z.string(),
});

export const GET = async () => {
  try {
    const countries = await getProductTypes();
    return NextResponse.json(countries, { status: 200 });
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
        { status: 401 }
      );
    }

    const { name } = reqPostSchema.parse(body);

    const existingCountry = await getProductTypeByName(name);

    if (existingCountry) {
      return NextResponse.json(
        {
          error: `You already have a product type named ${name}.`,
          createdApiKey: null,
        },
        { status: 400 }
      );
    }

    const newCountry = await createProductType({ name });
    return NextResponse.json(newCountry, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};
