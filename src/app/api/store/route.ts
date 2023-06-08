import { authOptions } from "@/helpers/auth";
import { createStore, getStores } from "@/queries/store";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const reqPostSchema = z.object({
  name: z.string(),
  hasStock: z.boolean().optional(),
  receiveOrders: z.boolean().optional(),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  whatsapp: z.string().optional(),
  website: z.string().optional(),
  countryId: z.string(),
  storeCountryIds: z.string().array(),
  productTypeIds: z.string().array(),
});

export const GET = async () => {
  try {
    const countries = await getStores();
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

    const { storeCountryIds, productTypeIds, ...country } =
      reqPostSchema.parse(body);

    const newCountry = await createStore(
      country,
      storeCountryIds,
      productTypeIds
    );
    return NextResponse.json(newCountry, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error }, { status: 500 });
  }
};
