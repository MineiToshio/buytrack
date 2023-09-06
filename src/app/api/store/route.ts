import { apiResponses } from "@/helpers/api";
import { authOptions } from "@/helpers/auth";
import { createStore, filterStores, getStores } from "@/queries/store";
import { StoreType } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { z } from "zod";

const reqPostSchema = z.object({
  name: z.string(),
  url: z.string(),
  type: z.enum([StoreType.Business, StoreType.Person]),
  hasStock: z.boolean().optional(),
  receiveOrders: z.boolean().optional(),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  whatsapp: z.string().optional(),
  website: z.string().optional(),
  countryId: z.string(),
  productsCountryIds: z.string().array().optional(),
  productTypeIds: z.string().array().optional(),
});

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name") ?? undefined;
    const productTypes = searchParams.get("productTypes")?.split(",");
    const productsCountry = searchParams.get("productsCountry")?.split(",");

    const stores = await filterStores(name, productTypes, productsCountry);
    return apiResponses(stores).success;
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

    const { productsCountryIds, productTypeIds, ...country } =
      reqPostSchema.parse(body);

    const newStore = await createStore(
      country,
      productsCountryIds,
      productTypeIds,
    );
    return apiResponses(newStore).success;
  } catch (error) {
    return apiResponses(error).error;
  }
};
