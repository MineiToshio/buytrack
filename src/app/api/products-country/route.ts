import { apiResponses } from "@/helpers/api";
import { authOptions } from "@/helpers/auth";
import {
  createProductsCountry,
  getProductsCountries,
  getProductsCountryByName,
} from "@/queries/productsCountry";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { z } from "zod";

const reqPostSchema = z.object({
  name: z.string(),
});

export const GET = async () => {
  try {
    const countries = await getProductsCountries();
    return apiResponses(countries).success;
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

    const { name } = reqPostSchema.parse(body);

    const existingCountry = await getProductsCountryByName(name);

    if (existingCountry) {
      return apiResponses(`You already have a country named ${name}.`)
        .badRequest;
    }

    const newCountry = await createProductsCountry({ name });
    return apiResponses(newCountry).success;
  } catch (error) {
    return apiResponses(error).error;
  }
};
